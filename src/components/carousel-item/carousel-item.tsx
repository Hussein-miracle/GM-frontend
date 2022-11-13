import React from 'react'
import './carousel-item.styles.scss';
//@ts-ignore
const CarouselItem = ({imgUrl,title,subtitle,show}) => {
  return (
    <div className='carousel-item' style={{
      display: show ? 'flex' : 'none'
    }}>
      <img src={imgUrl} alt={title}/>
      <h3>{title}</h3>
      <div>{subtitle}</div>
    </div>
  )
}

export default CarouselItem