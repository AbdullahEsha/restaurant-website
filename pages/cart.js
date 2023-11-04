import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Container, Row, Col, Table } from 'reactstrap'
import { Select, MenuItem } from '@material-ui/core'
import CommonSection from '../components/UI/CommonSection'
import { useContext } from 'react'
import { Store } from '../helpers/Store'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import dynamic from 'next/dynamic'
function Cart() {
  const [isCart, setIsCart] = useState(false)
  const { state, dispatch } = useContext(Store)
  const [modifiers, setModifiers] = useState([])
  const [addons, setAddons] = useState(false)
  const {
    cart: { cartItems },
  } = state

  const fetchData = async () => {
    const { data } = await axios.get('/api/modifier')
    setModifiers(data)
  }

  useEffect(() => {
    fetchData()
    cartItems ? setIsCart(true) : setIsCart(false)
  }, [])

  const updateCartHandler = async (item, quantity) => {
    const data = axios.get(`/api/products/${item._id}`)
    if (data.countInStock <= 0) {
      toast.error('Sorry. This food is not available today!')
      return
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const handleAddOn = (item, addonItem) => {
    // convert string to json
    const addon = JSON.parse(addonItem)
    if (addon.option != 'None') {
      setAddons(true)
    }
    dispatch({
      type: 'CART_ADD_MODIFIER',
      payload: {
        ...item,
        addon: addon.option,
        addonPrice: addon.price,
      },
    })
  }

  return (
    <>
      <Head>
        <title>Cart</title>
        <meta name="description" content="Your Current Cart" />
        <link rel="icon" href="/favicon.ico" />
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
        <CommonSection title="Your Cart" />
        <section className="m-5">
          <Container>
            <Row>
              <Col lg="12">
                {cartItems.length === 0 ? (
                  <h5 className=" m-5">
                    Your cart is empty.{' '}
                    <Link href="/menu" legacyBehavior>
                      <a>Go shopping </a>
                    </Link>
                  </h5>
                ) : (
                  <>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Title</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Add-Ons</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isCart &&
                          cartItems.map((item, index) => {
                            if (item.image) {
                              return (
                                <tr>
                                  <td className="cart__img-box">
                                    <div className="w-50">
                                      <Image
                                        width={50}
                                        height={50}
                                        src={`${item.image}`}
                                        alt={item.name}
                                      />
                                    </div>
                                  </td>
                                  <td>{item?.name}</td>
                                  <td>${item.price}</td>
                                  <td>
                                    <Select
                                      value={item.quantity}
                                      onChange={(e) =>
                                        updateCartHandler(item, e.target.value)
                                      }
                                    >
                                      {[...Array(item.countInStock).keys()].map(
                                        (x, i) => (
                                          <MenuItem key={i} value={x + 1}>
                                            {x + 1}
                                          </MenuItem>
                                        ),
                                      )}
                                    </Select>
                                  </td>
                                  <td>
                                    {/* Select in the bases of modifier data inside usedin array like */}
                                    <select
                                      onChange={(e) =>
                                        handleAddOn(item, e.target.value)
                                      }
                                      selected
                                    >
                                      <option
                                        value={`{"option":"None","price":0}`}
                                        selected
                                      >
                                        None
                                      </option>
                                      {modifiers.map((modifier) => {
                                        if (
                                          modifier.usedIn.includes(item._id)
                                        ) {
                                          return modifier.option.map(
                                            (option, index) => {
                                              return (
                                                <option
                                                  value={JSON.stringify({
                                                    option: option,
                                                    price: modifier.price,
                                                  })}
                                                  key={index}
                                                >
                                                  {option}
                                                </option>
                                              )
                                            },
                                          )
                                        }
                                      })}
                                    </select>
                                  </td>
                                  <td className="cart__item-del">
                                    <i
                                      onClick={() => removeItemHandler(item)}
                                      className="cursor__pointer ri-delete-bin-line"
                                    ></i>
                                  </td>
                                </tr>
                              )
                            }
                          })}
                      </tbody>
                    </Table>

                    <div className="mt-4">
                      <h6>
                        Subtotal: $
                        <span className="cart__subtotal">
                          {isCart &&
                            (addons
                              ? cartItems.reduce(
                                  (a, c) =>
                                    a + c.addonPrice + c.quantity * c.price,
                                  0,
                                )
                              : cartItems.reduce(
                                  (a, c) => a + c.quantity * c.price,
                                  0,
                                ))}
                        </span>
                      </h6>
                      <p>Taxes and shipping will calculate at checkout</p>
                      <div className="cart__page-btn">
                        <button className="addTOCart__btn me-4">
                          <Link href="/menu" legacyBehavior>
                            <a className="text-white">Continue shopping</a>
                          </Link>
                        </button>
                        <button className="addTOCart__btn">
                          <Link href="/shipping" legacyBehavior>
                            <a className="text-white">Proceed Checkout</a>
                          </Link>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false })
