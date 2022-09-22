import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { useInterval } from "../hooks/useInterval";
import "./SlideShow.css";

export default function SlideShow({ images, handleClose, startAtIndex }) {
  const [imgIndex, setImgIndex] = useState(0);
  const slideShowSpeedSec = 8; 
  const slideShowSpeedMs = slideShowSpeedSec * 1000; 
  const [countdown, setCountdown] = useState(0);
  const scrollContainerRef = useRef();
  const thumbnailRef = useRef();

  const spinnerSvg = () => {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.41 7L12.71 2.71C12.8983 2.5217 13.0041 2.2663 13.0041 2C13.0041 1.7337 12.8983 1.4783 12.71 1.29C12.5217 1.1017 12.2663 0.995909 12 0.995909C11.7337 0.995909 11.4783 1.1017 11.29 1.29L7 5.59L2.71 1.29C2.5217 1.1017 2.2663 0.995909 2 0.995909C1.7337 0.995909 1.4783 1.1017 1.29 1.29C1.1017 1.4783 0.995908 1.7337 0.995908 2C0.995908 2.2663 1.1017 2.5217 1.29 2.71L5.59 7L1.29 11.29C1.19627 11.383 1.12188 11.4936 1.07111 11.6154C1.02034 11.7373 0.994202 11.868 0.994202 12C0.994202 12.132 1.02034 12.2627 1.07111 12.3846C1.12188 12.5064 1.19627 12.617 1.29 12.71C1.38296 12.8037 1.49356 12.8781 1.61542 12.9289C1.73728 12.9797 1.86799 13.0058 2 13.0058C2.13201 13.0058 2.26272 12.9797 2.38458 12.9289C2.50644 12.8781 2.61704 12.8037 2.71 12.71L7 8.41L11.29 12.71C11.383 12.8037 11.4936 12.8781 11.6154 12.9289C11.7373 12.9797 11.868 13.0058 12 13.0058C12.132 13.0058 12.2627 12.9797 12.3846 12.9289C12.5064 12.8781 12.617 12.8037 12.71 12.71C12.8037 12.617 12.8781 12.5064 12.9289 12.3846C12.9797 12.2627 13.0058 12.132 13.0058 12C13.0058 11.868 12.9797 11.7373 12.9289 11.6154C12.8781 11.4936 12.8037 11.383 12.71 11.29L8.41 7Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  const loadbarStyles = {
    background: "var(--bs-primary)",
    height: "4px",
    width: (countdown/slideShowSpeedSec) * 120 + "vw",
    maxWidth: "100vw",
    transition: countdown === 0 ? "none" : "width " + 1000 + "ms linear",
  };

  const autoPlay = () => {
    if (images.length - 1 <= imgIndex) {
      // loop around and scroll into view
      setImgIndex(0);
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      setImgIndex((prevImgIndex) => prevImgIndex + 1);
      const scrollOptions = {
        inline: "start",
        block: "end",
        behavior: "smooth",
      };
      if (window.innerHeight <= window.innerWidth) {
        scrollOptions.inline = "center";
      }
      thumbnailRef.current.scrollIntoView(scrollOptions);
    }
  };

  // play carouselle
  useEffect(() => {
		setCountdown(0);
    const interval = setInterval(() => {
      autoPlay();
    }, slideShowSpeedMs);
    return () => clearInterval(interval);
  }, [imgIndex, images]);

  useEffect(() => {
    setImgIndex(startAtIndex);
    setCountdown(0);
  }, [startAtIndex]);

  // countdown for loading bar
  useInterval(() => {
    setCountdown((prevCountdown) => prevCountdown + 1);
  }, 1000);

  return (
    <>
      <div onClick={handleClose} className="slide-container">
        <Button variant="secondary" className="close-btn">
          {spinnerSvg()}
        </Button>
        <div className="displayed-image">
          {images.length > 0 && (
            <img
              src={images[imgIndex]?.media?.m}
              onClick={(e) => {
                e.stopPropagation();
              }}
              alt=""
            />
          )}
        </div>
        <div style={loadbarStyles}></div>
        <div ref={scrollContainerRef} className="thumbnail-scrollable-row">
          {images.map((item, idx) => {
            return (
              <div
                ref={idx === imgIndex ? thumbnailRef : null}
                id={idx}
                className={
                  parseInt(idx) === imgIndex
                    ? "img-thumb selected"
                    : "img-thumb"
                }
                key={item.title + idx.toString()}
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex(idx);
                  setCountdown(0);
                }}
              >
                <img src={item?.media?.m} alt="" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
