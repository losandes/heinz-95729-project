import React from 'react'
import './Navbar.css'
import Jumbotron from "react-bootstrap/Jumbotron";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Navbar = (props) => {

  return (
    <div className="menu">
        <div className="menu-item first-item">
            Electronics
        </div>
        <div className="menu-item">
            Books
        </div>
        <div className="menu-item">
            Clothing
        </div>
        <div className="menu-item">
            Personal
        </div>
        <div className="menu-item last-item">
            Accessories
        </div>
    </div>
  );
}

export default Navbar;
