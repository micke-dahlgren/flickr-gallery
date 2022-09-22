import React from "react";

import "./ImageGallery.css";
export default function ImageGallery({ images, handleClick }) {
  return (
    <div className="gallery">
      {images?.length > 0 &&
        images.map((item, idx) => {
          return (
            <div
              onClick={() => handleClick(idx)}
              className="img-wrapper"
              style={{ cursor: "pointer" }}
              key={item.title + idx.toString()}
            >
              <img src={item.media.m} alt="" />
            </div>
          );
        })}
    </div>
  );
}
