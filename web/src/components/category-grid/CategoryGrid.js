import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CategoryCard from './category-card/CategoryCard';
import { LinkContainer } from 'react-router-bootstrap'
import './CategoryGrid.css';
import bootsLogo from '../../assets/images/boots.jpg';


const CategoryGrid = (props) => {

    return (
        <div className="CategoryGrid">
            <h4 className="category-header">Check out our newest products in these categories</h4>
            <Container>
                <Row className="top-row">
                    <Col>
                        <LinkContainer to="/product">
                            <CategoryCard img={bootsLogo} title="Boots" />
                        </LinkContainer>
                    </Col>
                    <Col>
                        <LinkContainer to="/product">
                            <CategoryCard img={bootsLogo} title="Boots" />
                        </LinkContainer>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <LinkContainer to="/product">
                            <CategoryCard img={bootsLogo} title="Boots" />
                        </LinkContainer>
                    </Col>
                    <Col>
                        <LinkContainer to="/product">
                            <CategoryCard img={bootsLogo} title="Boots" />
                        </LinkContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default CategoryGrid;
