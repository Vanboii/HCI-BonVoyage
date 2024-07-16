import React, { useState, useEffect } from 'react';
import TopBanner from '../../../components/banner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './resultsPage.css';
import binIcon from '../../../components/bin.png';
import dragIcon from '../../../components/drag.png';
import calendarIcon from '../../../components/calendar.png'; // Import the calendar icon
import arrowDownIcon from '../../../components/arrow-down.png';
import arrowRightIcon from '../../../components/arrow-right.png'; 

const ItemTypes = {
  ACTIVITY: 'activity',
};

const Activity = ({ activity, index, moveActivity, dayIndex, handleEdit, handleDeleteActivity }) => {
  const ref = React.useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { index, dayIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.dayIndex !== dayIndex) {
        moveActivity(draggedItem.dayIndex, draggedItem.index, dayIndex, index);
        draggedItem.index = index;
        draggedItem.dayIndex = dayIndex;
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="activityRow" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="dragHandle">
        <img src={dragIcon} alt="Drag" />
      </div>
      <div className="activityInfo">
        <h3>{activity.name}</h3>
        <p>{activity.description}</p>
        <div className="activityDetails">
          <span>{activity.hours}</span>
        </div>
        <button className="suggestionsButton" onClick={() => handleEdit(dayIndex, index)}>
          Suggestions
        </button>
      </div>
      <div className="activityImage">
        <img src={activity.image} alt={activity.name} />
        <img
          src={binIcon}
          alt="Delete"
          className="deleteIcon"
          onClick={() => handleDeleteActivity(dayIndex, index)}
        />
      </div>
    </div>
  );
};

const ResultsPage = () => {
  const initialItinerary = [
    {
      day: 'Day 1: Wednesday, 24 July',
      activities: [
        {
          name: 'Gyeongbokgung Palace',
          description: 'Historical palace with guided tours and cultural events.',
          hours: 'Open 9AM - 5PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Bukchon Hanok Village',
          description: 'Traditional village showcasing historic Korean homes.',
          hours: 'Open 10AM - 6PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Insadong',
          description: 'Popular street for traditional Korean culture and crafts.',
          hours: 'Open 10AM - 9PM',
          image: 'https://via.placeholder.com/150',
        },
      ],
    },
    {
      day: 'Day 2: Thursday, 25 July',
      activities: [
        {
          name: 'Myeongdong Shopping Street',
          description: 'Bustling shopping area with a variety of stores and eateries.',
          hours: 'Open 10AM - 10PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'N Seoul Tower',
          description: 'Iconic tower offering panoramic views of Seoul.',
          hours: 'Open 10AM - 11PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Cheonggyecheon Stream',
          description: 'Modern public recreation space along a historic stream.',
          hours: 'Open 24 hours',
          image: 'https://via.placeholder.com/150',
        },
      ],
    },
    {
      day: 'Day 3: Friday, 26 July',
      activities: [
        {
          name: 'DMZ Tour',
          description: 'Tour to the Demilitarized Zone between North and South Korea.',
          hours: 'Tours at specific times',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'War Memorial of Korea',
          description: 'Memorial to the military history of Korea.',
          hours: 'Open 9AM - 6PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Hongdae',
          description: 'Vibrant area known for its indie music scene and nightlife.',
          hours: 'Open 24 hours',
          image: 'https://via.placeholder.com/150',
        },
      ],
    },
    {
      day: 'Day 4: Saturday, 27 July',
      activities: [
        {
          name: 'Lotte World',
          description: 'Major recreation complex with an amusement park, mall, and more.',
          hours: 'Open 9:30AM - 10PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Seoul City Hall',
          description: 'Government complex with a library and various events.',
          hours: 'Open 9AM - 6PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Gangnam District',
          description: 'Upscale area known for its nightlife and entertainment.',
          hours: 'Open 24 hours',
          image: 'https://via.placeholder.com/150',
        },
      ],
    },
    {
      day: 'Day 5: Sunday, 28 July',
      activities: [
        {
          name: 'Hongdae',
          description: 'Vibrant area known for its indie music scene and nightlife.',
          hours: 'Open 24 hours',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Itaewon',
          description: 'Diverse district known for its international restaurants and shops.',
          hours: 'Open 24 hours',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Gwangjang Market',
          description: 'Historic market famous for its street food and textiles.',
          hours: 'Open 9AM - 10PM',
          image: 'https://via.placeholder.com/150',
        },
      ],
    },
    {
      day: 'Day 6: Monday, 29 July',
      activities: [
        {
          name: 'War Memorial of Korea',
          description: 'Memorial to the military history of Korea.',
          hours: 'Open 9AM - 6PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Insadong',
          description: 'Popular street for traditional Korean culture and crafts.',
          hours: 'Open 10AM - 9PM',
          image: 'https://via.placeholder.com/150',
        },
        {
          name: 'Dongdaemun Design Plaza',
          description: 'Major urban development landmark with a futuristic design.',
          hours: 'Open 10AM - 7PM',
          image: 'https://via.placeholder.com/150',
        },
      ],
    },
  ];

  const suggestedPlaces = [
    {
      name: 'Coex Mall',
      description: 'Large shopping mall with numerous stores, restaurants, and attractions.',
      hours: 'Open 10AM - 10PM',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Coex Sea Aquarium',
      description: 'Popular aquarium with a variety of marine life exhibits.',
      hours: 'Open 10AM - 8PM',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Butter Store',
      description: 'Trendy store offering a wide range of lifestyle products.',
      hours: 'Open 10AM - 10PM',
      image: 'https://via.placeholder.com/150',
    },
    // Add more places as needed
  ];

  const [itinerary, setItinerary] = useState(initialItinerary);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [currentSuggestions, setCurrentSuggestions] = useState([...suggestedPlaces.slice(0, 15)]);
  const [expandedDays, setExpandedDays] = useState([]);

  useEffect(() => {
    // Optional: You can fetch initial itinerary from an API or another source here
    // fetchItineraryFromAPI();
  }, []);

  const toggleExpandDay = (dayIndex) => {
    setExpandedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((index) => index !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleEdit = (dayIndex, activityIndex) => {
    setSelectedDayIndex(dayIndex);
    setSelectedActivityIndex(activityIndex);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (selectedDayIndex !== null && selectedActivityIndex !== null) {
      const newItinerary = [...itinerary];
      newItinerary[selectedDayIndex].activities[selectedActivityIndex] = suggestion;

      setItinerary(newItinerary);
      setShowSuggestions(false);
      setSelectedDayIndex(null);
      setSelectedActivityIndex(null);
    }
  };

  const handleDeleteActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.splice(activityIndex, 1);
    setItinerary(newItinerary);
  };

  const handleAddGreyBox = (dayIndex) => {
    const newItinerary = [...itinerary];
    const newActivity = {
      name: `New Activity ${newItinerary[dayIndex].activities.length + 1}`,
      description: 'Placeholder description for the new activity.',
      hours: 'Open hours for the new activity.',
      image: 'https://via.placeholder.com/150'
    };
    newItinerary[dayIndex].activities.push(newActivity);
    setItinerary(newItinerary);
  };

  const moveActivity = (sourceDayIndex, sourceIndex, destinationDayIndex, destinationIndex) => {
    const newItinerary = [...itinerary];
    const [movedActivity] = newItinerary[sourceDayIndex].activities.splice(sourceIndex, 1);
    newItinerary[destinationDayIndex].activities.splice(destinationIndex, 0, movedActivity);
    setItinerary(newItinerary);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setSelectedDayIndex(null);
    setSelectedActivityIndex(null);
  };

  const handleSaveAndExit = () => {
    // Save itinerary to local storage or API
    localStorage.setItem('savedItinerary', JSON.stringify(itinerary));

    // Redirect to 'My Trips' page
    window.location.href = '/my-trips'; // Adjust this URL as needed
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="resultsPageContainer">
        <TopBanner />
        <div className="contentContainer">
          <div className="leftContainer">
            <div className="pageHeader">
              <h1>Trip to South Korea</h1>
              <p>Click on attraction to view more information.<br />
              Drag & Drop to adjust attraction in your itinerary timeline.<br />
              Hover over location for preview</p>
              <div className="tripDetails">
                <img src={calendarIcon} alt="Calendar" className="calendarIcon" />
                <span className="tripDates">7/24 - 8/15</span>
              </div>
            </div>
            {itinerary.map((dayPlan, dayIndex) => (
              <div className="dayContainer" key={dayIndex}>
                <div className={`dayHeader ${expandedDays.includes(dayIndex) ? 'expanded' : ''}`} onClick={() => toggleExpandDay(dayIndex)}>
                  <span className="dayArrow">
                    <img
                      src={expandedDays.includes(dayIndex) ? arrowDownIcon : arrowRightIcon}
                      alt="Arrow"
                    />
                  </span>
                  <h2>{dayPlan.day}</h2>
                </div>
                {expandedDays.includes(dayIndex) && (
                  <div className="activitiesContainer">
                    {dayPlan.activities.map((activity, activityIndex) => (
                      <Activity
                        key={activityIndex}
                        index={activityIndex}
                        activity={activity}
                        dayIndex={dayIndex}
                        moveActivity={moveActivity}
                        handleEdit={handleEdit}
                        handleDeleteActivity={handleDeleteActivity}
                      />
                    ))}
                    <button className="addActivityButton" onClick={() => handleAddGreyBox(dayIndex)}>
                      + Add Activity
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="rightContainer">
            <img src={require('../../../components/seoulmaptest.png')} alt="Map" className="mapImage" />
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
                      {place.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <button className="saveExitButton" onClick={handleSaveAndExit}>Save and Exit</button>
      </div>
    </DndProvider>
  );
};

export default ResultsPage;
