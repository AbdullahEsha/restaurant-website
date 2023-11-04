import React from "react";
import Image from "next/image";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import whyImg from "../../public/images/location.png";

function WhyChooseUs() {
  return (
    <section className="why__choose-us">
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="hero__img w-100">
              <Image src={whyImg} className="w-100 hero__img h-auto" alt="" />
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="why__tasty-treat">
              <h2 className="tasty__treat-title mb-4">
                Why <span>Tasty Treat?</span>
              </h2>
              <p className="tasty__treat-desc">
                Lorem ipsum dollor ipsmf dollar Lorem ipsum dollor ipsmf dollar
                Lorem ipsum dollor ipsmf dollar Lorem ipsum dollor ipsmf dollar.
              </p>
              <ListGroup className="mt-4">
                <ListGroupItem className="border-0 ps-0">
                  <p className="choose__us-title  d-flex align-items-center gap-2">
                    <i className="ri-checkbox-circle-line"></i> Fresh and Tasty
                    foods
                  </p>
                  <p className="choose__us-desc">
                    Lorem ipsum dollor ipsum dollor mmfm
                  </p>
                </ListGroupItem>
                <ListGroupItem className="border-0 ps-0">
                  <p className="choose__us-title  d-flex align-items-center gap-2">
                    <i className="ri-checkbox-circle-line"></i>Quality Support
                  </p>
                  <p className="choose__us-desc">
                    Lorem ipsum dollor ipsum dollor mmfm
                  </p>
                </ListGroupItem>
                <ListGroupItem className="border-0 ps-0">
                  <p className="choose__us-title  d-flex align-items-center gap-2">
                    <i className="ri-checkbox-circle-line"></i>Ordered from any
                    Location
                  </p>
                  <p className="choose__us-desc">
                    Lorem ipsum dollor ipsum dollor mmfm
                  </p>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default WhyChooseUs;
