import React from 'react'
import { Container, Col, Row, ListGroup, ListGroupItem } from 'reactstrap'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Image from 'next/image'

function Footer(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitHandler = async ({ email }) => {
    try {
      console.log(email)
      const { data } = await axios.post('/api/newsletter', {
        email,
      })
      toast.success('Successfully Subcribed')
    } catch (err) {
      toast.error(`Something went wrong!`)
    }
  }

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3" md="4" sm="6">
            <div className="footer__logo text-start ">
              <span className="logo__text mb-3">
                <Image
                  src="/images/halal-kabab-logo.svg"
                  alt="halal-kabab-logo"
                  height={300}
                  width={300}
                  className="halal-kabab-footer-logo"
                />
              </span>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscingmv dmsfdgg
                mssdg
              </div>
            </div>
          </Col>

          <Col lg="3" md="4" sm="6">
            <h5 className="footer__title">Delivery Time</h5>
            <ListGroup>
              <ListGroupItem className="delivery__time-item border-0 ps-0">
                <span>Sunday - Thursday</span>
                <p>12:00pm - 10:00pm</p>
              </ListGroupItem>
              <ListGroupItem className="delivery__time-item border-0 ps-0">
                <span>Friday - Saturday</span>
                <p>12pm - 11pm</p>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg="3" md="4" sm="6">
            <h5 className="footer__title">Contact</h5>
            <ListGroup className="delivery__time--list">
              <ListGroupItem className="delivery__time-item border-0 ps-0">
                <p> Location: 7233 Marshall rd upper Darby pa 19082</p>
              </ListGroupItem>
              <ListGroupItem className="delivery__time-item border-0 ps-0">
                <span>Phone: 6107135841</span>
              </ListGroupItem>
              <ListGroupItem className="delivery__time-item border-0 ps-0">
                <span>Email: halalkababcurryud73@gmail.com</span>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg="3" md="4" sm="6">
            <h5 className="footer__title">Newsletter</h5>
            <p>Subscribe to our newsletter</p>
            <form className="newsletter" onSubmit={handleSubmit(submitHandler)}>
              <input
                type="email"
                {...register('email', {
                  required: 'Please enter email',
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: 'Please enter  a valid email address',
                  },
                })}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
              <button type="submit">
                <i className="ri-send-plane-line"></i>
              </button>
            </form>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg="6" md="6">
            <p className="copyright__text">
              Copyright - {new Date().getFullYear()}, website made by Halal
              Kabab & Curry. All Rights Reserved.
            </p>
          </Col>
          <Col lg="6" md="6">
            <div className="social__links d-flex align-items-center gap-4 justify-content-end">
              <p className="m-0">Follow: </p>
              <span>
                {' '}
                <Link href="https://www.facebook.com/" legacyBehavior>
                  <a>
                    <i className="ri-facebook-line"></i>
                  </a>
                </Link>{' '}
              </span>

              <span>
                <Link href="https://twitter.com/" legacyBehavior>
                  <a>
                    <i className="ri-twitter-line"></i>
                  </a>
                </Link>
              </span>

              <span>
                {' '}
                <Link href="https://youtube.com/" legacyBehavior>
                  <a>
                    <i className="ri-youtube-line"></i>
                  </a>
                </Link>{' '}
              </span>

              <span>
                {' '}
                <Link href="https://linkedin.com/" legacyBehavior>
                  <a>
                    <i className="ri-linkedin-line"></i>
                  </a>
                </Link>{' '}
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
