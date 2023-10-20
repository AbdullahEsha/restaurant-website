import React, { useContext, useEffect, useReducer, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import 'chart.js/auto';
import { Bar } from "react-chartjs-2";
import { Store } from "../../helpers/Store";
import { useRouter } from "next/router";
import { getError } from "../../helpers/error";
import { ToastContainer, toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Table,
} from "reactstrap";
import axios from "axios";
import { CircularProgress } from '@material-ui/core'

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Orders() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const ref = useRef();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        toast.error(`${getError(err)}`);
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Order History</title>
        <meta name="description" content="Your Current Cart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ToastContainer />
        <Container className="mt-4 mb-4">
          <Row>
            <Col lg="3" md="6" className="mb-3">
              <ListGroup>
                <ListGroupItem
                  action
                  href="/admin/dashboard"
                  tag="a"
                >
                  Admin Dashboard
                </ListGroupItem>
                <ListGroupItem action href="/admin/orders"  className="bg-danger text-light" tag="a">
                  Orders
                </ListGroupItem>
                <ListGroupItem action href="/admin/products" tag="a">
                  Products
                </ListGroupItem>
                <ListGroupItem action href="/admin/users" tag="a">
                  Users
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col lg="9" md="6">
              <ListGroup>
                <ListGroupItem>
                  {loading ? (
                    <CircularProgress/>
                  ) : error ? (
                    <div className="bg-danger">{error}</div>
                  ) : (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>USER</th>
                          <th>DATE</th>
                          <th>TOTAL</th>
                          <th>PAID</th>
                          <th>DELIVERED</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                          {
                              orders.map((order)=>(
                                  <tr key={order._id}>
                                  <th scope="row">{order._id.substring(20, 24)}</th>
                                  <td>{order.user ? order.user.name: 'DELETED USER'}</td>
                                  <td>{order.createdAt}</td>
                                  <td>${order.totalPrice}</td>
                                  <td>{order.isPaid ? `paid at ${order.paidAt}` : 'not paid'}</td>
                                  <td>{order.isDelivered ? `delivered at ${order.deliveredAt}` : 'not delivered'}</td>
                                  <td> <Link href={`/order/${order._id}`} passHref legacyBehavior><button className="btn__3">Details</button></Link></td>
                                </tr>
                              ))
                          }
                      </tbody>
                    </Table>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

export default dynamic(() => Promise.resolve(Orders), { ssr: false });
