import React, { useContext, useEffect, useReducer, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Store } from '../../../helpers/Store'
import { useRouter } from 'next/router'
import { getError } from '../../../helpers/error'
import { ToastContainer, toast } from 'react-toastify'
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Table,
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Checkbox } from 'antd'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload }
    default:
      return state
  }
}

function UserEdit({ params }) {
  const userId = params.id
  const { state } = useContext(Store)
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()
  const { userInfo } = state
  const router = useRouter()

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' })
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          })
          dispatch({ type: 'FETCH_SUCCESS' })
          setValue('name', data.name)
          setIsAdmin(data.isAdmin)
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
        }
      }
      fetchData()
    }
  }, [])

  const submitHandler = async ({ name }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      )
      dispatch({ type: 'UPDATE_SUCCESS' })
      toast.success(`User updated successfully`)
      router.push('/admin/users')
      console.log('User dta' + name)
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) })
      toast.error(`${getError(err)}`)
    }
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Your Current Cart" />
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
      <main>
        <ToastContainer />
        <Container className="mt-4 mb-4">
          <Row>
            <Col lg="3" md="6" className="mb-3">
              <ListGroup>
                <ListGroupItem action href="/admin/dashboard" tag="a">
                  Admin Dashboard
                </ListGroupItem>
                <ListGroupItem action href="/admin/orders" tag="a">
                  Orders
                </ListGroupItem>
                <ListGroupItem action href="/admin/products" tag="a">
                  Products
                </ListGroupItem>
                <ListGroupItem action href="/admin/modifiers" tag="a">
                  Modifiers
                </ListGroupItem>
                <ListGroupItem
                  action
                  href="/admin/users"
                  className="bg-warning text-light "
                  tag="a"
                >
                  Users
                </ListGroupItem>
              </ListGroup>
            </Col>

            <Col lg="9" md="6">
              <ListGroup>
                <ListGroupItem className="bg__2">
                  {loading && <div>Circular Loading...</div>}
                  {error && <div className="text-bg-warning">{error}</div>}
                  <h6 className="mb-4">Edit {userId} </h6>
                  <form
                    className="form mb-3"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <div className="form__group">
                      <input
                        type="text"
                        {...register('name', {
                          required: 'Please enter name',
                        })}
                        placeholder="User name"
                        required
                      ></input>
                      {errors.name && (
                        <div className="text-danger">{errors.name.message}</div>
                      )}
                    </div>
                    <div className="form__group">
                      <Checkbox
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        checked={isAdmin}
                      >
                        isAdmin
                      </Checkbox>
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  }
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false })
