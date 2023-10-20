import React, { useContext, useEffect, useReducer } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Store } from "../../../helpers/Store";
import { useRouter } from "next/router";
import { getError } from "../../../helpers/error";
import { ToastContainer, toast} from "react-toastify";
import { Container, Row, Col, ListGroup, ListGroupItem, Table } from "reactstrap";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, error: '' };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true, errorUpdate: '' };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false, errorUpdate: '' };
      case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false, errorUpdate: action.payload };
      case 'UPLOAD_REQUEST':
        return { ...state, loadingUpload: true, errorUpload: '' };
      case 'UPLOAD_SUCCESS':
        return {
          ...state,
          loadingUpload: false,
          errorUpload: '',
        };
      case 'UPLOAD_FAIL':
        return { ...state, loadingUpload: false, errorUpload: action.payload };
  
      default:
        return state;
    }
  }

function ProductEdit({params}) {
    const productId = params.id;
    const { state } = useContext(Store);
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
      useReducer(reducer, {
        loading: true,
        error: '',
      });
    const {
      handleSubmit,
      register,
      formState: { errors },
      setValue,
    } = useForm();
  const { userInfo } = state;
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }else{
        const fetchData = async () => {
            try {
              dispatch({ type: 'FETCH_REQUEST' });
              const { data } = await axios.get(`/api/admin/products/${productId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
              });
              dispatch({ type: 'FETCH_SUCCESS' });
              setValue('name', data.name);
              setValue('slug', data.slug);
              setValue('category', data.category);
              setValue('image', data.image);
              setValue('image01', data.image01);
              setValue('image02', data.image02);
              setValue('price', data.price);
              setValue('countInStock', data.countInStock);
              setValue('description', data.description);
            } catch (err) {
              dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
          };
          fetchData();
    }
  }, []);

  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      console.log(data.secure_url);
      toast.success('File uploaded successfully!')
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(`${getError(err)}`);
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    image01,
    image02,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          category,
          image,
          image01,
          image02,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success(`Product updated successfully`)
      router.push('/admin/products');
      console.log( 'Product dta' + name,
        slug,
        price,
        category,
        image,
        image01,
        image02,
        countInStock,
        description,)
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(`${getError(err)}`);
    }
  };

  return (
    <>
      <Head>
        <title>Profile</title>
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
                <ListGroupItem className="bg__2">
                {loading && <CircularProgress/>}
            {error && <div className="text-bg-danger">{error}</div>}
                    <h6 className="mb-4">Edit {productId} </h6>
                    <form className="form mb-3" onSubmit={handleSubmit(submitHandler)}>
                        <div className="form__group">
                        <input
                            type="text"
                            {
                            ...register(
                                'name', {
                                required: 'Please enter name'
                                }
                            )
                            }
                            placeholder="Product name"
                            required
                        ></input>
                        {
                            errors.name && (
                            <div className="text-danger">{errors.name.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                        <input
                            type="text"
                            {
                            ...register(
                                'slug', {
                                required: 'Slug is required'
                                }
                            )
                            }
                            placeholder="Slug"
                            required
                        ></input>
                        {
                            errors.slug && (
                            <div className="text-danger">{errors.slug.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                        <input
                            type="number"
                            {
                            ...register(
                                'price', {
                                required: 'Price is required'
                                }
                            )
                            }
                            placeholder="Product price"
                            required
                        ></input>
                        {
                            errors.price && (
                            <div className="text-danger">{errors.price.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                        <input
                            type="text"
                            {
                            ...register(
                                'category', {
                                required: 'Category is required'
                                }
                            )
                            }
                            placeholder="Product category"
                            required
                        ></input>
                        {
                            errors.category && (
                            <div className="text-danger">{errors.category.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                        <input
                            type="text"
                            {
                            ...register(
                                'image', {
                                required: 'Image is required'
                                }
                            )
                            }
                            placeholder="Product first image"
                            required
                        ></input>
                        {
                            errors.image && (
                            <div className="text-danger">{errors.image.message}</div>
                            )
                        }
                        </div>
                        <div className="form__group">
                          <input type="file"  onChange={uploadHandler} id="upload" hidden/>
                          <label className="upload__btn" for="upload">Choose file</label>
                          {loadingUpload && (<div>Waiting for file...</div>)}
                        </div>

                        <div className="form__group">
                        <input
                            type="text"
                            id="image01"
                            {
                            ...register(
                                'image01', {
                                required: 'Second image is required'
                                }
                            )
                            }
                            placeholder="Product second image"
                            required
                        ></input>
                        {
                            errors.image01 && (
                            <div className="text-danger">{errors.image01.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                          <input type="file"   onChange={(e) => uploadHandler(e, 'image01')} id="upload1" hidden/>
                          <label className="upload__btn" for="upload1">Choose file</label>
                          {loadingUpload && (<div>Waiting for file...</div>)}
                        </div>

                        <div className="form__group">
                        <input
                            type="text"
                            id="image02"
                            {
                            ...register(
                                'image02', {
                                required: 'Third image is required'
                                }
                            )
                            }
                            placeholder="Product thrid image"
                            required
                        ></input>
                        {
                            errors.image02 && (
                            <div className="text-danger">{errors.image02.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                          <input type="file"   onChange={(e) => uploadHandler(e, 'image02')} id="upload2" hidden/>
                          <label className="upload__btn" for="upload2">Choose file</label>
                          {loadingUpload && (<div>Waiting for file...</div>)}
                        </div>

                        <div className="form__group">
                        <input
                            type="text"
                            {
                            ...register(
                                'description', {
                                required: 'Description is required'
                                }
                            )
                            }
                            placeholder="Product description"
                            required
                        ></input>
                        {
                            errors.description && (
                            <div className="text-danger">{errors.description.message}</div>
                            )
                        }
                        </div>

                        <div className="form__group">
                        <input
                            type="number"
                            {
                            ...register(
                                'countInStock', {
                                required: 'CountInStock is required'
                                }
                            )
                            }
                            placeholder="Product count"
                            required
                        ></input>
                        {
                            errors.countInStock && (
                            <div className="text-danger">{errors.countInStock.message}</div>
                            )
                        }
                        </div>

                        <button type="submit" className="addTOCart__btn">
                        Create
                        </button>
              </form>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};


export async function getServerSideProps({ params }){
    return {
        props: { params }
    }
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
