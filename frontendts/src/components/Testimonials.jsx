import React from 'react'
import "../Css/testimonials.scss"

function Testimonials() {
  const videos = [
    { id: 1, src: 'video1.mp4', title: 'Video 1' },
    { id: 2, src: 'video2.mp4', title: 'Video 2' },
    { id: 3, src: 'video3.mp4', title: 'Video 3' },
  ];
  return (
    <div className='testimonials-section'>
      <h1>what our clients say</h1>
      <p>Discover what our clients say about the transformative power of EnfiQ's digital solutions.</p>
      <div className="video-section">
      <button className="nav-buttons">Left</button>
      <div className="videopanel">
        <div className="videoframe"></div>
        <div className="mainframe"></div>
        <div className="videoframe"></div>
      </div>
      <button className="nav-buttons">Right</button>
      </div>
    </div>
  )
}

export default Testimonials