import React, { Component } from 'react';
import Header from '../../components/header/Header';
import Navbar from '../../components/nav/Navbar';
import ProductRow from '../../components/product-row/ProductRow';
import CategoryGrid from '../../components/category-grid/CategoryGrid';
import axios from 'axios';
import './Home.css';
import Container from 'react-bootstrap/Container';


class Home extends Component {

    constructor(props) {
        super(props);
        this.props = props;

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

                <Container className="cui-section">
                    <h4>Interact with out chatbot to find out if we have exactly what you need!</h4>
                    <iframe
                        allow="microphone;"
                        width="350"
                        height="430"
                        className="chat-frame"
                        src="https://console.dialogflow.com/api-client/demo/embedded/320f00f9-6d53-4627-a154-1f81181c5699">
                    </iframe>
                </Container>
            </div>
        );
    }
}

export default Home;
