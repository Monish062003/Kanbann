/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import React, { useEffect, useRef, useState } from "react";
import { videoList } from "../json/videoList";
import "../Css/testimonials.scss";
import leftButton from "../Images/left_button.png";
import rightButton from "../Images/right_button.png";

function Testimonials() {
  const [Videos, setVideos] = useState([]);
  const [videoIterator, setIteration] = useState(0);
  let[nelementWidth,nelementPosition,oelementWidth,oelementPosition]=""
  const framewidth = window.innerWidth < 768
  let keyframes=` @keyframes animation {
    from {
      width:${oelementWidth}vw
      position: relative;
      left:${oelementPosition}vw
      }
    to {
      width:${nelementWidth}vw;
      position: relative;
      left: ${nelementPosition}vw;
    }
  }`

  useEffect(() => {
    let videoArray = [];
    videoList.slice(0, 3).map((video,index) => {
      switch (index) {
        case 0:
          video.className =
            (window.innerWidth < 768 ? "leftpanel " : "") +
            "videoframe zligning";
          break;

        case 1:
          video.className = "mainframe";
          break;

        case 2:
          video.className =
            (window.innerWidth < 768 ? "rightpanel " : "") +
            "videoframe zligning ";
          break;
      }
      videoArray.push(video);
    });
    setVideos(videoArray);
  }, [videoList]);


    function Left() {
      let videoArray = [...Videos];
      const videoElements = document.getElementsByClassName("videopanel")[0].childNodes;
      const middleIteration = 1+videoIterator>=videoArray.length?0:1+videoIterator
      const lastIteration = 1+middleIteration>=videoArray.length?0:1+middleIteration
      for (let index = 0; index < videoList.length; index++) {
        const element = videoList[index];
        if (element.title === Videos[videoIterator - 1 < 0?videoArray.length-1:videoIterator-1].title) {
          videoArray[videoIterator]=videoList[index + 1 >= videoList.length ? 0 : index + 1] 
          // videoArray[middleIteration].className = (window.innerWidth < 768 ? "leftpanel " : "") + "videoframe animatemiddle";
          videoArray[videoIterator].className = (window.innerWidth < 768 ? "leftpanel " : "") + "videoframe zligning animateleft";
          videoArray[lastIteration].className = (window.innerWidth < 768 ? "leftpanel " : "") + "mainframe animatemiddle";

          break;
        }
      }
      setIteration(middleIteration)
      setVideos(videoArray)
    }

    function Right() {
      let videoArray = [...Videos];
      // setIterator(videoIterator-1) 
      const video_elements = document.getElementsByClassName("videopanel")[0].childNodes;
      // video_elements.forEach((element, index) => {
      //   switch (index) {
      //     case 0:
            
      //       break;
      //       case 1:
            
      //       break;
      //       case 2:
      //         element.classList.add("animateright");
      //         break;
      //   }
      // });
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
      --videoIterator
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
          {Videos.map((video, index) =>(
              <video
                key={video.id}
                className={video.className}
                controls={index === 1}
                src={video.src}
                title={video.title}
              ></video>
            ))}
        </div>
        <button className="nav-buttons" onClick={Right}>
          <img src={rightButton} alt="right_nav" />
        </button>
      </div>
    </div>
  );
}

export default Testimonials;
