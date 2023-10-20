import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import Image from 'next/image';
import categoryImg01 from '../../public/images/category-01.png';
import categoryImg02 from '../../public/images/category-02.png';
import categoryImg03 from '../../public/images/category-03.png';
import categoryImg04 from '../../public/images/category-04.png';

const categoryData=[
    {
        display:'FastFood',
        imgUrl: categoryImg01
    },
    {
        display:'Pizza',
        imgUrl: categoryImg02
    },
    {
        display:'Indian Food',
        imgUrl: categoryImg03
    },
    {
        display:'Row Meat',
        imgUrl: categoryImg04
    }
]

const Category=()=>{
    return (
        <Container>
            <Row>

                {
                    
                    categoryData.map((item,index)=>(
                        <Col lg="3" md="4" sm="6" xs="6" className="mb-3">
                        <div className="category__item d-flex align-items-center gap-3">
                            <div className="category__img">
                                <Image src={item.imgUrl} height={40}  width={40} alt="Category image"/>
                            </div>
                            <h6>{item.display}</h6>
                        </div>
                        </Col>
                    ))
                }
             
            </Row>
        </Container>
    )
};

export default Category;