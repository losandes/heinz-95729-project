import React, { Component } from 'react';
import GradientHeader from '../../components/header/GradientHeader';
import Navbar from '../../components/nav/Navbar';
import ProductCard from '../../components/card/ProductCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import './Search.css';


class Search extends Component {
    
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            query: props.match.params.query,
            products: []
        }
    }

    fetchProducts = () => {
        const SERVER_URL = "http://10.0.0.127:8080/product/keyword?keyword=" + this.state.query;

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    products: response.data
                });

                console.log(this.state);
            })
            .catch(function (response) {
                // Handle error
                console.log(response);
            });
    }

    componentDidMount() {
        this.fetchProducts();
    }

    render() {
        let gridData = [];
        let arr = this.state.products;
        let count = 0;
        while(arr.length && count < 20) {
            gridData.push(arr.splice(0, 4));
            count++;
        }

        let gridCols = gridData.map((value, index) => {
            return (
                <Row key={index} className="results-row">
                {
                    value.map(item => {
                        return (
                            <Col md={3} key={item['productId']}>
                                <ProductCard title={item['name']} productId={item['productId']} />
                            </Col>
                        );
                    })
                }
                </Row>
            );
        });

        return (
            <div className="Product">
                {/* Header and Navbar at the top of the page */}
                <GradientHeader />
                <div className="navbar-container">
                    <Navbar isLoggedIn={this.props.isLoggedIn} />
                </div>

                <Container>
                    <h4 className="search-results-title">Search results for "{this.state.query}"</h4>
                    {gridCols}
                </Container>
            </div>
        );
    }
}

export default Search;
