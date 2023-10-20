import React, { useContext, useEffect, useReducer, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
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
} from "reactstrap";
import axios from "axios";
import { CircularProgress } from '@material-ui/core'

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const ref = useRef();
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`, {
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
        <title>Admin Dashboard</title>
        <meta name="description" content="Your Current Cart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ToastContainer />
        <ToastContainer />
        <Container className="mt-4 mb-4">
          <Row>
            <Col lg="3" md="6" className="mb-3">
              <ListGroup>
                <ListGroupItem
                  action
                  className="bg-danger text-light "
                  href="/admin/dashboard"
                  tag="a"
                >
                  Admin Dashboard
                </ListGroupItem>
                <ListGroupItem action href="/admin/orders" tag="a">
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
                    <>
                      <section>
                        <Row className="card__content">
                          <Col lg="3" md="4" sm="6" xs="6" className="mb-3">
                            <div className="category__item d-flex align-items-center">
                              <h6> {summary.productsCount} Products</h6>
                            </div>
                          </Col>
                          <Col lg="3" md="4" sm="6" xs="6" className="mb-3">
                            <div className="category__item d-flex align-items-center">
                              <h6> {summary.ordersCount} Orders</h6>
                            </div>
                          </Col>
                          <Col lg="3" md="4" sm="6" xs="6" className="mb-3">
                            <div className="category__item d-flex align-items-center">
                              <h6> {summary.usersCount} Users</h6>
                            </div>
                          </Col>
                          <Col lg="3" md="4" sm="6" xs="6" className="mb-3">
                            <div className="category__item d-flex align-items-center">
                              <h6> ${summary.ordersPrice} Sales</h6>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <h6>Sales Chart</h6>
                          <Bar
                            data={{
                              labels: summary.salesData.map((x) => x._id),
                              datasets: [
                                {
                                  label: "Sales",
                                  backgroundColor: "#fde4e4",
                                  data: summary.salesData.map(
                                    (x) => x.totalSales
                                  ),
                                },
                              ],
                            }}
                            ref={ref}
                            options={{
                              legend: { display: true, position: "right" },
                            }}
                          />
                        </Row>
                      </section>
                    </>
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

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
