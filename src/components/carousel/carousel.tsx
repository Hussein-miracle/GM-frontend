import React from 'react'
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import './carousel.styles.scss';

const Carousel = () => {
  return (
    <div className='carousel'>
      <button className='carousel__btn'><KeyboardArrowLeftIcon/></button>
      <button className='carousel__btn'><KeyboardArrowRightIcon/></button>
    </div>
  )
}

export default Carousel;