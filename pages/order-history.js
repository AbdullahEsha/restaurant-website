import React, { useContext, useEffect, useReducer } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { Store } from '../helpers/Store'
import { useRouter } from 'next/router'
import { getError } from '../helpers/error'
import { ToastContainer } from 'react-toastify'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Table,
} from 'reactstrap'
import axios from 'axios'
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}

function OrderHistory() {
  const { state } = useContext(Store)
  const { userInfo } = state
  const router = useRouter()

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchOrders()
  }, [])

  return (
    <>
      <Head>
        <title>
          Halal Kabab & Curry | Order History | Food Delivery and Takeout |
          Order Online
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
        <ToastContainer />
        <Container className="mt-4 mb-4">
          <Row>
            <Col lg="3" md="6">
              <ListGroup>
                <ListGroupItem
                  action
                  className="bg-warning text-light "
                  href="/order-history"
                  tag="a"
                >
                  Order History
                </ListGroupItem>
                <ListGroupItem action href="/profile" tag="a">
                  Profile
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col lg="9" md="6">
              <ListGroup>
                <ListGroupItem>
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div className="bg-warning">{error}</div>
                  ) : (
                    <>
                      <h6 className="mb-4">Order Items</h6>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <th scope="row">{order._id.substring(20, 24)}</th>
                              <td>{order.createdAt}</td>
                              <td>${order.totalPrice}</td>
                              <td>
                                {order.isPaid
                                  ? `paid at ${order.paidAt}`
                                  : 'not paid'}
                              </td>
                              <td>
                                {order.isDelivered
                                  ? `delivered at ${order.deliveredAt}`
                                  : 'not delivered'}
                              </td>
                              <td>
                                {' '}
                                <Link
                                  href={`/order/${order._id}`}
                                  passHref
                                  legacyBehavior
                                >
                                  <button className="bg-warning addTOCart__btn">
                                    Details
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false })
