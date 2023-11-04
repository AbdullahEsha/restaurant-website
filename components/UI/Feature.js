import React from "react";
import Image from "next/image";
import { Container, Col, Row } from "reactstrap";
import featureImg01 from "../../public/images/service-01.png";
import featureImg02 from "../../public/images/service-02.png";
import featureImg03 from "../../public/images/service-03.png";

const featureData = [
  {
    title: "Quick Delivery",
    imgUrl: featureImg01,
    desc: "We pride ourselves on speed. Order or send anything in your city and we'll pick it up and deliver it in minutes. ",
  },
  {
    title: "Super Dine In",
    imgUrl: featureImg02,
    desc: "With a great variety of restaurants you can order your favourite food or explore new restaurants nearby! ",
  },
  {
    title: "Easy Pick up",
    imgUrl: featureImg03,
    desc: "Find anything you need! From supermarkets to shops, pharmacies to florists ",
  },
];

function Feature() {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="text-center">
            <h5 className="feature__subtitle mb-4">What we serve</h5>
            <h2 className="feature__title">Just sit back at home</h2>
            <h2 className="feature__title">
              we will <span>take care</span>
            </h2>
            <p className="mb-1 mt-4 feature__text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor,
              officiis?
            </p>
            <p className="feature__text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
              eius.{" "}
            </p>
          </Col>

          {featureData.map((item, index) => (
            <Col lg="4" md="4" key={index} className="mt-5">
              <div className="feature__item text-center px-5 py-3">
                <div className="feature__img w-25 mb-3">
                  <Image
                    src={item.imgUrl}
                    className="w-100 h-auto"
                    alt="Feature Image"
                  />
                </div>
                <h5 className="fw-bold">{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Feature;
