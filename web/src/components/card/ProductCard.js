import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './ProductCard.css';
import bootsLogo from '../../assets/images/boots.jpg';


class ProductCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            productId: props.productId,
            toSearch: false
        };
    }

    onCardClick = () => {
        this.setState({
            title: this.state.title,
            productId: this.state.productId,
            toSearch: true
        })
    }

    render() {
        if (this.state.toSearch) {
            return (
                <Redirect to={'/product/' + this.state.productId} />
            );
        }

        return (
            <div className="ProductCard" onClick={this.onCardClick}>
                <div className="product-card-img" style={{backgroundImage: `url(${bootsLogo})`}} />
                <p className="product-card-text">{this.state.title}</p>
            </div>
        );
    }
}

export default ProductCard;
