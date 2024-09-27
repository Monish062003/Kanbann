import React, { useEffect, useRef, useState } from "react";
import { videoList } from "../json/videoList";
import "../Css/testimonials.scss";
import leftButton from "../Images/left_button.png";
import rightButton from "../Images/right_button.png";

function Testimonials() {
  const [Videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    let videoArray = [];
    videoList.slice(0, 3).map((video) => {
      videoArray.push(video);
    });
    setVideos(videoArray);
  }, [videoList]);

  useEffect(() => {
    videoRefs.current = videoRefs.current
      .slice(0, Videos.length)
      .map((_, i) => videoRefs.current[i] || React.createRef());
  }, [Videos.length]);

  function Left() {
    let videoArray = [...Videos];
    const video_elements = videoRefs.current;
    video_elements.forEach((element, index) => {
      element.classList.add("animateleft");
    });
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
    const video_elements = videoRefs.current;
    video_elements.forEach((element, index) => {
      if (element) {
        element.classList.add("animateright");
        console.log(element);
      }
    });
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
          <img src={leftButton} alt="left_nav" />
        </button>
        <div className="videopanel">
          {Videos.map((video, index) => {
            let animations = "";
            switch (index) {
              case 0:
                animations =
                  (window.innerWidth < 768 ? "leftpanel " : "") +
                  "videoframe zligning";
                break;

              case 1:
                animations = "mainframe";
                break;

              case 2:
                animations =
                  (window.innerWidth < 768 ? "rightpanel " : "") +
                  "videoframe zligning ";
                break;
            }
            return (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                key={video.id}
                className={animations}
                controls={index === 1}
                src={video.src}
                title={video.title}
              ></video>
            );
          })}
        </div>
        <button className="nav-buttons" onClick={Right}>
          <img src={rightButton} alt="right_nav" />
        </button>
      </div>
    </div>
  );
}

export default Testimonials;
