import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
/* data */
import {tags} from './data/searchQueries.json';
/* components */
import { Container } from "react-bootstrap";
import ImageGallery from "./components/ImageGallery";
import SearchBar from "./components/SearchBar";
import SlideShow from "./components/SlideShow";
import PollSwitch from "./components/PollSwitch";
import ErrorMessage from './components/ErrorMessage';

/* hooks */
import { useInterval } from "./hooks/useInterval";
/* services */
import fetchFlickr from "./services/flickrAPI";

function App() {
  /* ---- STATES  ---- */
  /* short-polling */
  const pollIntervalSec = 10;
  const [countdown, setCountdown] = useState(0);
  const [doPolling, setDoPolling] = useState(false);

  /* fetch */
  const [activeQuery, setActiveQuery] = useState("");
  const [data, setData] = useState("");

  /* component */
  const [playSlideShow, setPlaySlideShow] = useState(false);
  const [slideShowStartIdx, setSlideShowStartIdx] = useState(0);

  /* window */
  const [scrollPos, setScrollPos] = useState(0);


  /* ---- FETCH  ---- */
  async function fetchData() {
    const response = await fetchFlickr(activeQuery, data);
    setData(response);
  }

  /* perform a random query on mount */
  useEffect(() => {
    const initQuery = tags[Math.floor(Math.random() * tags.length)];
    setActiveQuery(initQuery);
  }, []);

  /* fetch when activeQuery changes */
  useEffect(() => {
    if (activeQuery && activeQuery.length > 0) {
      fetchData();
    }
  }, [activeQuery]);

  /* ---- SHORT-POLLING  ---- */
  /* set interval for short polling */
  useInterval(
    () => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        setCountdown(pollIntervalSec - 1);
      }
      countdown === 1 && fetchData();

    },
    playSlideShow || !doPolling ? null : 1000
  );

  /* ---- SCROLL POSITION FIX  ---- */
  useEffect(() => {
    if (playSlideShow) {
      setScrollPos(window.scrollY);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      document.body.classList.add("prevent-vertical-scroll");
    } else {
      window.scrollTo({
        top: scrollPos,
        left: 0,
        behavior: "instant",
      });
      document.body.classList.remove("prevent-vertical-scroll");
    }
  }, [playSlideShow]);

  /* ---- EVENT HANDLERS  ---- */
  const handleSearchSubmit = (e, value) => {
    e.preventDefault();
    setActiveQuery(value);
  };

  const handleGalleryClick = (index) => {
    setSlideShowStartIdx(index);
    setPlaySlideShow(true);
  };

  const handleSwitch = () => {
    setDoPolling((prevDoPolling) => !prevDoPolling);
    doPolling ? setCountdown(0) : setCountdown(pollIntervalSec - 1);
  };

  return (
    <div className="App">
      <Container className="pt-3">
        
        <PollSwitch checked={doPolling} callback={handleSwitch} countdown={countdown} />

        <SearchBar
          loading={data?.isLoading || false}
          callback={handleSearchSubmit}
        />

        
        <ImageGallery title={data?.title} images={data?.items} handleClick={handleGalleryClick} />

        {playSlideShow && <SlideShow
          images={data?.items}
          startAtIndex={slideShowStartIdx}
          handleClose={() => setPlaySlideShow(false)}
        /> }

        <ErrorMessage error={data?.error} />
      </Container>
    </div>
  );
}

export default App;
