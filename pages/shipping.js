import React, { useEffect, useContext } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Store } from "../helpers/Store";
import { toast, ToastContainer } from "react-toastify";
import CheckWizard from "../components/CheckWizard";
function checkout() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const { location } = shippingAddress;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, []);

  const submitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country, location },
    });
    Cookies.set("shippingAddress", {
      fullName,
      address,
      city,
      postalCode,
      country,
      location,
    });
    router.push("/payment");
    toast.success("Successfully Register");
  };

  const chooseLocationHandler = (e) => {
    const fullName = getValues("fullName");
    const address = getValues("address");
    const city = getValues("city");
    const postalCode = getValues("postalCode");
    const country = getValues("country");

    dispatch({
      type: "SAVE_SHIPPING_LOCATION",
      payload: { fullName, address, city, postalCode, country },
    });

    Cookies.set(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );

    router.push("/map");
  };
  return (
    <>
      <Head>
        <title>
          Halal Kabab & Curry | Food Delivery and Takeout | Order Online
        </title>
        <meta
          name="description"
          content="We deliver your takeouts from the best-rated local partners straight to your door. Food you Get It."
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
      <main>
        <ToastContainer />
        <CommonSection title="Provide Shipping address" />

        <section className="mt-4">
          <Container>
            <Row>
              <Col lg="8" md="6">
                <CheckWizard activeStep={1} />
                <h6 className="mb-4">Shipping Address</h6>
                <form
                  className="checkout__form"
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="form__group">
                    <input
                      type="text"
                      {...register("fullName", {
                        required: "Please enter your full name",
                        minLength: {
                          value: 4,
                          message: "Full Name is more than 3",
                        },
                      })}
                      placeholder="Enter your full name"
                      required
                      autoComplete="true"
                    />
                    {errors.fullName && (
                      <div className="text-danger">
                        {errors.fullName.message}
                      </div>
                    )}
                  </div>

                  <div className="form__group">
                    <input
                      type="text"
                      {...register("address", {
                        required: "Please enter your full address",
                        minLength: {
                          value: 4,
                          message: "Full address is more than 3",
                        },
                      })}
                      placeholder="Enter your full address"
                      required
                    />
                    {errors.address && (
                      <div className="text-danger">
                        {errors.address.message}
                      </div>
                    )}
                  </div>
                  <div className="form__group">
                    <input
                      type="text"
                      {...register("city", {
                        required: "Please enter your city",
                        minLength: { value: 4, message: "City is more than 3" },
                      })}
                      placeholder="City"
                      required
                    />
                    {errors.city && (
                      <div className="text-danger">{errors.city.message}</div>
                    )}
                  </div>
                  <div className="form__group">
                    <input
                      type="number"
                      {...register("postalCode", {
                        required: "Please enter your postal code",
                      })}
                      placeholder="Postal Code"
                      required
                    />
                    {errors.postalCode && (
                      <div className="text-danger">
                        {errors.postalCode.message}
                      </div>
                    )}
                  </div>
                  <div className="form__group">
                    <input
                      type="text"
                      {...register("country", {
                        required: "Please enter your city",
                        minLength: { value: 3, message: "City is more than 2" },
                      })}
                      placeholder="Country"
                      required
                    />
                    {errors.country && (
                      <div className="text-danger">
                        {errors.country.message}
                      </div>
                    )}
                  </div>
                  <div className="form__group">
                    <button
                      type="button"
                      className="upload__btn"
                      onClick={chooseLocationHandler}
                    >
                      Choose on Map
                    </button>
                    <div className="text-danger">
                      {location && `${location.lat},${location.lng}`}
                    </div>
                  </div>
                  <button type="submit" className="addTOCart__btn">
                    Payment
                  </button>
                </form>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}

export default dynamic(() => Promise.resolve(checkout), { ssr: false });
