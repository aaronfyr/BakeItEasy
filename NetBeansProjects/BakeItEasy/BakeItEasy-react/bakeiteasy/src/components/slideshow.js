import React from "react";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";

export const Slideshow = ({ imagePaths }) => {
  return (
    <div className="sliderContainer">
      <Slider>
        {imagePaths.map((path) => (
          <div
            key="index"
            style={{
              background: `url('${path}') no-repeat center center`,
              height: "400px",
              width: "100%",
              borderRadius: "15px",
              marginTop: "0px",
              marginBotton: "auto",
            }}
          ></div>
        ))}
      </Slider>
    </div>
  );
};
