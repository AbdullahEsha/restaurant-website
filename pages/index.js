import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Row, Col } from "reactstrap";
import Category from "../components/UI/Category.js";
import ProductCard from "../components/UI/ProductCard.js";
import Hero from "../components/UI/Hero";
import Feature from "../components/UI/Feature";
import WhyChooseUs from "../components/UI/WhyChooseUs";
import db from "../helpers/db";
import Product from "../models/Product";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../helpers/Store";

export default function Home(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { products } = props;
  const [category, setCategory] = useState("ALL");
  const [allProducts, setAllProducts] = useState([]);
  const [hotPizza, setHotPizza] = useState([]);

  useEffect(() => {
    const filteredPizza = products.filter((item) => item.category == "Pizza");
    const slicePizza = filteredPizza.slice(0, 4);
    setHotPizza(slicePizza);
  }, []);

  useEffect(() => {
    if (category == "ALL") {
      setAllProducts(products);
    }
    if (category == "BURGER") {
      const filteredProducts = products.filter(
        (item) => item.category == "Burger"
      );
      setAllProducts(filteredProducts);
    }

    if (category == "PIZZA") {
      const filteredProducts = products.filter(
        (item) => item.category == "Pizza"
      );
      setAllProducts(filteredProducts);
    }

    if (category == "BREAD") {
      const filteredProducts = products.filter(
        (item) => item.category == "Bread"
      );
      setAllProducts(filteredProducts);
    }
  }, [category]);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock <= quantity) {
      toast.error("Sorry we cannot provide this quantity of food!");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    router.push("/cart");
  };

  return (
    <div>
      <Head>
        <title>
          Halal Kabab & Curry | Food Delivery and Takeout | Order Online
        </title>
        <meta
          name="description"
          content="We deliver your takeouts or essential groceries from the best-rated local partners straight to your door. Download our app or order online. Food. We Get It."
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main>
        <ToastContainer />
        <Hero />
        <section className="pt-2">
          <Category />
        </section>
        <Feature />
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2>Halal kabab</h2>
            </Col>

            {hotPizza.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" key={item.id}>
                <ProductCard item={item} click={() => addToCartHandler(item)} />
              </Col>
            ))}
          </Row>
        </Container>
        <WhyChooseUs />
      </main>
    </div>
  );
}

/**
 * Fetch all products
 * @returns products
 */

export async function getServerSideProps() {
  await db.connect();
  const product = await Product.find({}).lean();
  const products = JSON.parse(JSON.stringify(product));
  await db.disconnect();
  return {
    props: {
      products,
    },
  };
}
