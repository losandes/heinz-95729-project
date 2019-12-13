import React from 'react';
import { useHistory } from "react-router-dom";
import './ProductCard.css';
import bootsLogo from '../../assets/images/boots.jpg';


const ProductCard = (props) => {

    const history = useHistory();

    let onCardClick = () => {
        history.push("/product/" + props.productId);
    }

    return (
        <div className="ProductCard" onClick={onCardClick}>
            <div className="product-card-img" style={{backgroundImage: `url(${bootsLogo})`}} />
            <p className="product-card-text">{props.title}</p>
        </div>
    );
}

export default ProductCard;
