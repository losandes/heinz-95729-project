import React, { Component } from 'react';
import Header from '../../components/header/Header';
import Navbar from '../../components/nav/Navbar';
import ProductRow from '../../components/product-row/ProductRow';
import CategoryGrid from '../../components/category-grid/CategoryGrid';
import axios from 'axios';
import './Home.css';


class Home extends Component {
    state = {
        products: []
    }

    fetchDealsOfTheDay = () => {
        const SERVER_URL = "http://10.0.0.127:8080/product/all";

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    products: response.data.slice(0, 5)
                });
            })
            .catch(function (response) {
                // Handle error
                console.log("FAILURE");
                console.log(response);
            });
    }

    componentDidMount() {
        this.fetchDealsOfTheDay();
    }

    render () {
        return (
            <div className="Home">
                {/* Header and Navbar at the top of the page */}
                <Header />
                <div className="navbar-container">
                    <Navbar />
                </div>

                {/* Display top prooducts in a carousel */}
                <ProductRow title="Deals of the day" products={this.state.products} />

                <CategoryGrid />
            </div>
        );
    }
}

export default Home;
