import React, { useState, useContext, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Store } from '../../helpers/Store'
import axios from 'axios'
import {
  Container,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Table,
} from 'reactstrap'
import CommonSection from '../../components/UI/CommonSection'
import { toast, ToastContainer } from 'react-toastify'
import dynamic from 'next/dynamic'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { getError } from '../../helpers/error'
import CheckWizard from '../../components/CheckWizard'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true }
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true }
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload }
    case 'PAY_RESET':
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' }
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true }
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true }
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload }
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      }
    default:
      state
  }
}

function Order({ params }) {
  const orderId = params.id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state

  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  })

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order

  // get total addons price from orderItems
  const totalAddons = orderItems?.reduce((a, c) => a + c.addonPrice, 0) || 0

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder()

      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }

      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [order, successPay, successDeliver])

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          },
        )
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        toast.success(`Order is paid`)
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) })
        toast.error(`${getError(err)}`)
      }
    })
  }

  function onError(err) {
    toast.error(`${getError(err)}`)
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' })
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      )
      dispatch({ type: 'DELIVER_SUCCESS', payload: data })
      toast.success('Order is delivered')
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) })
      toast.error(`${getError(err)}`)
    }
  }

  return (
    <>
      <Head>
        <title>
          Halal Kabab & Curry | Order | Food Delivery and Takeout | Order Online
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
      </Head>
      <CommonSection title={`Order ${orderId}`} />
      <ToastContainer />
      {loading ? (
        <div>Loading.... </div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <section>
          <Container>
            {!isPaid && <CheckWizard activeStep={3} />}
            <Row>
              <Col lg="8" md="6">
                <ListGroup>
                  <ListGroupItem>
                    <h6 className="mb-4">Shipping Address</h6>
                    {shippingAddress.fullName}, {shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country}
                    &nbsp;
                    {shippingAddress.location && (
                      <Link
                        variant="button"
                        target="_new"
                        href={`https://maps.google.com?q=${shippingAddress.location.lat},${shippingAddress.location.lng}`}
                      >
                        Show On Map
                      </Link>
                    )}
                  </ListGroupItem>
                  <ListGroupItem>
                    <h6 className="mb-4">Payment Method</h6>
                    {paymentMethod}
                  </ListGroupItem>
                  <ListGroupItem>
                    <h6 className="mb-4">Payment Status</h6>
                    {isPaid ? `paid at ${paidAt}` : `Not Paid`}
                  </ListGroupItem>
                  <ListGroupItem>
                    <h6 className="mb-4">Delivered Status</h6>
                    {isDelivered
                      ? `delivered at ${deliveredAt}`
                      : `Not delivered`}
                  </ListGroupItem>
                  <ListGroupItem>
                    <h6 className="mb-4">Order Items</h6>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Add-Ons</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
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
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>{item.addon}</td>
                            {/* <td className="text-center">{item.quantity}px</td> */}
                            <td>{item.quantity}px</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ListGroupItem>
                </ListGroup>
              </Col>

              <Col lg="4" md="6">
                <ListGroup>
                  <ListGroupItem>
                    <h6 className="mb-4">Order Summary</h6>
                    <h6 className="d-flex align-items-center justify-content-between mb-3">
                      Items: <span>${itemsPrice}</span>
                    </h6>
                    <h6 className="d-flex align-items-center justify-content-between mb-3">
                      Tax: <span>${taxPrice}</span>
                    </h6>
                    <h6 className="d-flex align-items-center justify-content-between mb-3">
                      Shipping: <span>${shippingPrice}</span>
                    </h6>
                    <h6 className="d-flex align-items-center justify-content-between mb-3">
                      Total Add-Ons: <span>${totalAddons}</span>
                    </h6>
                    <div className="checkout__total">
                      <h5 className="d-flex align-items-center justify-content-between">
                        Total: <span>${totalPrice}</span>
                      </h5>
                    </div>
                  </ListGroupItem>
                  {!isPaid && (
                    <ListGroupItem>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div style={{ width: '100%' }}>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                    </ListGroupItem>
                  )}

                  {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroupItem>
                      {loadingDeliver && <div>Loading...</div>}
                      <div style={{ width: '100%' }}>
                        <button
                          className="btn__2"
                          onClick={deliverOrderHandler}
                        >
                          Deliver Order
                        </button>
                      </div>
                    </ListGroupItem>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  )
}

export async function getServerSideProps({ params }) {
  return { props: { params } }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })
