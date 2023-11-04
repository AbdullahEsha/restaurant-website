import React from "react";
import Image from "next/image";
import { Container, Col, Row } from "reactstrap";
import TestimonialSlider from "./TestimonialSlider";
import networkImg from "../../public/images/network.png";

function Testimonial() {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="testimonial">
              <h5 className="testimonial__subtitle mb-4">Testimonial</h5>
              <h2 className="testimonial__title mb-4">
                What our <span>Customers </span>are saying ?
              </h2>
              <p className="testimonial__desc">
                Lorem ipsum dolor sit amet, consectetur
              </p>

              <TestimonialSlider />
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="w-100 hero__img h-100">
              <Image
                src={networkImg}
                alt="Network Image"
                className="w-100 hero__img h-100"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Testimonial;
