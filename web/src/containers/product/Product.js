import React from 'react';
import GradientHeader from '../../components/header/GradientHeader';
import Navbar from '../../components/nav/Navbar';
import ProductRow from '../../components/product-row/ProductRow';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Product.css';


const Product = () => {

    return (
        <div className="Product">
            {/* Header and Navbar at the top of the page */}
            <GradientHeader />
            <div className="navbar-container">
                <Navbar />
            </div>

            <Container>
                <Row>
                    <Col md={4}>
                        <div className="product-img-container">
                            <img src="https://via.placeholder.com/200x600" className="product-img" alt="Product" />
                        </div>
                    </Col>
                    <Col md={8}>
                        <h3>Title</h3>
                        <p>Category</p>
                        <p>Rating</p>
                        <p>
                            Product description
                        </p>
                    </Col>
                </Row>

                <Row className="reviews-row">
                    <Col md={12}>
                        <h4>Reviews</h4>
                    </Col>
                </Row>

                {/* Display top prooducts in a carousel */}
                <ProductRow title="Customers who viewed this also bought" />

                {/* Display top prooducts in a carousel */}
                <ProductRow title="Customers who bought this also bought" />
            </Container>
        </div>
    );
}

export default Product;
