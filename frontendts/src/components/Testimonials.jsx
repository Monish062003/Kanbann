import React, { useEffect, useRef, useState } from "react";
import { videoList } from "../json/videoList";
import "../Css/testimonials.scss";

function Testimonials() {
  const [Videos, setVideos] = useState([]);

  useEffect(() => {
    let videoArray = [];
    videoList.slice(0, 3).map((video) => {
      videoArray.push(video);
    });
    setVideos(videoArray);
  }, [videoList]);

  function Left() {
    let videoArray = [...Videos];
    for (let index = 0; index < videoList.length; index++) {
      const element = videoList[index];
      if (element.title === Videos[Videos.length - 1].title) {
        videoArray.push(
          videoList[index + 1 > videoArray.length - 1 ? 0 : index + 1]
        );
        setVideos(videoArray.slice(1));
        break;
      }
    }
  }

  function Right() {
    let videoArray = [...Videos];
    for (let index = 0; index < videoList.length; index++) {
      const element = videoList[index];
      if (element.title === Videos[0].title) {
        videoArray.unshift(
          videoList[index - 1 < 0 ? videoList.length - 1 : index - 1]
        );
        setVideos(videoArray.splice(0, videoArray.length - 1));
        break;
      }
    }
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
