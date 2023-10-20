import React from "react";
import { Container } from "reactstrap";
import bg from '../../public/images/hero.png';


const CommonSection = (props) => {
  return (
    <section className="common__section" style={{  backgroundImage:  ` linear-gradient(#212245b2, #212245b2), url(${bg.src})`}}>
      <Container>
        <h2 className="text-white">{props.title}</h2>
      </Container>
    </section>
  );
};

export default CommonSection;
