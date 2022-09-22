import fetchJsonp from "fetch-jsonp";
import { handleFlickrFeed, validFlickrFeed } from "../utility/handleFlickrFeed";

export default async function fetchFlickr(query, prevData) {
  /* jsonp to avoid CORS */

  const BASE_URL = `https://api.flickr.com/services/feeds/photos_public.gne`;
  const API_OPTIONS = "?lang=en-us&format=json";
  const fetchFromFlickr = fetchJsonp(
    `${BASE_URL + API_OPTIONS}&tags=${query}`,
    {
      jsonpCallback: "jsoncallback",
      timeout: 3000,
    }
  );

  const data = {
    error: "",
    isLoading: true,
    items: prevData?.items || [],
    title: "",
  };

  const payload = await fetchFromFlickr
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((res) => {
      if (!validFlickrFeed(res)) {
        throw "Invalid data";
      }

      const feed = handleFlickrFeed(res.items, data.items);
      /* if feed === null then the request gave no new data, no need to re-render */
      if (feed !== null) {
        data.items = feed;
        data.title =
          feed.length === 0 ? `Could not find images for ${query}` : res?.title;
      }
      data.isLoading = false;
      return data;
    })
    .catch(function (error) {
      console.log("Something went wrong.", error);
      data.isLoading = false;
      data.error = "Something went wrong. " + error;
      return data;
    });

  return payload;
}
