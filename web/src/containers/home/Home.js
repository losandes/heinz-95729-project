import React, { Component } from 'react';
import Header from '../../components/header/Header';
import Navbar from '../../components/nav/Navbar';
import ProductRow from '../../components/product-row/ProductRow';
import CategoryGrid from '../../components/category-grid/CategoryGrid';
import axios from 'axios';
import './Home.css';


class Home extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        console.log("In home");
        console.log(props);
        console.log(props.isLoggedIn);

        this.state = {
            products: []
        }
    }

    fetchDealsOfTheDay = () => {
        const SERVER_URL = "http://10.0.0.127:8080/product/dealoftheday";

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    products: response.data
                });
            })
            .catch(function (response) {
                // Handle error
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
                    <Navbar isLoggedIn={this.props.isLoggedIn} />
                </div>

                {/* Display top prooducts in a carousel */}
                <ProductRow title="Deals of the day" products={this.state.products} />

                <CategoryGrid />
            </div>
        );
    }
}

export default Home;
