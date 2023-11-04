import React, { useContext, useEffect, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Store } from "../../../helpers/Store";
import { useRouter } from "next/router";
import { getError } from "../../../helpers/error";
import { ToastContainer, toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Table,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function ModifierEdit({ params }) {
  const modifierId = params.id;
  const [products, setProducts] = useState([]);
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
  } = useForm();
  const { userInfo } = state;
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(
            `/api/admin/modifiers/${modifierId}`,
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
          const { data: productData } = await axios.get(`/api/admin/products`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setProducts(productData);
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("title", data.title);
          setValue("option", data.option);
          setValue("usedIn", data.usedIn);
          setValue("price", data.price);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ title, option, usedIn, price }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/modifiers/${modifierId}`,
        {
          title,
          option,
          usedIn,
          price,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(`Modifier updated successfully`);
      router.push("/admin/modifiers");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(`${getError(err)}`);
    }
  };

  const options =
    products?.map((product) => ({
      label: product?.name,
      value: product?._id,
    })) || [];

  let options2 = [
    { value: "Spicy", label: "Spicy" },
    { value: "Mild", label: "Mild" },
    { value: "Extra Spicy", label: "Extra Spicy" },
  ];

  return (
    <>
      <Head>
        <title>Modifier Edit</title>
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
                <ListGroupItem
                  action
                  href="/admin/modifiers"
                  className="bg-warning text-light "
                  tag="a"
                >
                  Modifiers
                </ListGroupItem>
                <ListGroupItem action href="/admin/users" tag="a">
                  Users
                </ListGroupItem>
              </ListGroup>
            </Col>

            <Col lg="9" md="6">
              <ListGroup>
                <ListGroupItem className="bg__2">
                  {loading && <CircularProgress />}
                  {error && <div className="text-bg-warning">{error}</div>}
                  <h6 className="mb-4">Edit {modifierId} </h6>
                  <form
                    className="form mb-3"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <div className="form__group">
                      <input
                        type="text"
                        {...register("title", {
                          required: "Please enter title",
                        })}
                        placeholder="Title name"
                        required
                      ></input>
                      {errors.title && (
                        <div className="text-danger">
                          {errors?.title.message}
                        </div>
                      )}
                    </div>
                    <div className="form__group">
                      <Controller
                        control={control}
                        defaultValue={options2.map((c) => c.value)}
                        name="option"
                        render={({ field: { onChange, value, ref } }) => (
                          <CreatableSelect
                            options={options2}
                            isMulti={true}
                            defaultValue={options2[0]}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 3,
                              colors: {
                                ...theme.colors,
                                primary25: "#fff4d6",
                                primary: "#f8b60d",
                              },
                            })}
                            // set data of option in react-hook-form register function
                            value={options2.filter((c) =>
                              value.includes(c.value)
                            )}
                            onChange={(val) => {
                              // options2 includes the new option
                              options2 = val;
                              onChange(val.map((c) => c.value));
                            }}
                          />
                        )}
                      />
                      {errors.option && (
                        <div className="text-danger">
                          {errors?.option.message}
                        </div>
                      )}
                    </div>
                    <div className="form__group">
                      <Controller
                        control={control}
                        defaultValue={options.map((c) => c.value)}
                        name="usedIn"
                        render={({ field: { onChange, value, ref } }) => (
                          <Select
                            options={options}
                            isMulti={true}
                            defaultValue={options[0]}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 3,
                              colors: {
                                ...theme.colors,
                                primary25: "#fff4d6",
                                primary: "#f8b60d",
                              },
                            })}
                            // set data of option in react-hook-form register function
                            value={options.filter((c) =>
                              value.includes(c.value)
                            )}
                            onChange={(val) =>
                              onChange(val.map((c) => c.value))
                            }
                          />
                        )}
                      />
                      {errors.option && (
                        <div className="text-danger">
                          {errors?.option.message}
                        </div>
                      )}
                    </div>
                    <div className="form__group">
                      <input
                        type="number"
                        {...register("price", {
                          required: "Please enter price",
                        })} // custom register react-hook-form
                        placeholder="Price"
                        required
                      ></input>
                      {errors.price && (
                        <div className="text-danger">
                          {errors?.price.message}
                        </div>
                      )}
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
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ModifierEdit), { ssr: false });
