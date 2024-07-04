import React, { useState, useEffect } from 'react';
import './tinder_preference.css';
import TopBanner from "../../../components/banner";

// Import images for dislike and like icons
import dislikeIcon from '../../../components/Tinder_img_test/no.png';
import likeIcon from '../../../components/Tinder_img_test/yes.png';

const TinderPreference = () => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [animationClass, setAnimationClass] = useState('');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    fetch('/places.json')  // Path relative to the public directory
      .then((response) => response.json())
      .then((data) => setPlaces(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleDislike = () => {
    setAnimationClass('swipe-left');
    setTimeout(() => {
      setDislikes([...dislikes, places[currentIndex]]);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % places.length);
      setAnimationClass('');
      setClickCount(clickCount + 1);
    }, 500); // Match with animation duration
  };

  const handleLike = () => {
    setAnimationClass('swipe-right');
    setTimeout(() => {
      setLikes([...likes, places[currentIndex]]);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % places.length);
      setAnimationClass('');
      setClickCount(clickCount + 1);
    }, 500); // Match with animation duration
  };

  const handleExport = () => {
    const data = { likes, dislikes };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'preferences.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (places.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TopBanner />
      <div className="preference-container">
        <h2>Is this to your preference?</h2>
        <div className="preference-card">
          <div className="thumb-icon dislike" onClick={handleDislike}>
            <img src={dislikeIcon} alt="Dislike" />
            <span>Dislike</span>
          </div>
          <div className={`picture-placeholder ${animationClass}`}>
            <img 
              src={places[currentIndex].image_url} 
              alt={places[currentIndex].name} 
              onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/default-image.png'; }} // Add default image path
            />
          </div>
          <div className="place-info">
            <h3>{places[currentIndex].name}</h3>
            <p>{places[currentIndex].description}</p>
          </div>
          <div className="thumb-icon like" onClick={handleLike}>
            <img src={likeIcon} alt="Like" />
            <span>Like</span>
          </div>
        </div>
        <button 
          onClick={handleExport} 
          disabled={clickCount < 15} 
          className={clickCount < 15 ? 'button-disabled' : ''}
        >
          Next
        </button> 
      </div>
    </>
  );
};

export default TinderPreference;
