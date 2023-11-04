import React, { useContext, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import { Container, Row, Col } from 'reactstrap'
import axios from 'axios'
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
  InputBase,
  IconButton,
} from '@material-ui/core'
import db from '../helpers/db'
import Product from '../models/Product'
import { Store } from '../helpers/Store'
import ProductCard from '../components/UI/ProductCard'
import Rating from '@material-ui/lab/Rating'
import { Pagination } from '@material-ui/lab'
import CommonSection from '../components/UI/CommonSection'

const PAGE_SIZE = 6

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
]

const ratings = [1, 2, 3, 4, 5]

export default function search(props) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const {
    query = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query
  const { products, countProducts, categories, pages } = props
  const filterSearch = ({
    page,
    category,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname
    const { query } = router
    if (page) query.page = page
    if (searchQuery) query.searchQuery = searchQuery
    if (sort) query.sort = sort
    if (category) query.category = category
    if (price) query.price = price
    if (rating) query.rating = rating
    if (min) query.min ? query.min : query.min === 0 ? 0 : min
    if (max) query.max ? query.max : query.max === 0 ? 0 : max

    router.push({
      pathname: path,
      query: query,
    })
  }
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value })
  }

  const pageHandler = (e, page) => {
    filterSearch({ page })
  }

  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value })
  }
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value })
  }
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value })
  }

  const queryChangeHandler = (e) => {
    setSearchQuery(e.target.value)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    router.push(`/search?query=${searchQuery}`)
  }

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
        <CommonSection title="Search Items" />
        <section>
          <Container>
            <Grid container spacing={1}>
              <Grid item md={3} className="w-100">
                <List>
                  <ListItem>
                    <Box className="w-100">
                      <Typography>Search Food</Typography>
                      <form onSubmit={submitHandler} className="searchForm">
                        <InputBase
                          name="query"
                          className="searchInput"
                          placeholder="Search foods"
                          onChange={queryChangeHandler}
                        />
                        <IconButton
                          type="submit"
                          className="iconButton"
                          arial-label="search"
                        >
                          <i className="ri-search-line searchIcon"></i>
                        </IconButton>
                      </form>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <Box className="w-100">
                      <Typography className="mb-2">Categories</Typography>
                      <Select
                        fullWidth
                        value={category}
                        onChange={categoryHandler}
                      >
                        <MenuItem value="all">All</MenuItem>
                        {categories &&
                          categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                      </Select>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <Box className="w-100">
                      <Typography className="mb-2">Prices</Typography>
                      <Select value={price} onChange={priceHandler} fullWidth>
                        <MenuItem value="all">All</MenuItem>
                        {prices.map((price) => (
                          <MenuItem key={price.value} value={price.value}>
                            {price.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </ListItem>

                  <ListItem>
                    <Box className="w-100">
                      <Typography className="mb-2">Ratings</Typography>
                      <Select value={rating} onChange={ratingHandler} fullWidth>
                        <MenuItem value="all">All</MenuItem>
                        {ratings.map((rating) => (
                          <MenuItem dispaly="flex" key={rating} value={rating}>
                            <Rating
                              value={rating}
                              style={{ color: '#df2020' }}
                              readOnly
                            />
                            <Typography component="span">&amp; Up</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={9}>
                <Grid container className="d-flex justify-content-between">
                  <Grid item>
                    {products.length === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && query !== '' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {(query !== 'all' && query !== '') ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button onClick={() => router.push('/search')}>
                        <i className="ri-close-line"></i>
                      </Button>
                    ) : null}
                  </Grid>

                  <Grid item>
                    <Typography component="span" className="filter__sort">
                      Sort by {'   '}
                    </Typography>
                    <Select value={sort} onChange={sortHandler}>
                      <MenuItem value="featured">Featured</MenuItem>
                      <MenuItem value="lowest">Price: Low to High</MenuItem>
                      <MenuItem value="highest">Price: High to Low</MenuItem>
                      <MenuItem value="toprated">Customer Reviews</MenuItem>
                      <MenuItem value="newest">Newest Arrivals</MenuItem>
                    </Select>
                  </Grid>
                </Grid>

                <div className="product-card-grid-search mt-3">
                  {products.map((item, index) => (
                    <ProductCard
                      item={item}
                      key={index}
                      click={() => addToCartHandler(item)}
                    />
                  ))}
                </div>

                <Pagination
                  className="mt-3"
                  defaultPage={parseInt(query.page || '1')}
                  count={pages}
                  onChange={pageHandler}
                ></Pagination>
              </Grid>
            </Grid>
          </Container>
        </section>
      </main>
    </>
  )
}

export async function getServerSideProps({ query }) {
  await db.connect()
  const pageSize = query.pageSize || PAGE_SIZE
  const page = query.page || 1
  const category = query.category || ''
  const price = query.price || ''
  const rating = query.rating || ''
  const sort = query.sort || ''
  const searchQuery = query.query || ''
  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {}

  const categoryFilter = category && category !== 'all' ? { category } : {}
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {}
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}
  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 }

  const categories = await Product.find().distinct('category')
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    '-reviews',
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean()
  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })

  await db.disconnect()

  const products = productDocs.map(db.convertDocToObj)

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
    },
  }
}
