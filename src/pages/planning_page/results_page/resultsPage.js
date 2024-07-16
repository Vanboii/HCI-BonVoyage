import React, { useState, useEffect } from 'react';
import TopBanner from '../../../components/banner';
import './resultsPage.css';

const ResultsPage = () => {
  const initialItinerary = [
    {
      day: 'Day 1: Visit Gyeongbokgung Palace and explore Bukchon Hanok Village.',
      activities: ['Gyeongbokgung Palace', 'Bukchon Hanok Village', 'Insadong']
    },
    {
      day: 'Day 2: Enjoy shopping at Myeongdong and visit N Seoul Tower.',
      activities: ['Myeongdong Shopping Street', 'N Seoul Tower', 'Cheonggyecheon Stream']
    },
    {
      day: 'Day 3: Take a tour of the DMZ and learn about Korean history.',
      activities: ['DMZ Tour', 'War Memorial of Korea', 'Hongdae']
    },
    {
      day: 'Day 4: Relax at a traditional Korean spa and visit Lotte World.',
      activities: ['Lotte World', 'Seoul City Hall', 'Gangnam District']
    },
    {
      day: 'Day 5: Explore Hongdae and enjoy the vibrant nightlife.',
      activities: ['Hongdae', 'Itaewon', 'Gwangjang Market']
    },
    {
      day: 'Day 6: Visit the War Memorial of Korea and shop at Insadong.',
      activities: ['War Memorial of Korea', 'Insadong', 'Dongdaemun Design Plaza']
    }
  ];

  const suggestedPlaces = [
    'Coex Mall',
    'Coex Sea Aquarium',
    'Butter Store',
    'Sulbing Myeongdong 1st',
    'Mouse Rabbit Coffee',
    'C.Through Cafe',
    'Hongdae B1 Club',
    'Hongdae H&M',
    'Coin KTV at Hongdae Street',
    'Photobooth Haru Films at Myeongdong',
    'Grandpa Factory (할아버지공장) at Seongsu',
    'Seoul Forest',
    'Han River',
    'JYP building',
    'SM Ent. Building'
    // Add more places as needed
  ];

  const topPicks = [
    { location: 'Nami Island', likes: 3 },
    { location: 'Lotte World', likes: 5 },
    { location: 'Bukchon Hanok Village', likes: 4 },
    { location: 'Myeongdong Shopping Street', likes: 6 },
    { location: 'N Seoul Tower', likes: 7 }
  ];

  const [itinerary, setItinerary] = useState(initialItinerary);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [currentSuggestions, setCurrentSuggestions] = useState([...suggestedPlaces.slice(0, 15)]);
  const [showDropdown, setShowDropdown] = useState(null); // Track which dropdown is open
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    // Optional: You can fetch initial itinerary from an API or another source here
    // fetchItineraryFromAPI();
  }, []);

  const handleEdit = (dayIndex, activityIndex) => {
    setSelectedDayIndex(dayIndex);
    setSelectedActivityIndex(activityIndex);

    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (selectedDayIndex !== null && selectedActivityIndex !== null) {
      const newItinerary = [...itinerary];
      const currentActivity = newItinerary[selectedDayIndex].activities[selectedActivityIndex];

      // Swap the suggestion with the current activity
      newItinerary[selectedDayIndex].activities[selectedActivityIndex] = suggestion;

      // Update suggestions: remove selected suggestion from suggestions and add back the current activity
      const updatedSuggestions = currentSuggestions.filter(place => place !== suggestion);
      updatedSuggestions.push(currentActivity);

      // Ensure only unique suggestions are in the list and limit to 15 suggestions
      const uniqueSuggestions = Array.from(new Set(updatedSuggestions)).slice(0, 15);

      setCurrentSuggestions(uniqueSuggestions);

      setItinerary(newItinerary);
      setShowSuggestions(false);
      setSelectedDayIndex(null);
      setSelectedActivityIndex(null);
    }
  };

  const handleEditActivity = (dayIndex, activityIndex) => {
    setEditMode(true);
    setSelectedDayIndex(dayIndex);
    setSelectedActivityIndex(activityIndex);
    setEditedText(itinerary[dayIndex].activities[activityIndex]);
  };

  const handleConfirmEdit = () => {
    if (selectedDayIndex !== null && selectedActivityIndex !== null) {
      const newItinerary = [...itinerary];
      newItinerary[selectedDayIndex].activities[selectedActivityIndex] = editedText;
      setItinerary(newItinerary);
      setEditMode(false);
      setSelectedDayIndex(null);
      setSelectedActivityIndex(null);
      setEditedText('');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedDayIndex(null);
    setSelectedActivityIndex(null);
    setEditedText('');
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setSelectedDayIndex(null);
    setSelectedActivityIndex(null);
  };

  const handleTopPickClick = (index) => {
    setShowDropdown(index);
  };

  const handleAddToItinerary = (dayIndex, location) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push(location);
    setItinerary(newItinerary);
    setShowDropdown(null); // Close dropdown after adding
  };

  const handleCloseDropdown = () => {
    setShowDropdown(null); // Close dropdown without adding
  };

  const handleDeleteActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.splice(activityIndex, 1);
    setItinerary(newItinerary);
  };

  const handleAddGreyBox = (dayIndex) => {
    const newItinerary = [...itinerary];
    const newActivity = `New Activity ${newItinerary[dayIndex].activities.length + 1}`;
    newItinerary[dayIndex].activities.push(newActivity);
    setItinerary(newItinerary);
  };

  return (
    <div className="resultsPageContainer">
      <TopBanner showAlertOnNavigate={true} />
      <div className="contentContainer">
        <div className="leftContainer">
          <h1>City Name: Seoul, South Korea</h1>
          {itinerary.map((dayPlan, dayIndex) => (
            <div className="dayContainer" key={dayIndex}>
              <h2>{dayPlan.day}</h2>
              {dayPlan.activities.map((activity, activityIndex) => (
                <div className="activityRow" key={activityIndex}>
                  {editMode && selectedDayIndex === dayIndex && selectedActivityIndex === activityIndex ? (
                    <>
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <button className="tickButton" onClick={handleConfirmEdit}>✔</button>
                      <button className="cancelButton" onClick={handleCancelEdit}>✕</button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={activity}
                        readOnly
                      />
                      <button className="suggestionsButton" onClick={() => handleEdit(dayIndex, activityIndex)}>
                        Suggestions
                      </button>
                      <button className="editButton" onClick={() => handleEditActivity(dayIndex, activityIndex)}>
                        Edit
                      </button>
                      <button className="deleteButton" onClick={() => handleDeleteActivity(dayIndex, activityIndex)}>
                        -
                      </button>
                    </>
                  )}
                </div>
              ))}
              <button className="addGreyBoxButton" onClick={() => handleAddGreyBox(dayIndex)}>
                + Add Activity
              </button>
            </div>
          ))}
        </div>
        <div className="rightContainer">
          <img src={require('../../../components/seoulmaptest.png')} alt="Map" />
          <div className="topPicksContainer">
            <h2>Top Picks:</h2>
            <ul>
              {topPicks.map((pick, index) => (
                <li key={index} className="topPickItem">
                  {pick.location} - {pick.likes} likes
                  <button className="plusButton" onClick={() => handleTopPickClick(index)}>+</button>
                  {showDropdown === index && (
                    <div className="dropdownMenu">
                      <button className="closeDropdownButton" onClick={handleCloseDropdown}>✕</button>
                      {itinerary.map((_, dayIndex) => (
                        <button key={dayIndex} onClick={() => handleAddToItinerary(dayIndex, pick.location)}>
                          Day {dayIndex + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {showSuggestions && (
          <div className="suggestionsModal">
            <div className="suggestionsContainer">
              <div className="modalHeader">
                <h3>Select a place:</h3>
                <button className="closeButton" onClick={handleCloseSuggestions}>
                  &#10005; {/* Unicode character for X */}
                </button>
              </div>
              <ul className="suggestionsList">
                {currentSuggestions.map((place, index) => (
                  <li key={index} className="suggestionItem">
                    <button className="suggestionButton" onClick={() => handleSuggestionSelect(place)}>
                      {place}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
