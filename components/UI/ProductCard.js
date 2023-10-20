import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Rating from '@material-ui/lab/Rating';

const ProductCard=(props)=>{
    const {slug,name,image,price,rating }=props.item;
    return(
        <div className="product__item">
        <div className="product__img w-100">
          <Image src={`${image}`} height={180} width={180} alt="product-img"/>
        </div>
  
        <div className="product__content">
          <h5>
            <Link href={`/product/${slug}`}>{name}</Link>
          </h5>
          <Rating value={rating} style={{ color: "#df2020" }} readOnly></Rating>
          <div className=" d-flex align-items-center justify-content-between">
            <span className="product__price">${price} {"  "}</span>
            <button className="addTOCart__btn" onClick={props.click}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
        )
};

export default ProductCard;