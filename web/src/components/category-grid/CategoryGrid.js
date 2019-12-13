import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CategoryCard from './category-card/CategoryCard';
import { useHistory } from "react-router-dom";
import './CategoryGrid.css';
import gamesLogo from '../../assets/images/games.jpg';
import hobbiesLogo from '../../assets/images/hobbies.jpg';
import artLogo from '../../assets/images/art.jpg';
import scienceLogo from '../../assets/images/science.jpg';


const CategoryGrid = (props) => {

    let history = useHistory();

    let handleGamesClick = () => {
        history.push("/category/games");
    }
    let handleArtClick = () => {
        history.push("/category/art");
    }
    let handleHobbyClick = () => {
        history.push("/category/hobbies");
    }
    let handleScienceClick = () => {
        history.push("/category/science");
    }

    return (
        <div className="CategoryGrid">
            <h4 className="category-header">Check out our newest products in these categories</h4>
            <Container>
                <Row className="top-row">
                    <Col>
                        <CategoryCard img={gamesLogo} onClick={handleGamesClick} title="Games" />
                    </Col>
                    <Col>
                        <CategoryCard img={hobbiesLogo} onClick={handleHobbyClick} title="Hobbies" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CategoryCard img={artLogo} onClick={handleArtClick} title="Art" />
                    </Col>
                    <Col>
                        <CategoryCard img={scienceLogo} onClick={handleScienceClick} title="Science" />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default CategoryGrid;
