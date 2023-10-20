import React, { useState , useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Container, Row, Col, Table } from "reactstrap";
import { Select, MenuItem } from '@material-ui/core';
import CommonSection from "../components/UI/CommonSection";
import { useContext } from "react";
import { Store } from "../helpers/Store";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import dynamic from "next/dynamic";
function Cart() {
    const [isCart,setIsCart] = useState(false)
    const { state,dispatch } = useContext(Store);
    const { cart : { cartItems}  } = state;
  
    useEffect(()=>{
      cartItems ? setIsCart(true) :setIsCart(false)
    },[])

    const updateCartHandler = async (item,quantity)=>{
      const data=axios.get(`/api/products/${item._id}`);
      if(data.countInStock <=0){
        toast.error('Sorry. This food is not available today!');
        return 
      }

      dispatch({ type: 'CART_ADD_ITEM', payload: {...item, quantity }});
    };

    const removeItemHandler=(item)=>{
      dispatch({ type: 'CART_REMOVE_ITEM', payload:item})
    }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Your Current Cart" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <main>
        <ToastContainer/>
      <CommonSection title="Your Cart" />

      <section>
        <Container>
          <Row>
            <Col lg="12">
              {cartItems.length === 0 ? (
                <h5 className="text-center">Your cart is empty. <Link href="/shop" legacyBehavior><a>Go shopping </a></Link></h5>
              ) : (
                <>
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
                    {  isCart && (cartItems.map((item) => (
                      // <Tr item={item} key={item.id} />
                      <tr>
                      <td className="text-center cart__img-box">
                          <div className="w-50">
                          <Image  width={50} height={50} src={`${item.image}`} alt={item.name} />
                          </div>
                      </td>
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">${item.price}</td>
                      {/* <td className="text-center">{item.quantity}px</td> */}
                      <td className="text-center">
                        <Select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                      </td>
                      <td className="text-center cart__item-del">
                        <i onClick={()=>removeItemHandler(item)} className="cursor__pointer ri-delete-bin-line"></i> 
                      </td>
                    </tr>
                    ))
                  
                  )}
                  </tbody>
                </Table>

                <div className="mt-4">
                <h6>
                  Subtotal: $
                  <span className="cart__subtotal">{isCart && (cartItems.reduce((a,c)=>a+c.quantity*c.price, 0))}</span>
                </h6>
                <p>Taxes and shipping will calculate at checkout</p>
                <div className="cart__page-btn">
                  <button className="addTOCart__btn me-4">
                    <Link href="/shop" legacyBehavior><a className="text-white">Continue shopping</a></Link>
                  </button>
                  <button className="addTOCart__btn">
                    <Link href="/shipping" legacyBehavior><a className="text-white">Proceed Checkout</a></Link>
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
  );
}


export default dynamic(() => Promise.resolve(Cart), { ssr: false });