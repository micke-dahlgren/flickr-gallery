import React from "react";

import "./ErrorMessage.css";
export default function ImageGallery({ error }) {
  if (error && error?.length > 0) {
    return <h2 className="error-message">{error}</h2>;
  }
  return null;
}
