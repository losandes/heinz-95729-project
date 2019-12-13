import React from 'react';
import './CategoryCard.css';


const CategoryCard = (props) => {

    return (
        <div className="CategoryCard" onClick={props.onClick} style={{backgroundImage: `url(${props.img})`}}>
            <div className="card-filter">
                <span className="card-title">{props.title}</span>
            </div>
        </div>
    );
}

export default CategoryCard;
