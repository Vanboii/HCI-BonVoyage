import React, { useState, useEffect } from 'react';
import './tinder_preference.css';
import TopBanner from "../../../components/banner";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import dislikeIcon from '../../../components/Tinder_img_test/no.png';
import likeIcon from '../../../components/Tinder_img_test/yes.png';
import { useItineraries } from '../../../test/useGetItineraries';
import { auth } from '../../../firebase';


// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const TinderPreference = () => {
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [animationClass, setAnimationClass] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const {  updatePreferences  } = useItineraries();
  const User = auth.currentUser

  useEffect(() => {
    if (location.state && location.state.recommendations) {
      console.log('Recommendations received:', location.state.recommendations);
      const shuffledPlaces = shuffleArray(location.state.recommendations); // Shuffle the recommendations
      setPlaces(shuffledPlaces); // Set the shuffled array
      setCurrentIndex(0); // Reset currentIndex when new recommendations are fetched
    } else {
      // Handle case where recommendations are not passed
      console.error('No recommendations found in location state.');
      //FOR DUMMY DATA REMOVE WHEN AI IS FIXED
      fetch('/places.json')
        .then((response) => response.json())
        .then((data) => {
          console.log('Using local places data:', data);
          const shuffledPlaces = shuffleArray(data);
          setPlaces(shuffledPlaces);
          setCurrentIndex(0);
        })
    }
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleDislike();
      } else if (event.key === 'ArrowRight') {
        handleLike();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [places, currentIndex]);

  const handleDislike = () => {
    if (places.length > 0 && currentIndex < places.length) {
      setAnimationClass('swipe-left');
      setTimeout(() => {
        setDislikes([...dislikes, places[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setAnimationClass('');
        setClickCount(clickCount + 1);
      }, 500);
    }
  };

  const handleLike = () => {
    if (places.length > 0 && currentIndex < places.length) {
      setAnimationClass('swipe-right');
      setTimeout(() => {
        setLikes([...likes, places[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setAnimationClass('');
        setClickCount(clickCount + 1);
      }, 500);
    }
  };

  const handleNext = () => {

//^^^^^^^^^^^^^^^^^^^^^^^^^
  updatePreferences(id, User.uid, {likes: likes, dislikes: dislikes})

    navigate(`/waitingroom/${id}`); // Adjust the path to the Preferences page
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (places.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TopBanner showAlertOnNavigate={true} />
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Instructions</h2>
            <p>On your keyboard</p>
            <p>PRESS LEFT = DISLIKE   and   PRESS RIGHT = LIKE</p>
            <p>You need to make at least 5 choices to proceed to the next step.</p>
            <button onClick={closeModal}>Got it!</button>
          </div>
        </div>
      )}
      <div className="preference-container">
        <h2 style={{ color: "black" }}>Is this to your preference?</h2>
        <div className="preference-card">
          <div className="thumb-icon dislike" onClick={handleDislike}>
            <img src={dislikeIcon} alt="Dislike" />
            <span>Dislike</span>
          </div>
          {currentIndex < places.length ? (
            <div className={`picture-placeholder ${animationClass}`}>
              <img
                src={places[currentIndex].image_url[0]} // Assuming image_url is an array of URLs
                alt={places[currentIndex].location}
                onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/default-image.png'; }}
              />
            </div>
          ) : (
            <div className="no-more-images">
              <h3>No more images to show</h3>
            </div>
          )}
          <div className="place-info">
            {currentIndex < places.length && (
              <>
                <h3>{places[currentIndex].location}</h3>
                <p>{places[currentIndex].description}</p>
              </>
            )}
          </div>
          <div className="thumb-icon like" onClick={handleLike}>
            <img src={likeIcon} alt="Like" />
            <span>Like</span>
          </div>
        </div>
        <button
          onClick={handleNext}
          disabled={clickCount < 5}
          className={`${clickCount < 5 ? 'button-disabled' : ''}`}>
          Next
        </button>
      </div>
    </>
  );
};

export default TinderPreference;


