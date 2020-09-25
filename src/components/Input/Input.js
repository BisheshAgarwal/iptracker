import React from "react";

const input = (props) => {
    return (
        <input 
            className = "input" 
            required 
            type = "text" 
            placeholder = "Search for any IP address" 
            onChange = {props.changed} 
            value = {props.value} 
        />
    );
}

export default input;