import Image from "next/image";
import Link from "next/link";
import React from "react";
import Rating from "@material-ui/lab/Rating";

const ProductCard = (props) => {
  const { slug, name, image, price, rating } = props.item;
  return (
    <div className="product__item">
      <Image src={`${image}`} height={180} width={180} alt="product-img" />
      <div className="product__content">
        <Rating value={rating} style={{ color: "#df2020" }} readOnly></Rating>
        <h5>
          <Link href={`/product/${slug}`}>{name}</Link>
        </h5>
        <button className="addTOCart__btn" onClick={props.click}>
          Add to Cart
        </button>
        <label className="product__price">${price}</label>
      </div>
    </div>
  );
};

export default ProductCard;
