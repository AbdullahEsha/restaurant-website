import "../styles/globals.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../public/assets/boxicons-2.0.7/css/boxicons.min.css";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { StoreProvider } from "../helpers/Store";
import Spinner from "../components/Spinner";
import Router from "next/router";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  /**
   * Track when the routing is changing
   */
  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  });
  return (
    <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
        {loading ? (
          <Spinner />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </PayPalScriptProvider>
    </StoreProvider>
  );
}

export default MyApp;
