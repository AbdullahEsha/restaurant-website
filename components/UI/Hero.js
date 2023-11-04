import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Container, Col, Row } from "reactstrap";
import HeroImg from "../../public/images/hero.png";

function Hero() {
  const router = useRouter();
  return (
    <section>
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="hero__container">
              <h5 className="mb-3">Easy way to make an order.</h5>
              <h1 className="mb-4 hero__title">
                <span>Hungry?</span> just wait food <span> at your door</span>
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatu
              </p>

              <div className="hero__btns d-flex align-items-center gap-5 mt-4">
                <button
                  onClick={() => {
                    router.push("/search");
                  }}
                  className="order__btn d-flex justify-content-beetween align-items-center"
                >
                  Order now
                  <i className="ri-arrow-right-s-line"></i>
                </button>
                <button className="all__foods-btn">
                  <Link href="/menu" legacyBehavior>
                    <a>Go to menu</a>
                  </Link>
                </button>
              </div>

              <div className="hero__service d-flex align-center gap-5 mt-5">
                <p className="d-flex align-items-center gap-2">
                  <span className="shipping__icon">
                    <i className="ri-car-line"></i>
                  </span>{" "}
                  No shipping charge
                </p>
                <p className="d-flex align-items-center gap-2">
                  <span className="shipping__icon">
                    <i className="ri-shield-check-line"></i>
                  </span>{" "}
                  100 % secure
                </p>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="hero__img">
              <Image
                src={HeroImg}
                alt="Hero Image"
                className="w-100 hero__img h-100"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
