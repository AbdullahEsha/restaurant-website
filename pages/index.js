import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Container, Row, Col } from 'reactstrap'
import Category from '../components/UI/Category.js'
import ProductCard from '../components/UI/ProductCard.js'
import Loader from '../components/Loader'

import foodCategoryImg01 from '../public/images/hamburger.png'
import foodCategoryImg02 from '../public/images/pizza.png'
import foodCategoryImg03 from '../public/images/bread.png'

import Hero from '../components/UI/Hero'
import Feature from '../components/UI/Feature'
import WhyChooseUs from '../components/UI/WhyChooseUs'
import Testimonial from '../components/UI/Testimonial'
import db from '../helpers/db'
import Product from '../models/Product'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { Store } from '../helpers/Store'

export default function Home(props) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { products } = props
  const [category, setCategory] = useState('ALL')
  const [allProducts, setAllProducts] = useState([])
  const [hotPizza, setHotPizza] = useState([])

  useEffect(() => {
    const filteredPizza = products.filter((item) => item.category == 'Pizza')
    const slicePizza = filteredPizza.slice(0, 4)
    setHotPizza(slicePizza)
  }, [])

  useEffect(() => {
    if (category == 'ALL') {
      setAllProducts(products)
    }
    if (category == 'BURGER') {
      const filteredProducts = products.filter(
        (item) => item.category == 'Burger',
      )
      setAllProducts(filteredProducts)
    }

    if (category == 'PIZZA') {
      const filteredProducts = products.filter(
        (item) => item.category == 'Pizza',
      )
      setAllProducts(filteredProducts)
    }

    if (category == 'BREAD') {
      const filteredProducts = products.filter(
        (item) => item.category == 'Bread',
      )
      setAllProducts(filteredProducts)
    }
  }, [category])

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
        <section>
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h2>Popular Foods</h2>
              </Col>

              <Col lg="12">
                <div className="food__category d-flex align-items-center justify-content-center gap-4">
                  <button
                    className={`all__btns ${
                      category == 'ALL' ? 'foodBtnActive' : ''
                    } `}
                    onClick={() => setCategory('ALL')}
                  >
                    All
                  </button>
                  <button
                    className={`d-flex align-items-center gap-2  ${
                      category == 'BURGER' ? 'foodBtnActive' : ''
                    } `}
                    onClick={() => setCategory('BURGER')}
                  >
                    <div className="foodCategoryImg">
                      <Image
                        src={foodCategoryImg01}
                        height={20}
                        width={20}
                        alt="Category Image 1"
                      />
                    </div>
                    Burger
                  </button>
                  <button
                    className={`d-flex align-items-center gap-2  ${
                      category == 'PIZZA' ? 'foodBtnActive' : ''
                    } `}
                    onClick={() => setCategory('PIZZA')}
                  >
                    <div className="foodCategoryImg">
                      <Image
                        src={foodCategoryImg02}
                        height={20}
                        width={20}
                        alt="Category Image 2"
                      />
                    </div>
                    Pizza
                  </button>
                  <button
                    className={`d-flex align-items-center gap-2 ${
                      category == 'BREAD' ? 'foodBtnActive' : ''
                    } `}
                    onClick={() => setCategory('BREAD')}
                  >
                    <div className="foodCategoryImg">
                      <Image
                        src={foodCategoryImg03}
                        height={20}
                        width={20}
                        alt="Category Image 3"
                      />
                    </div>
                    Bread
                  </button>
                </div>
              </Col>

              {!allProducts && allProducts == undefined ? (
                <Loader />
              ) : (
                allProducts.map((item) => (
                  <Col
                    lg="3"
                    md="4"
                    sm="6"
                    xs="6"
                    key={item.id}
                    className="mt-5"
                  >
                    <ProductCard
                      item={item}
                      click={() => addToCartHandler(item)}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Container>
        </section>

        <section className="mt-0">
          <Container>
            <Row>
              <Col lg="12" className="text-center mb-3">
                <h2>Hot Pizza</h2>
              </Col>

              {hotPizza.map((item) => (
                <Col lg="3" md="4" sm="6" xs="6" key={item.id}>
                  <ProductCard
                    item={item}
                    click={() => addToCartHandler(item)}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        <WhyChooseUs />
        <Testimonial />
      </main>
    </div>
  )
}

/**
 * Fetch all products
 * @returns products
 */

export async function getServerSideProps() {
  await db.connect()
  const product = await Product.find({}).lean()
  const products = JSON.parse(JSON.stringify(product))
  await db.disconnect()
  return {
    props: {
      products,
    },
  }
}
