import React from 'react'
import * as DOMPurify from 'dompurify';

import './carousel-item.styles.scss';
//@ts-ignore
const CarouselItem = ({imgUrl,title,subtitle,show}) => {
  const cleanedSub = DOMPurify.sanitize(subtitle,{ALLOWED_TAGS: ['strong']});
  
  return (
    <div className='carousel-item' style={{
      display: show ? 'flex' : 'none'
    }}>
      <img src={imgUrl} alt={title}/>
      <h3 >{title}</h3>
      <div dangerouslySetInnerHTML={{__html: cleanedSub}} />
    </div>
  )
}

export default CarouselItem