import React from 'react';
import Header from './header/Header';
import Navbar from '../nav/Navbar';
import ProductRow from '../product-row/ProductRow';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';


function App() {
    // Add fontAwesome icons to the library
    library.add(faSearch)

    return (
        <div className="App">
            {/* Header and Navbar at the top of the page */}
            <Header />
            <div className="navbar-container">
                <Navbar />
            </div>

            {/* Display top prooducts in a carousel */}
            <ProductRow title="Deals of the day" />
        </div>
    );
}

export default App;
