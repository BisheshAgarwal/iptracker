import React from "react";

const button = (props) => {
    return (
        <button className = "btn" onClick = {props.clicked}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14"><path fill="000" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6"/></svg>
        </button>
    );
}

export default button;