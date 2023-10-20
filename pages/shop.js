import React, { useState, useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import ProductCard from "../components/UI/ProductCard";
import ReactPaginate from "react-paginate";
import db from "../helpers/db";
import Product from "../models/Product";
import axios from 'axios';
import { toast , ToastContainer} from 'react-toastify';
import { Store } from "../helpers/Store";

export default function Shop(props) {
  const router=useRouter();
  const { state, dispatch } = useContext(Store);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const {products}=props;

  const searchedProduct = Array.isArray(products) ? products.filter((item) => {
    if (searchTerm.value === "") {
      return item;
    }
    if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    } else {
      return console.log("not found");
    }
  }): [];
 
  /**
   * Number of food to show per page
   */
  const productPerPage = 12;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = searchedProduct.slice(
    visitedPage,
    visitedPage + productPerPage
  );

  const pageCount = Math.ceil(searchedProduct.length / productPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
 /***
  * add item to cart
  */
  const addToCartHandler= async (product)=>{
    const existItem = state.cart.cartItems.find(x=>x._id === product._id);
    const quantity= existItem ? existItem.quantity + 1: 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if(data.countInStock <= quantity){
      toast.error('Sorry we cannot provide this quantity of food!');
      return;
  }
    dispatch({ type: 'CART_ADD_ITEM', payload: {...product, quantity}});

    router.push('/cart')
}


  return (
    <>
      <Head>
        <title>All Foods-Shop</title>
        <meta name="description" content="All foods" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <main>
        <CommonSection title="All Foods" />
        <ToastContainer/>
        <section>
          <Container>
            <Row>
              <Col lg="6" md="6" sm="6" xs="12">
                <div className="search__widget d-flex align-items-center justify-content-between">
                  <input
                    type="text"
                    placeholder="I am looking for........."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span>
                    <i className="ri-search-line"></i>
                  </span>
                </div>
              </Col>
              <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
                <div className="sorting__widget text-end">
                  <select>
                    <option>Default</option>
                  </select>
                </div>
              </Col>

              {displayPage.map((item) => (
                <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4">
                  <ProductCard item={item} click={()=>addToCartHandler(item)} />
                </Col>
              ))}

            <div>
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={changePage}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName=" paginationBttns "
              />
            </div>

            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}


export async function getServerSideProps(){
  await db.connect();
  const products= await Product.find({},'-reviews').lean();
  await db.disconnect();
  return {
    props:{
      products: products.map(db.convertDocToObj)
    }
  }
}