import React from "react";
import  "./AutoUploadImage.css";

function AutoUploadImage(props) {
  return (
    <div style={{ position: "relative" }}>
      <div className="overlay" style={{opacity: props.uploading ? 1: 0}}>
        <div className="d-flex justify-content-center h-100">
          {" "}
          <div className="spinner-border text-light m-auto" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <img
        className="img-thumbnail"
        src={props.newImage}
        alt="hoax-attachemnt"
      />
    </div>
  );
}

export default AutoUploadImage;
