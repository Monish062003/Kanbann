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
      fromValue: 20,
      fromSign: "-",
      toValue: 40,
      toSign: "-",
    },
    {
      fromValue: 20,
      fromSign: "-",
      toValue: 40,
      toSign: "-",
    },
    {
      fromValue: 20,
      fromSign: "-",
      toValue: 40,
      toSign: "-",
    },
  ]);

  let animationClass = `
  @keyframes panelanimation {
    from {
      position:relative;
      left:${animator[0].fromSign}${animator[0].fromValue}vw;
    }
    to {
      position:relative;
      left:${animator[0].toSign}${animator[0].toValue}vw;
    }
  }

  .animate-panel {
    animation: panelanimation 1s ease-in-out forwards;
    position:relative;
    left:${animator[0].toSign}${animator[0].toValue}vw;
  }
`;

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

  function Left() {
    let videoArray = [...Videos];
    const classAnimations = ["animateright", "animatemiddle", "animateleft"];
    const video_elements = document.getElementsByClassName("panel-item");
    classAnimations.map((classname, index) => {
      if (!video_elements[index].classList[1]) {
        video_elements[index].classList.remove("animate-panel");
        switch (index) {
          case 0:
            setAnimator((prevAnimator) => [
              {
                ...prevAnimator[0],
                fromValue: 0,
                fromSign: "",
                toValue: 20,
                toSign: "-",
              },
              ...prevAnimator.slice(1),
            ]);

            break;
          case 1:
            // setAnimator((prevAnimator) => [
            //   {
            //     ...prevAnimator[0],
            //     fromValue: newFromValue,
            //     fromSign: newFromSign,
            //     toValue: newToValue,
            //     toSign: newToSign,
            //   },
            //   ...prevAnimator.slice(1),
            // ]);

            console.log(animationClass);

            break;
          case 2:
            break;
        }
        video_elements[index].classList.add("animate-panel");
        const styleSheet = document.createElement("style");
        styleSheet.innerHTML = animationClass;
        document.head.appendChild(styleSheet);
      }
    });
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
