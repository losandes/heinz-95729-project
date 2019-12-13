import React from 'react';
import GradientHeader from '../../components/header/GradientHeader';
import Navbar from '../../components/nav/Navbar';
import ProductCard from '../../components/card/ProductCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Search.css';


const Search = () => {

    const populateProducts = () => {

    }

    return (
        <div className="Product">
            {/* Header and Navbar at the top of the page */}
            <GradientHeader />
            <div className="navbar-container">
                <Navbar />
            </div>

            <Container>
                <h4 className="search-results-title">Search results for ""</h4>

                <Row className="results-row">
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                </Row>

                <Row className="results-row">
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                </Row>

                <Row className="results-row">
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                    <Col md={3}>
                        <ProductCard />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Search;
