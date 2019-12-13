import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import './ProductCard.css';


class ProductCard extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            redirect: false,
            productId: props.productId,
            title: props.title,
            imageUrl: "https://via.placeholder.com/300"
        }
    }

    onCardClick = () => {
        this.setState({
            redirect: true
        });
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

    componentDidMount() {
        this.fetchImage();
    }

    render() {
        if (this.state.redirect === true) {
            return (<Redirect to={{pathname: "/product/" + this.state.productId}} push={true}/>);
        }
        

        return (
            <div className="ProductCard" onClick={this.onCardClick}>
                <div className="product-card-img" style={{backgroundImage: `url(${this.state.imageUrl})`}} />
                <p className="product-card-text">{this.state.title}</p>
            </div>
        );
    }
}

export default ProductCard;
