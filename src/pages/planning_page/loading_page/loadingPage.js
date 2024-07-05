import React, { useState, useEffect, useRef } from 'react';
import './loadingPage.css';
import TopBanner from "../../../components/banner";
import travelerImage from '../../../components/traveler.png';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0); // Initial progress value
  const progressRef = useRef(null);

  // Function to start the progress bar animation
  const startProgress = (duration) => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setProgress(progress * 100);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Example to start the progress animation on component mount
  useEffect(() => {
    const duration = 10000; // Duration in milliseconds (10 seconds)
    startProgress(duration);
  }, []);

  return (
    <>
    <TopBanner/>
    <div className="loading-container">
      <h1>Generating Your Itinerary...</h1>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
        </div>
        <img src={travelerImage} alt="Traveler" className="traveler" style={{ left: `calc(${progress}% - 100px)` }} />
      </div>
    </div>
    </>
  );
};

export default LoadingPage;

