import React, { useState } from 'react';
import './Header.css';
import Jumbotron from "react-bootstrap/Jumbotron";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";


const Header = (props) => {

    let history = useHistory();
    const [query, setQuery] = useState("");

    let onInputChange = (event) => {
        setQuery(event.target.value);
    }

    let onButtonClick = () => {
        history.push("/search/" + query);
    }

    return (
        <Jumbotron className="home-banner">
            <div className="filter">
                <div className="banner-content">
                <h1 className="welcome-title">Welcome to Backrow Shop</h1>
                <h3 className="welcome-subtitle">Find the best products from the comfort of your home</h3>

                <div className="search-container">
                    <input id="search-bar" type="text" onChange={onInputChange} value={query} />
                    <button onClick={onButtonClick}><FontAwesomeIcon icon="search" /></button>
                </div>
                
                </div>
            </div>
        </Jumbotron>
    );
}

export default Header;
