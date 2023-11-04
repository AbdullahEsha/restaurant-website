import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import ava01 from '../../public/images/ava-1.jpg'
import ava02 from '../../public/images/ava-2.jpg'
import ava03 from '../../public/images/ava-3.jpg'

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 3000,
    autoplaySpeed: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Slider {...settings}>
      <div>
        <p className="review__text">
          "We discovered the ability to order Imo’s Pizza through Delivera, and
          my husband was so happy to be able to enjoy his hometown pizza all the
          way in PA""{' '}
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <div className="rounded slider__image mr-4">
            <Image
              src={ava01}
              height={80}
              width={80}
              className="rounded"
              alt="Testimonial User"
            />
          </div>
          <h6>John Doe</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "Absolutely the freshest, sweetest lobster meat. Heaven! Halal Kabab &
          Curry & McLoons brought the seashore to my kitchen and I am so
          happy!""{' '}
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <div className="rounded slider__image mr-4">
            <Image
              src={ava02}
              height={80}
              width={80}
              className="rounded"
              alt="Testimonial User"
            />
          </div>
          <h6>Marc Joe</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "Thank you for providing a link between places you love from home and
          the places life takes you! I’ve ordered through you multiple times for
          myself, family, & friends. Your delivery is on point and the happiness
          and nostalgia you deliver is worth every penny!""{' '}
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <div className="rounded slider__image mr-4">
            <Image
              src={ava03}
              height={80}
              width={80}
              className="rounded"
              alt="Testimonial User"
            />
          </div>
          <h6>Hony Jules</h6>
        </div>
      </div>
    </Slider>
  )
}

export default TestimonialSlider
