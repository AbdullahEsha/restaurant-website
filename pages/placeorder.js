import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Store } from "../helpers/Store";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Container,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Table,
} from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { toast, ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import CheckWizard from "../components/CheckWizard";
import { getError } from "../helpers/error";

function Placeorder() {
  const [isCart, setIsCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, []);
  useEffect(() => {
    cartItems ? setIsCart(true) : setIsCart(false);
  }, []);

  const updateCartHandler = async (item, quantity) => {
    const data = axios.get(`/api/products/${item._id}`);
    if (data.countInStock <= 0) {
      toast.error("Sorry. This food is not available today!");
      return;
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "CART_CLEAR" });
      Cookies.remove("cartItems");
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(`${getError(err)}`);
    }
  };

  return (
    <>
      <Head>
        <title>
          Delivera | Place Order | Food Delivery and Takeout | Order Online
        </title>
        <meta
          name="description"
          content="We deliver your takeouts or essential groceries from the best-rated local partners straight to your door. Download our app or order online. Food. We Get It."
        />
        <link rel="icon" href="/favicon.ico" />
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
      <CommonSection title="Payment" />
      <ToastContainer />
      <section>
        <Container>
          <CheckWizard activeStep={3} />
          <Row>
            <Col lg="8" md="6">
              <ListGroup>
                <ListGroupItem>
                  <h6 className="mb-4">Shipping Address</h6>
                  {shippingAddress.fullName}, {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </ListGroupItem>
                <ListGroupItem>
                  <h6 className="mb-4">Payment Method</h6>
                  {paymentMethod}
                </ListGroupItem>
                <ListGroupItem>
                  <h6 className="mb-4">Order Items</h6>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isCart &&
                        cartItems.map((item) => (
                          <tr>
                            <td className="text-center cart__img-box">
                              <div className="w-50">
                                <Image
                                  width={50}
                                  height={50}
                                  src={`${item.image}`}
                                  alt={item.name}
                                />
                              </div>
                            </td>
                            <td className="text-center">{item.name}</td>
                            <td className="text-center">${item.price}</td>
                            {/* <td className="text-center">{item.quantity}px</td> */}
                            <td className="text-center">
                              <select
                                value={item.quantity}
                                onChange={(e) =>
                                  updateCartHandler(item, e.target.value)
                                }
                              >
                                {[...Array(item.countInStock).keys()].map(
                                  (x) => (
                                    <option value={x + 1}>{x + 1}</option>
                                  )
                                )}
                              </select>
                            </td>
                            <td className="text-center cart__item-del">
                              <i
                                onClick={() => removeItemHandler(item)}
                                className="cursor__pointer ri-delete-bin-line"
                              ></i>
                            </td>
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
                  <div className="checkout__total">
                    <h5 className="d-flex align-items-center justify-content-between">
                      Total: <span>${totalPrice}</span>
                    </h5>
                  </div>
                  <button className="btn__2" onClick={placeOrderHandler}>
                    Place Order
                  </button>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default dynamic(() => Promise.resolve(Placeorder), { ssr: false });
