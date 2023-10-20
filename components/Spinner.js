import React from 'react'
import SpinnerImage from '../public/images/spinner-image.png';
import Image from 'next/image'
function Spinner() {
  return (
    <div className="spinner">
        <Image src={SpinnerImage} height={80} width={80} className="pizza-part pizza-part-1" />
        <Image src={SpinnerImage}  height={80} width={80} className="pizza-part pizza-part-2" />
        <Image src={SpinnerImage}  height={80} width={80} className="pizza-part pizza-part-3" />
        <Image src={SpinnerImage}  height={80} width={80} className="pizza-part pizza-part-4" />
    </div>
  )
}

export default Spinner