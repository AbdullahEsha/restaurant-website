import React, { useState, useEffect, useContext } from 'react'
import { Store } from '../helpers/Store'
import ProductCard from '../components/UI/ProductCard'
import db from '../helpers/db'
import { useRouter } from 'next/router'
import Product from '../models/Product'
import { Col, Container, Row } from 'reactstrap'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import CommonSection from '../components/UI/CommonSection'
import Slider from 'react-slick'
import Head from 'next/head'

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find({}, '-reviews').lean()
  await db.disconnect()
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  }
}

const settings = {
  dots: false,
  autoplay: false,
  infinite: true,
  swipeToSlide: true,
  slidesToShow: 2,
  slidesToScroll: 1,
}

const Menu = ({ products }) => {
  const [menuList, setMenuList] = useState([])
  const [category, setCategory] = useState('all items')
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category),
    )
    setMenuList([...uniqueCategories, 'all items'])
    const filteredProducts = products.filter(
      (product) => product.category === category,
    )
    if (category === 'all items') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(filteredProducts)
    }
  }, [products, category])

  const handleClick = (item) => {
    if (item === 'all items') {
      setCategory(item)
    } else {
      setCategory(item)
    }
  }

  const router = useRouter()
  const { state, dispatch } = useContext(Store)

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock <= quantity) {
      toast.error('Sorry we cannot provide this quantity of food!')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    router.push('/cart')
  }
  return (
    <>
      <Head>
        <title>Halal Kabab & Curry | Food Delivery and Takeout | Menu</title>
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
      <ToastContainer />
      <CommonSection title="Menu" />
      <Container className="my-5">
        <Row>
          <Col xs="12" sm="3" lg="2">
            <div className="menu-sidebar menu-side-bar-desktop">
              {menuList
                .map((item, index) => (
                  <button
                    key={index}
                    className={`btn-group__item ${
                      category === item ? 'active-sidebar-btn' : ''
                    }`}
                    onClick={() => handleClick(item)}
                  >
                    {item}
                  </button>
                ))
                .reverse()}
            </div>
            <div className="menu-sidebar menu-side-bar-mobile">
              <Slider {...settings}>
                {menuList
                  .map((item, index) => (
                    <button
                      key={index}
                      className={`btn-group__item ${
                        category === item ? 'active-sidebar-btn' : ''
                      }`}
                      onClick={() => handleClick(item)}
                    >
                      {item}
                    </button>
                  ))
                  .reverse()}
              </Slider>
            </div>
          </Col>
          <Col xs="12" sm="9" lg="10">
            {!filteredProducts && filteredProducts === undefined ? (
              <Loader />
            ) : (
              <div className="product-card-grid">
                {filteredProducts.map((item, index) => (
                  <ProductCard
                    item={item}
                    key={index}
                    click={() => addToCartHandler(item)}
                  />
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Menu
