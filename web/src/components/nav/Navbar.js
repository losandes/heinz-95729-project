import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import './Navbar.css'


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
        <div className="menu-item">
            Accessories
        </div>
        <div className="menu-item">
            About
        </div>
        <LinkContainer to="/login">
            <div className="menu-item special-item last-item">
                Log in
            </div>
        </LinkContainer>
    </div>
  );
}

export default Navbar;
