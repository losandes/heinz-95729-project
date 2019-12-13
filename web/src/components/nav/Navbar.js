import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import './Navbar.css'


const Navbar = (props) => {

  return (
    <div className="menu">
        <LinkContainer to="/">
            <div className="menu-item first-item">
                Home
            </div>
        </LinkContainer>
        <LinkContainer to="/category/all">
            <div className="menu-item">
                All
            </div>
        </LinkContainer>
        <LinkContainer to="/category/characters">
            <div className="menu-item">
                Characters
            </div>
        </LinkContainer>
        <LinkContainer to="/category/games">
            <div className="menu-item">
                Games
            </div>
        </LinkContainer>
        <LinkContainer to="/category/hobbies">
            <div className="menu-item">
                Hobbies
            </div>
        </LinkContainer>
        <LinkContainer to="/category/art">
            <div className="menu-item">
                Art
            </div>
        </LinkContainer>
        <LinkContainer to="/category/disney">
            <div className="menu-item">
                Disney
            </div>
        </LinkContainer>
        <LinkContainer to="/category/science">
            <div className="menu-item">
                Science
            </div>
        </LinkContainer>
        <LinkContainer to="/login">
            <div className="menu-item special-item last-item">
                Log in
            </div>
        </LinkContainer>
    </div>
  );
}

export default Navbar;
