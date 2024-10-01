/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import React, { useEffect, useState } from "react";
import { videoList } from "../json/videoList";
import "../Css/testimonials.scss";
import leftButton from "../Images/left_button.png";
import rightButton from "../Images/right_button.png";

function Testimonials() {
  const [Videos, setVideos] = useState([]);
  const [videoIterator, setIterator] = useState(0);
  const [animator, setAnimator] = useState([
    {
      fromValue: 0,
      fromSign: "",
      toValue: 0,
      toSign: "",
    },
    {
      fromValue: 0,
      fromSign: "",
      toValue: 0,
      toSign: "",
    },
    {
      fromValue: 0,
      fromSign: "",
      toValue: 0,
      toSign: "",
    },
  ]);

  useEffect(() => {
    let videoArray = [];
    videoList.slice(0, 3).map((video, index) => {
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

  useEffect(() => {
    console.log(videoIterator);
  }, [videoIterator]);

  useEffect(() => {
    const videoElements = document.getElementsByClassName("panel-item");
    console.log(animator);
    animator.forEach((values, index) => {
      const animationId = `panelanimation-${index}-${Date.now()}`;
      videoElements[index]?.classList.remove("animate-panel");

      const oldStyle = document.getElementById(animationId);
      if (oldStyle) {
        oldStyle.remove();
      }

      const animationClass = `
        @keyframes ${animationId} {
          from {
            position: relative;
            left: ${values.fromSign}${values.fromValue}vw;
          }
          to {
            position: relative;
            left: ${values.toSign}${values.toValue}vw;
          }
        }
  
        .animate-panel-${index} {
          animation: ${animationId} 1s ease-in-out forwards;
          position: relative;
          left: ${values.toSign}${values.toValue}vw;
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.id = animationId; // Set an ID to remove it later
      styleSheet.innerHTML = animationClass;
      document.head.appendChild(styleSheet);

      void videoElements[index]?.offsetWidth;

      videoElements[index]?.classList.add(`animate-panel-${index}`);
    });
  }, [animator]);

  function Left() {
    setAnimator((prevAnimator) =>
      prevAnimator.map((anim, i) => {
        switch (i) {
          case 0:
            return {
              ...anim,
              fromValue: anim.toValue,
              fromSign: `${anim.toSign}`,
              toValue: anim.toValue === 40 ? 20 : anim.toValue === 20 ? 0 : 40,
              toSign: ``,
            };

          case 1:
            return {
              ...anim,
              fromValue: anim.toValue,
              fromSign: `${anim.toSign}`,
              toValue: anim.toValue === 0 ? 20 : anim.toSign === "" ? 0 : 20,
              toSign: anim.toValue === 0 ? "-" : "",
            };

          case 2:
            return {
              ...anim,
              fromValue: anim.toValue,
              fromSign: `${anim.toSign}`,
              toValue: anim.toValue === 40 ? 0 : anim.toValue === 20 ? 40 : 20,
              toSign: anim.toValue === 0 ? "-" : anim.toSign === "-" ? "-" : "",
            };
        }
      })
    );
    setIterator(1 + videoIterator >= animator.length ? 0 : 1 + videoIterator);
  }

  function Right() {
    setAnimator((prevAnimator) =>
      prevAnimator.map((anim, i) => {
        switch (i) {
          case 0:
            return {
              ...anim,
              fromValue: anim.toValue,
              fromSign: `${anim.toSign}`,
              toValue: anim.toValue === 0 ? 20 : anim.toValue === 20 ? 40 : 0,
              toSign: ``,
            };

          case 1:
            return {
              ...anim,
              fromValue: anim.toValue,
              fromSign: `${anim.toSign}`,
              toValue: anim.toValue === 0 ? 20 : anim.toSign === "-" ? 0 : 20,
              toSign: anim.toValue === 0 ? "" : anim.toSign === "-" ? "" : "-",
            };

          case 2:
            return {
              ...anim,
              fromValue: anim.toValue,
              fromSign: `${anim.toSign}`,
              toValue: anim.toValue === 20 ? 0 : anim.toValue === 0 ? 40 : 20,
              toSign: anim.toValue === 0 ? "-" : anim.toSign === "-" ? "-" : "",
            };
        }
      })
    );

    setIterator(
      videoIterator - 1 < 0 ? animator.length - 1 : videoIterator - 1
    );
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
          {Videos.map((video, index) => (
            <video
              key={video.id}
              className="panel-item"
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

// // const video_elements =
// //   document.getElementsByClassName("videopanel")[0].children;
// // for (let index = 0; index < video_elements.length; index++) {
// //   switch (index) {
// //     case 0:
// //       video_elements[videoIterator].classList.add("animateleft");
// //       break;

// //     default:
// //       break;
// //   }
// // }
// for (let index = 0; index < videoList.length; index++) {
//   const element = videoList[index];
//   if (element.title === Videos[Videos.length - 1].title) {
//     videoArray.push(
//       videoList[index + 1 > videoArray.length - 1 ? 0 : index + 1]
//     );
//     setVideos(videoArray.slice(1));
//     break;
//   }
// }
// setIterator(1 + videoIterator >= videoArray.length ? 0 : 1 + videoIterator);
