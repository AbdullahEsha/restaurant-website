import React, { useState } from "react";
import Head from "next/head";
import { Container, Row, Col } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';
import CommonSection from "../components/UI/CommonSection";
import SiteMap from "../components/SiteMap";


export default function Contact() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

      const res = await fetch("/api/sendgrid", {
        body: JSON.stringify({
          email: email,
          fullname: fullname,
          subject: subject,
          message: message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const { error } = await res.json();
      if (error) {
        console.log(error);
        toast.error('Something went wrong !')

        // Reset form fields
        setFullname("");
        setEmail("");
        setMessage("");
        setSubject("");
        return;
      }

      toast.success('Message successfully sent !')
      // Reset form fields
      setFullname("");
      setEmail("");
      setMessage("");
      setSubject("");
    console.log(fullname, email, subject, message);
  };
  return (
    <>
       <Head>
        <title>Delivera | Contact | Food Delivery and Takeout | Order Online</title>
        <meta name="description" content="We deliver your takeouts or essential groceries from the best-rated local partners straight to your door. Download our app or order online. Food. We Get It." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <ToastContainer/>
      <CommonSection title="Our Support is availabale 24/24" />
      <section>
        <Container>
          <Row>
            <Col md="6" lg="6" className="m-auto text-center">
              <h2>Let’s Talk!</h2>
              <p className="contact__text">
                Looking for more information about Next Shop? We’d love to hear
                from you! Drop us a line and we’ll get back to you shortly.
              </p>

              <div className="contact mt-4">
                <form onSubmit={handleSubmit}>
                  <div className="contact__input">
                    <input type="text"  value={fullname} onChange={(e) => { setFullname(e.target.value);}} placeholder="Enter your fullname" />
                  </div>
                  <div className="contact__input">
                    <input type="email"  value={email} onChange={(e) => { setEmail(e.target.value); }} placeholder="Enter your email" />
                  </div>
                  <div className="contact__input">
                    <input type="text"   value={subject} onChange={(e) => { setSubject(e.target.value);}} placeholder="Enter subject" />
                  </div>
                  <div className="contact__input">
                    <textarea rows="7" name="message" value={message} onChange={(e) => { setMessage(e.target.value);}} placeholder="Write message"></textarea>
                  </div>
                  <button
                    type="submit"
                    className="send__btn"
                    style={{
                      border: "none",
                      padding: "7px 25px",
                      borderRadius: "5px",
                      marginTop: "20px",
                    }}
                  >
                    Send a Message
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
        <SiteMap/>
      </section>
    </>
  );
}
