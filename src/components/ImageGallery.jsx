import React from "react";
import "./ImageGallery.css";

export default function ImageGallery({ title, images, handleClick }) {
  return (
    <div className="gallery">
      <p className="gallery__title">{title}</p>
      <div className="gallery__content">
        {images?.length > 0 &&
          images.map((item, idx) => {
            return (
              <div
                onClick={() => handleClick(idx)}
                className="gallery__img-wrapper"
                key={item.title + idx.toString()}
              >
                <img src={item.media.m} alt="" />
              </div>
            );
          })}
      </div>
    </div>
  );
}
