import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CarouselItem from "../carousel-item/carousel-item";

import { CarouselData } from "../../utils/constants";

import "./carousel.styles.scss";

const Carousel = () => {
  const [index, setIndex] = useState(0);

  const clickRight = () => {
    setIndex((prev) => {
      // console.log(prev, "p");
      return prev + 1;
    });
    // console.log(index);
  };

  const clickLeft = () => {
    setIndex((prev) => {
      return prev - 1;
    });
    // console.log(index);
  };
  return (
    <div className="carousel">
      <button
        onClick={clickLeft}
        className="carousel__btn left"
        disabled={index === 0 ? true : false}
      >
        <KeyboardArrowLeftIcon />
      </button>
      <main className="carousel__main">
        {CarouselData.map(({ imgUrl, title, subtitle, id }, currIndex) => {
          return (
            <CarouselItem
              key={id}
              imgUrl={imgUrl}
              title={title}
              subtitle={subtitle}
              show={currIndex === index}
            />
          );
        })}

        {/* <CarouselItem /> */}
      </main>
      <button
        className="carousel__btn right"
        onClick={clickRight}
        disabled={index === 2 ? true : false}
      >
        <KeyboardArrowRightIcon />
      </button>
    </div>
  );
};

export default Carousel;
