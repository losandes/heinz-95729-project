import React from 'react';
import './ProductRow.css';
import Carousel from 'react-multi-carousel';
import ProductCard from '../card/ProductCard';
import 'react-multi-carousel/lib/styles.css';


const ProductRow = (props) => {

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1600 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 1600, min: 1100 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1100, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    const productNames = [1, 2, 3, 4, 5];
    const products = (
        productNames.map(value => {
            return (
                <ProductCard title={"Product " + value} />
            );
        })
    );

    return (
        <div style={{padding: "30px 80px", marginBottom: "40px", position: 'relative'}}>
            {props.title ? <h3 className="row-title">{props.title}</h3> : null}
            <Carousel
                additionalTransfrom={0}
                arrows
                dotListClass=""
                draggable
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside
                renderDotsOutside
                responsive={responsive}
                showDots={true}
                sliderClass=""
                slidesToSlide={2}
                swipeable>
                    {products}
            </Carousel>
        </div>
    );
}

export default ProductRow;
