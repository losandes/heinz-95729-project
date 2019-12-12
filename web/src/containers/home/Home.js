import React from 'react';
import Header from '../../components/header/Header';
import Navbar from '../../components/nav/Navbar';
import ProductRow from '../../components/product-row/ProductRow';
import CategoryGrid from '../../components/category-grid/CategoryGrid';
import './Home.css';


const Home = () => {

    return (
        <div className="Home">
            {/* Header and Navbar at the top of the page */}
            <Header />
            <div className="navbar-container">
                <Navbar />
            </div>

            {/* Display top prooducts in a carousel */}
            <ProductRow title="Deals of the day" />

            <CategoryGrid />
        </div>
    );
}

export default Home;
