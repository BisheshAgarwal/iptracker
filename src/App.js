import React, { Component } from 'react';
import axios from "axios";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import "./App.css";
import Aux from "./hoc/Auxiliary";

class App extends Component {
    state = {
        ip: "",
        loading: false,
        lat: null,
        long: null,
        visible: false,
        error: false,
        popupText: "",
        details: {
            ip: "",
            location: null,
            timezone: "",
            isp: ""
        }
    };
    
    inputChangedHandler = (event) => {
        this.setState({ip: event.target.value});
    }

    buttonClickedHandler = (event) => {
        if(this.state.ip) {
            event.preventDefault();
            const resetDetails = {
                ...this.state.details,
                ip: "",
                location: null,
                timezone: "",
                isp: ""
            };
            
            this.setState({loading: true, error: false, visible: false, details: resetDetails});
            axios.get("https://geo.ipify.org/api/v1?apiKey=at_ESmkEmHWwuoaogN8Ui9hGJiA3Anfj&ipAddress=" + this.state.ip)
                .then(response => {
                    if(response.data.location.lat && response.data.location.lng) {
                        const updatedDetails = {
                            ...this.state.details,
                            ip: response.data.ip,
                            location: response.data.location,
                            timezone: response.data.location.timezone,
                            isp: response.data.isp
                        }
                        this.setState({lat: response.data.location.lat, long: response.data.location.lng,details: updatedDetails, loading: false, visible: true});
                    }
                    else {
                        this.setState({loading: false, error: true});
                    }
                })
                .catch(error => {
                    this.setState({loading: false, error: true});
                    console.log(error);
                });
        }
    }
    
    reduceSize = (str) => {
        return str.replace(/^(.{7}[^\s]*).*/, "$1");
    }

    render() {
        if(this.state.lat && this.state.long) {
            var position = [this.state.lat, this.state.long];
        }
        let map = (<Map center={position} zoom={13}>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={position}>
                          <Popup>{this.state.details.isp}</Popup>
                        </Marker>
                    </Map>
                    );
        let spinner = null;
        let error = null;
        if(this.state.loading) {
            spinner = <div class="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>;
        }
        if(this.state.error) {
            error = <div className = "error">Invalid IP address</div>;
        }
        
        return(
            <Aux>
                <header className = "header">
                    <h1 className = "heading">IP Address Tracker</h1>
                    <input className = "input" required type = "text" placeholder = "Search for any IP address" onChange = {this.inputChangedHandler} value = {this.state.ip} />
                    <button className = "btn" onClick = {this.buttonClickedHandler} > 
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14"><path fill="000" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6"/></svg>
                    </button>
                    {error}
                    <div className = "details">
                        <div className = "detail">
                            <h3 className = "detail__heading">Ip address</h3>
                            <p className = "detail__text">{this.state.details.ip ? this.state.details.ip: "--"}</p>
                        </div>
                        <div className = "detail">
                            <h3 className = "detail__heading">Location</h3>
                            <p className = "detail__text">{this.state.details.ip ? this.reduceSize(this.state.details.location.city): "--"}</p>
                        </div>
                        <div className = "detail">
                            <h3 className = "detail__heading">Timezone</h3>
                            <p className = "detail__text">{this.state.details.ip ? this.state.details.timezone: "--"}</p>
                        </div>
                        <div className = "detail">
                            <h3 className = "detail__heading">Isp</h3>
                            <p className = "detail__text">{this.state.details.ip ? this.reduceSize(this.state.details.isp): "--"}</p>
                        </div>
                    </div>
                </header>
                {spinner}
                <div id="container" style = {{display: this.state.visible ? "block" : "none"}}>{map}</div>
            </Aux>
        );
    }
}

export default App;
