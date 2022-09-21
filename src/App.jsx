import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/* components */
import { Container } from 'react-bootstrap';
import ImageGallery from './components/ImageGallery';
import SearchBar from "./components/SearchBar";
import SlideShow from "./components/SlideShow";
import Switch from './components/Switch'

/* hooks */
import { useInterval } from "./hooks/useInterval";
/* services */
import fetchFlickr from './services/flickrAPI';

function App() {
  /* ---- STATES  ---- */
  /* short-polling */
  const pollIntervalMs = 10 * 1000;
  const pollIntervalSec = parseInt(pollIntervalMs / 1000)
  const [countdown, setCountdown] = useState(0)
  const [doPolling, setDoPolling] = useState(false);

  /* fetch */
  const [activeQuery, setActiveQuery] = useState('');
  const [data, setData] = useState('');

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
    const tags = ['mountains', 'hubble', 'kittens', 'dogs', 'nature', 'pattern', 'vintage car', 'flowers'];
    const initQuery = tags[Math.floor(Math.random() * (tags.length))];
    setActiveQuery(initQuery)
  }, []);

  /* fetch when activeQuery changes */
  useEffect(() => {
    if (activeQuery && activeQuery.length > 0) {
      fetchData();
    }
  }, [activeQuery]);


  /* ---- SHORT-POLLING  ---- */
  /* Set interval for short-polling */
  useInterval(() => {
    fetchData();
  }, (playSlideShow || !doPolling) ? null : pollIntervalMs)

  /* set interval for countdown til next poll */
  useInterval(() => {
    if (countdown > 0) {
      setCountdown(prevCountdown => prevCountdown - 1)
    }
    if (countdown <= 0) {
      setCountdown(pollIntervalSec-1)
    }
  }, (playSlideShow || !doPolling) ? null : 1000)


  /* ---- SCROLL POSITION FIX  ---- */
  useEffect(() => {
    if (playSlideShow) {
      setScrollPos(window.scrollY);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      document.body.classList.add("prevent-vertical-scroll")
    } else {
      window.scrollTo({
        top: scrollPos,
        left: 0,
        behavior: 'instant'
      });
      document.body.classList.remove("prevent-vertical-scroll");
    }
  }, [playSlideShow])
  
  /* ---- EVENT HANDLERS  ---- */
  const handleSearchSubmit = (e, value) => {
    e.preventDefault();
    setActiveQuery(value);
  }

  const handleGalleryClick = (index) => {
    setSlideShowStartIdx(index);
    setPlaySlideShow(true);
  }

  const handleSwitch = () => {
    setDoPolling(prevDoPolling => !prevDoPolling)
    doPolling ? setCountdown(0) : setCountdown(pollIntervalSec-1);
  }
  return (
    <div className="App">
      <Container className="pt-3">
        <div className="d-flex pb-2">
          <Switch checked={doPolling} callback={handleSwitch} />
          {countdown > 0 && <p style={{ margin:0, padding:0, marginLeft: '0.25rem', }}>({countdown})</p>}
        </div>

        <SearchBar loading={data?.isLoading || false} callback={handleSearchSubmit} />

        <p style={{ fontWeight: 'bold' }}>{data?.title}</p>
        <ImageGallery images={data?.items} handleClick={handleGalleryClick} />

        {playSlideShow && <SlideShow images={data?.items} startAtIndex={slideShowStartIdx} handleClose={() => setPlaySlideShow(false)} />}

        {data?.error?.length > 0 &&
          <h2 style={{
            color: 'var(--bs-danger)',
            marginTop: '25vh',
            width: '100%',
            textAlign: 'center'
          }}>
            {data?.error}
          </h2>
        }
      </Container>
    </div>
  )
}

export default App


