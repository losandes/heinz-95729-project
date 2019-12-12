import React from 'react';
import './TabSelector.css';


const TabSelector = (props) => {

    let style = {
        display: "block"
    };
    if (props.active) {
        style = {
            borderBottom: "4px solid #176ccc"
        }
    }

    return (
        <div onClick={props.clickHandler} className="TabSelector" style={style}>
            {props.text}
        </div>
    );
}

export default TabSelector;
