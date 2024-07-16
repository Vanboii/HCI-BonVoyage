// import React, { useState, useEffect, useRef } from 'react';
// import './loadingPage.css';
// import TopBanner from "../../../components/banner";
// import travelerImage from '../../../components/traveler.png';

// const LoadingPage = () => {
//   const [progress, setProgress] = useState(0); // Initial progress value
//   const [isComplete, setIsComplete] = useState(false); // Track completion

//   // Function to start the progress bar animation
//   const startProgress = (duration) => {
//     let start = null;
//     const step = (timestamp) => {
//       if (!start) start = timestamp;
//       const progress = Math.min((timestamp - start) / duration, 1);
//       setProgress(progress * 100);
//       if (progress < 1) {
//         requestAnimationFrame(step);
//       } else {
//         setIsComplete(true); // Set completion to true when progress is 100%
//       }
//     };
//     requestAnimationFrame(step);
//   };


//   // Example to start the progress animation on component mount
//   useEffect(() => {
//     const duration = 10000; // Duration in milliseconds (10 seconds)
//     startProgress(duration);
//   }, []);
//   // Stop animation when progress reaches 75%
// useEffect(() => {
//   if (progress >= 100) {
//     setIsComplete(true);
//   }
// }, [progress]);


//   return (
//     <>
//     <TopBanner/>
//     <div className="loading-container">
//     <h1>Generating Your Itinerary<span className={`dots ${isComplete ? 'complete' : ''}`}>.</span></h1>
//       <div className="progress-container">
//         <div className="progress-bar">
//           <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
//         </div>
//         <img src={travelerImage} alt="Traveler" className="traveler" style={{ left: `calc(${progress}% - 100px)` }} />
//       </div>
//     </div>
//     </>
//   );
// };

// export default LoadingPage;

//celest new code to link loading page to results page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './loadingPage.css';
import TopBanner from "../../../components/banner";
import travelerImage from '../../../components/traveler.png';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0); // Initial progress value
  const [isComplete, setIsComplete] = useState(false); // Track completion
  const navigate = useNavigate(); // Initialize navigate

  // Function to start the progress bar animation
  const startProgress = (duration) => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setProgress(progress * 100);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsComplete(true); // Set completion to true when progress is 100%
      }
    };
    requestAnimationFrame(step);
  };

  // Start the progress animation on component mount
  useEffect(() => {
    const duration = 10000; // Duration in milliseconds (10 seconds)
    startProgress(duration);
  }, []);

  // Navigate to results page when progress reaches 100%
  useEffect(() => {
    if (isComplete) {
      navigate('/results'); // Navigate to the results page
    }
  }, [isComplete, navigate]);

  return (
    <>
      <TopBanner showAlertOnNavigate={true} />
      <div className="loading-container">
        <h1>Generating Your Itinerary<span className={`dots ${isComplete ? 'complete' : ''}`}>.</span></h1>
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
