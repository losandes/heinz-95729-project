import React, { Component } from 'react';
import GradientHeader from '../../components/header/GradientHeader';
import Navbar from '../../components/nav/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactTinyLink } from 'react-tiny-link'
import axios from 'axios';
import './Product.css';


class Product extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            imageUrl: "https://via.placeholder.com/600",
            productId: props.match.params.productId,
            product: {},
            reviews: [],
            related: [],
            viewed: []
        }
    }

    fetchImage = () => {
        const SERVER_URL = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
        var params = {
            q: this.state.title,
        }
          
        var headers = {
            "Ocp-Apim-Subscription-Key": "bd427484b1da4006863f152fe9cfff35",
        }

        axios.get(SERVER_URL, {params, headers})
            .then((response) => {
                this.setState({
                    imageUrl: response.data.value[0].thumbnailUrl
                });
            })
            .catch(function (response) {
                // Handle error
                console.log(response);
            });
    }

    fetchProduct = () => {
        const SERVER_URL = "http://10.0.0.127:8080/product?productId=" + this.state.productId;

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    product: response.data
                });

                this.fetchReviews();
            })
            .catch(function (response) {
                // Handle error
                console.log(response);
            });
    }

    fetchReviews = () => {
        const SERVER_URL = "http://10.0.0.127:8080/review?productId=" + this.state.productId;

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    reviews: response.data
                });

                this.fetchRelated();
            })
            .catch(function (response) {
                // Handle error
                console.log(response);
            });
    }

    fetchRelated = () => {
        const SERVER_URL = "http://10.0.0.127:8080/related?productId=" + this.state.productId;

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    related: response.data
                });

                this.fetchViewed();
            })
            .catch(function (response) {
                // Handle error
                console.log(response);
            });
    }

    fetchViewed = () => {
        const SERVER_URL = "http://10.0.0.127:8080/view?productId=" + this.state.productId;

        axios.get(SERVER_URL)
            .then((response) => {
                this.setState({
                    viewed: response.data
                });
            })
            .catch(function (response) {
                // Handle error
                console.log(response);
            });
    }

    componentDidMount() {
        this.fetchProduct();
    }

    render() {
        let productDetails = null;
        if (Object.keys(this.state.product).length !== 0) {
            productDetails = (
                <div>
                    <h3>{this.state.product.name}</h3>
                    <p>{this.state.product.category1} | {this.state.product.category2} | {this.state.product.category3}</p>
                    <p>{this.state.product.averageReviewRating} / 5.0 stars</p>
                    <p>
                        {this.state.product.description}
                    </p>
                    <p>Price: ${this.state.product.price}</p>
                </div>
            );
        }

        let reviews = null;
        if (this.state.reviews.length > 0) {
            reviews = this.state.reviews.map(value => {
                return (
                    <li>{value}</li>
                );
            });
        }

        let alsoBought = null;
        if (this.state.related.length > 0) {
            let related = this.state.related.reverse().slice(0, this.state.related.length > 3 ? 3 : this.state.related.length);
            alsoBought = related.map(value => {
                return (
                    <Col md={4}>
                        <div style={{width: "100%"}}>
                            <ReactTinyLink
                                cardSize="large"
                                showGraphic={true}
                                maxLine={2}
                                minLine={1}
                                url={value}
                            />
                        </div>
                    </Col>
                );
            })
        }

        let alsoViewed = null;
        if (this.state.viewed.length > 0) {
            let viewed = this.state.related.slice(0, this.state.viewed.length > 3 ? 3 : this.state.viewed.length);
            alsoViewed = viewed.map(value => {
                return (
                    <Col md={4}>
                        <div style={{width: "100%"}}>
                            <ReactTinyLink
                                cardSize="large"
                                showGraphic={true}
                                maxLine={2}
                                minLine={1}
                                url={value}
                            />
                        </div>
                    </Col>
                );
            })
        }

        return (
            <div className="Product">
                {/* Header and Navbar at the top of the page */}
                <GradientHeader />
                <div className="navbar-container">
                    <Navbar isLoggedIn={this.props.isLoggedIn} />
                </div>

                <Container>
                    <Row>
                        <Col md={4}>
                            <div className="product-img-container">
                                <img src={this.state.imageUrl} className="product-img" alt="Product" />
                            </div>
                        </Col>
                        <Col md={8}>
                            {productDetails}
                        </Col>
                    </Row>

                    <Row className="reviews-row">
                        <Col md={12}>
                            {reviews !== null ? <h5>Reviews</h5> : null}
                            <ul>{reviews}</ul>
                        </Col>
                    </Row>

                    {alsoBought !== null ? <h5>Products similar to this bought by other customers</h5> : null}
                    <Row className="also-bought-row">
                        {alsoBought}
                    </Row>

                    {alsoViewed !== null ? <h5>Other customers who bought this also viewed</h5> : null}
                    <Row className="also-bought-row">
                        {alsoViewed}
                    </Row>
                    
                </Container>
            </div>
        );
    }
}

export default Product;
