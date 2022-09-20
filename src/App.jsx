import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import fetchJsonp from "fetch-jsonp";

/* utility */
import { handleFlickrFeed, validFlickrFeed } from './utility/handleFlickrFeed';

/* components */
import { Container } from 'react-bootstrap';
import ImageGallery from './components/ImageGallery';
import SearchBar from "./components/SearchBar";
import SlideShow from "./components/SlideShow";
import Switch from './components/Switch'

/* hooks */
import { useInterval } from "./hooks/useInterval";

function App() {
  /* ---- STATES  ---- */
  /* short-polling */
  const pollIntervalMs = 10 * 1000;
  const pollIntervalSec = parseInt(pollIntervalMs / 1000)
  const [countdown, setCountdown] = useState(0)
  const [doPolling, setDoPolling] = useState(false);

  /* fetch*/
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /* data*/
  const [imageData, setImageData] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  /* component */
  const [playSlideShow, setPlaySlideShow] = useState(false);
  const [slideShowStartIdx, setSlideShowStartIdx] = useState(0);

  /* window */
  const [scrollPos, setScrollPos] = useState(0);


  /* ---- FETCH  ---- */
  /* jsonp to avoid CORS */
  const BASE_URL = `https://api.flickr.com/services/feeds/photos_public.gne`;
  const API_OPTIONS = '?lang=en-us&format=json'
  const fetchFromFlickr = fetchJsonp(`${BASE_URL + API_OPTIONS}&tags=${activeQuery}`, {
    jsonpCallback: 'jsoncallback',
    timeout: 3000
  });

  const resetDataStates = () => {
    setIsLoading(false);
    setImageData({});
    setTitle('');
  }
  
  async function fetchData() {
    setError('')
    setIsLoading(true);
    fetchFromFlickr.then(response => {
      if (response.ok) {
        return response.json()
      }
      return Promise.reject(response);
    }).then(data => {
      if (!validFlickrFeed(data)) {
        resetDataStates();
        throw 'Invalid data'
      }
      const feed = handleFlickrFeed(data.items, imageData);
      /* if feed === null then the request gave no new data, no need to re-render */
      if (feed !== null) {
        setImageData(feed);
        setTitle(feed.length === 0 ? `Could not find images for ${activeQuery}` : data?.title);
      }
      setIsLoading(false);
    })
      .catch(function (error) {
        console.log('Something went wrong.', error);
        setError('Something went wrong. ' + error)
      });
  }

  useEffect(() => {
    if (activeQuery && activeQuery.length > 0) {
      fetchData();
    }
  }, [activeQuery]);

  /* perform a random query on mount */
  useEffect(() => {
    const tags = ['mountains', 'hubble', 'kittens', 'dogs', 'nature', 'pattern', 'vintage car']
    const initQuery = tags[Math.floor(Math.random() * (tags.length))];
    setActiveQuery(initQuery)
  }, []);

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

        <SearchBar loading={isLoading} callback={handleSearchSubmit} />

        <p style={{ fontWeight: 'bold' }}>{title}</p>
        <ImageGallery images={imageData} handleClick={handleGalleryClick} />

        {playSlideShow && <SlideShow images={imageData} startAtIndex={slideShowStartIdx} handleClose={() => setPlaySlideShow(false)} />}

        {error.length > 0 &&
          <h2 style={{
            color: 'var(--bs-danger)',
            marginTop: '25vh',
            width: '100%',
            textAlign: 'center'
          }}>
            {error}
          </h2>
        }
      </Container>
    </div>
  )
}

export default App


