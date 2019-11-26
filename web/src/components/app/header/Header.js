import React from 'react'
import './Header.css'
import Jumbotron from "react-bootstrap/Jumbotron";


const header = (props) => {

  return (
    <Jumbotron className="home-banner">
      <div className="filter">
        <h1 className="welcome-title">Welcome to Backrow Shop</h1>
        <h3 className="welcome-subtitle">Find the best products from the comfort of your home</h3>

        <form>
          <input type="text" />
        </form>
      </div>
    </Jumbotron>
  );
}

export default header;
