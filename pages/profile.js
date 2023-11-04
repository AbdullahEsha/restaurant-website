import React, { useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Store } from '../helpers/Store'
import { useRouter } from 'next/router'
import { getError } from '../helpers/error'
import { ToastContainer, toast } from 'react-toastify'
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'

function Profile() {
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const router = useRouter()

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitHandler = async ({ name, email, password }) => {
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      )
      dispatch({ type: 'USER_LOGIN', payload: data })
      Cookies.set('userInfo', data)
      console.log(data)
      toast.success('Profile updated successfully!')
    } catch (err) {
      console.log(err)
      // console.log(err.response.data ? err.message.response.data.message : err.message);
      toast.error(`${getError(err)}`)
    }
    console.log(name, email, password)
  }

  const logoutClickHandler = () => {
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    Cookies.remove('shippingAddress')
    Cookies.remove('paymentMethod')
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>
          Halal Kabab & Curry | Profile | Food Delivery and Takeout | Order
          Online
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
                <ListGroupItem action href="/order-history" tag="a">
                  Order History
                </ListGroupItem>
                <ListGroupItem
                  className="bg-warning text-light "
                  action
                  href="/profile"
                  tag="a"
                >
                  Profile
                </ListGroupItem>
                <ListGroupItem action onClick={logoutClickHandler} tag="a">
                  Logout
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col lg="9" md="6">
              <ListGroup>
                <ListGroupItem className="bg__2">
                  <h6 className="mb-4">Profile</h6>
                  <form
                    className="form mb-3"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <div className="form__group">
                      <input
                        type="text"
                        {...register('name', {
                          required: 'Please enter name',
                          minLength: {
                            value: 3,
                            message: 'Name is more than 2',
                          },
                        })}
                        placeholder="Full name"
                        required
                      ></input>
                      {errors.name && (
                        <div className="text-danger">{errors.name.message}</div>
                      )}
                    </div>
                    <div className="form__group">
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Please enter email',
                          pattern: {
                            value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                            message: 'Please enter  a valid email address',
                          },
                        })}
                        placeholder="Email"
                        required
                      ></input>
                      {errors.email && (
                        <div className="text-danger">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="form__group">
                      <input
                        type="password"
                        {...register('password', {
                          required: 'Please enter password',
                          minLength: {
                            value: 6,
                            message: 'Password is more than 5 chars',
                          },
                        })}
                        placeholder="Password"
                        required
                      ></input>
                      {errors.password && (
                        <div className="text-danger">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="addTOCart__btn">
                      Update
                    </button>
                  </form>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false })
