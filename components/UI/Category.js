import React from "react";
import { Container, Col, Row } from "reactstrap";
import Image from "next/image";
import Link from "next/link";

const categoryData = [
  {
    display: "Kabab",
    imgUrl: "https://cdn-icons-png.flaticon.com/128/2362/2362337.png",
  },
  {
    display: "Sea Food",
    imgUrl: "https://cdn-icons-png.flaticon.com/128/3071/3071050.png",
  },
  {
    display: "Indian Food",
    imgUrl: "https://cdn-icons-png.flaticon.com/128/3092/3092692.png",
  },
  {
    display: "Dessert Fantacy",
    imgUrl: "https://cdn-icons-png.flaticon.com/128/2871/2871916.png",
  },
];

const Category = () => {
  return (
    <Container>
      <Row>
        {categoryData.map((item, index) => (
          <Col lg="3" md="4" sm="6" xs="6" className="mb-3" key={index}>
            <Link
              href={"/search?category=sample+category"}
              className="category__item d-flex align-items-center gap-3 justify-content-center"
            >
              <div className="category__img">
                <Image
                  src={item.imgUrl}
                  height={40}
                  width={40}
                  alt="Category image"
                />
              </div>
              <h6>{item.display}</h6>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Category;
