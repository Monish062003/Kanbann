import React, { useEffect, useRef, useState } from "react";
import { videoList } from "../json/videoList";
import "../Css/testimonials.scss";

function Testimonials() {
  const [frame1, frame2, frame3] = [useRef(), useRef(), useRef()];
  const [Videos, setVideos] = useState([]);

  useEffect(() => {
    let videoArray = [];
    videoList.slice(0, 3).map((video) => {
      videoArray.push(video);
    });
    setVideos(videoArray);
  }, [videoList]);

  function Left() {
    let firstVideo = Videos[0].title;
    let videoArray = [];
    let targetedIndex = -1;

    for (let index = 0; index < videoList.length; index++) {
      const element = videoList[index];
      if (element.title === firstVideo) {
        targetedIndex = index + 1;
        break;
      }
    }
    while (videoArray.length < 3) {
      if (targetedIndex >= videoList.length) {
        targetedIndex = 0;
      }

      videoArray.push(videoList[targetedIndex]);
      targetedIndex++;
    }

    setVideos(videoArray);
  }

  function Right() {
    let firstVideo = Videos[2].title;
    let videoArray = [];
    let targetedIndex = -1;

    for (let index = 0; index < videoList.length; index++) {
      const element = videoList[index];
      if (element.title === firstVideo) {
        targetedIndex = index;
        break;
      }
    }
    while (videoArray.length < 3) {
      if (targetedIndex < 0) {
        targetedIndex = videoList.length - 1;
      }
      videoArray.push(videoList[targetedIndex]);
      targetedIndex--;
    }
    console.log(videoArray);
    let newVideoArray = [];
    for (let index = videoArray.length - 1; index > -1; index--) {
      console.log(index);
      newVideoArray.push(videoArray[index]);
    }
    setVideos(videoArray);
  }
  return (
    <div className="testimonials-section">
      <h1>what our clients say</h1>
      <p>
        Discover what our clients say about the transformative power of EnfiQ's
        digital solutions.
      </p>
      <div className="video-section">
        <button className="nav-buttons" onClick={Left}>
          Left
        </button>
        <div className="videopanel">
          {Videos.map((video) => (
            <video
              key={video.id}
              className="videoframe"
              src={video.src}
              title={video.title}
              controls
            ></video>
          ))}
        </div>
        <button className="nav-buttons" onClick={Right}>
          Right
        </button>
      </div>
    </div>
  );
}

export default Testimonials;
