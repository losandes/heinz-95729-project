import React from 'react';
import './ProductCard.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


const ProductCard = (props) => {

    return (
        <Card style={{ width: '90%' }}>
            <Card.Img variant="top" src={require("../../assets/images/boots.jpg")} />

            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                </Card.Text>
                <Button variant="primary">
                    <Link to={{
                        pathname: '/view',
                        search: '?product=this'
                    }}>
                        Go somewhere
                    </Link>
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
