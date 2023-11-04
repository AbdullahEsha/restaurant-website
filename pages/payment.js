import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Store } from '../helpers/Store'
import Cookies from 'js-cookie'
import { Container, Col, Row } from 'reactstrap'
import CommonSection from '../components/UI/CommonSection'
import { toast, ToastContainer } from 'react-toastify'
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from '@material-ui/core'
import CheckWizard from '../components/CheckWizard'

function Payment() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('')
  const { state, dispatch } = useContext(Store)
  const [value, setValue] = useState('Paypal')
  const {
    cart: { shippingAddress },
  } = state
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping')
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || ' ')
    }
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()
    if (!paymentMethod) {
      toast.error('Payment Method is required')
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod })
      Cookies.set('paymentMethod', paymentMethod)
      router.push('/placeorder')
    }
  }

  const onChange = (e) => {
    console.log('radio checked', e.target.value)
    setPaymentMethod(e.target.value)
    setValue(e.target.value)
  }
  return (
    <>
      <Head>
        <title>
          Halal Kabab & Curry | Payment | Food Delivery and Takeout | Order
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
      <CommonSection title="Payment" />
      <ToastContainer />
      <section className="mt-4 mb-4">
        <Container>
          <CheckWizard activeStep={2} />
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-3" onSubmit={submitHandler}>
                <div className="form__group">
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="Payment Method"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        label="PayPal"
                        value="PayPal"
                        control={<Radio />}
                      ></FormControlLabel>
                      <FormControlLabel
                        label="Cash"
                        value="Cash"
                        control={<Radio />}
                      ></FormControlLabel>
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="mb-2">
                  <button type="submit" className="addTOCart__btn">
                    Continue
                  </button>
                </div>
                <button
                  type="button"
                  className="addTOCart__btn bg-secondary"
                  onClick={() => router.push('/shipping')}
                >
                  Back
                </button>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Payment
