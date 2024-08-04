import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBanner from '../../../components/banner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './resultsPage.css';
import binIcon from '../../../components/bin.png';
import dragIcon from '../../../components/drag.png';
import calendarIcon from '../../../components/calendar.png';
import arrowDownIcon from '../../../components/arrow-down.png';
import arrowRightIcon from '../../../components/arrow-right.png';
import personIcon from '../../../components/person.png';
import Modal from 'react-modal';
import AddActivityModal from './AddActivityModal';
import MapComponent from './google_map';
import Cookies from 'js-cookie';

Modal.setAppElement('#root');

const ItemTypes = {
  ACTIVITY: 'activity',
};

const Activity = ({ activity, index, moveActivity, dayIndex, section, handleEdit, handleDeleteActivity, handleActivityClick }) => {
  const ref = React.useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { index, dayIndex, section },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.dayIndex !== dayIndex || draggedItem.section !== section) {
        moveActivity(draggedItem.dayIndex, draggedItem.index, draggedItem.section, dayIndex, index, section);
        draggedItem.index = index;
        draggedItem.dayIndex = dayIndex;
        draggedItem.section = section;
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="activityRow" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={() => handleActivityClick(activity)}>
      <div className="dragHandle">
        <img src={dragIcon} alt="Drag" />
      </div>
      <div className="activityInfo">
        <h3>{activity.name}</h3>
        <p>{activity.description}</p>
        <div className="activityDetails">
          <span className="hours">Opening Hours: {activity.hours}</span>
          <span className="budget">Budget: {activity.budget}</span>
        </div>
        <button className="suggestionsButton" onClick={(e) => { e.stopPropagation(); handleEdit(dayIndex, index, section); }}>
          Suggestions
        </button>
      </div>
      <div className="activityImage">
        <img src={activity.imageURL} alt={activity.name} />
        <img
          src={binIcon}
          alt="Delete"
          className="deleteIcon"
          onClick={(e) => { e.stopPropagation(); handleDeleteActivity(dayIndex, index, section); }}
        />
      </div>
    </div>
  );
};

const Section = ({ activities, dayIndex, section, moveActivity, handleEdit, handleDeleteActivity, handleActivityClick }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    drop: (draggedItem) => {
      if (draggedItem.dayIndex !== dayIndex || draggedItem.section !== section) {
        moveActivity(draggedItem.dayIndex, draggedItem.index, draggedItem.section, dayIndex, activities.length, section);
        draggedItem.index = activities.length;
        draggedItem.dayIndex = dayIndex;
        draggedItem.section = section;
      }
    },
  });

  return (
    <div ref={drop} className="sectionContainer">
      {activities.map((activity, index) => (
        <Activity
          key={index}
          index={index}
          activity={activity}
          dayIndex={dayIndex}
          section={section}
          moveActivity={moveActivity}
          handleEdit={handleEdit}
          handleDeleteActivity={handleDeleteActivity}
          handleActivityClick={handleActivityClick}
        />
      ))}
      {activities.length === 0 && <div className="emptySection">Drag an Activity Here</div>}
    </div>
  );
};

const ResultsPage = () => {
  const [itinerary, setItinerary] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [currentSection, setCurrentSection] = useState('morning');
  const [expandedDays, setExpandedDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  const tripDetails = Cookies.get('tripDetails') ? JSON.parse(Cookies.get('tripDetails')) : {};
  const { startDate, endDate, city, country, numberOfPeople } = tripDetails;
  const tripDates = startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Unknown dates';

  useEffect(() => {
    fetch('/itinerary.json')
      .then(response => response.json())
      .then(data => {
        const itineraryData = generateItineraryDates(new Date(startDate), new Date(endDate), data);
        setItinerary(itineraryData);
      })
      .catch(error => console.error('Error fetching itinerary data:', error));
  }, [startDate, endDate]);

  const generateItineraryDates = (start, end, data) => {
    const dayMilliseconds = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.ceil((end - start) / dayMilliseconds) + 1;
    const updatedItinerary = Array.from({ length: numberOfDays }).map((_, index) => {
      const date = new Date(start.getTime() + index * dayMilliseconds);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      const dayNumber = date.getDate();
      const formattedDate = `${dayName}, ${dayNumber} ${monthName}`;
      return {
        day: `Day ${index + 1}: ${formattedDate}`,
        morning: data[`day${index + 1}`]?.morning || [],
        afternoon: data[`day${index + 1}`]?.afternoon || [],
        evening: data[`day${index + 1}`]?.evening || [],
      };
    });
    return updatedItinerary;
  };

  const toggleExpandDay = (dayIndex) => {
    setExpandedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((index) => index !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleEdit = (dayIndex, activityIndex, section) => {
    setSelectedDayIndex(dayIndex);
    setSelectedActivityIndex(activityIndex);
    setSelectedSection(section);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (selectedDayIndex !== null && selectedActivityIndex !== null && selectedSection !== null) {
      const newItinerary = [...itinerary];
      newItinerary[selectedDayIndex][selectedSection][selectedActivityIndex] = suggestion;

      setItinerary(newItinerary);
      setShowSuggestions(false);
      setSelectedDayIndex(null);
      setSelectedActivityIndex(null);
      setSelectedSection(null);
    }
  };

  const handleDeleteActivity = (dayIndex, activityIndex, section) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex][section].splice(activityIndex, 1);
    setItinerary(newItinerary);
  };

  const handleAddGreyBox = (dayIndex, section) => {
    setCurrentDayIndex(dayIndex);
    setCurrentSection(section);
    setIsModalOpen(true);
  };

  const handleSaveActivity = ({ name, description, openingHours, budget }) => {
    const newItinerary = [...itinerary];

    if (!newItinerary[currentDayIndex][currentSection]) {
      newItinerary[currentDayIndex][currentSection] = [];
    }

    const newActivity = {
      name,
      description,
      openingHours,
      budget,
    };

    newItinerary[currentDayIndex][currentSection].push(newActivity);
    setItinerary(newItinerary);
    setIsModalOpen(false);
  };
  
  
  


  const moveActivity = (sourceDayIndex, sourceIndex, sourceSection, destinationDayIndex, destinationIndex, destinationSection) => {
    const newItinerary = [...itinerary];
    const [movedActivity] = newItinerary[sourceDayIndex][sourceSection].splice(sourceIndex, 1);
    newItinerary[destinationDayIndex][destinationSection].splice(destinationIndex, 0, movedActivity);
    setItinerary(newItinerary);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setSelectedDayIndex(null);
    setSelectedActivityIndex(null);
    setSelectedSection(null);
  };

  const handleSaveAndExit = () => {
    const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
    const newTrip = {
      image: 'https://via.placeholder.com/200',
      location: `${city}, ${country}`,
      priceRange: '$1000 - $3000',
      saves: 0,
      travelers: numberOfPeople,
      itinerary: itinerary,
    };

    const existingTripIndex = upcomingTrips.findIndex(trip => trip.location === newTrip.location);

    if (existingTripIndex !== -1) {
      upcomingTrips[existingTripIndex] = newTrip;
    } else {
      upcomingTrips.push(newTrip);
    }

    localStorage.setItem('upcomingTrips', JSON.stringify(upcomingTrips));

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/mytrips');
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity({
      key: activity.key,
      ...activity
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="resultsPageContainer">
        <TopBanner />
        <div className="contentContainer">
          <div className="leftContainer">
            <div className="pageHeader">
              <h1>Trip to {city}, {country}</h1>
              <p>Welcome to Your AI-Generated Itinerary<br />
              <br />
              Double Click on location to view more information.<br />
              Drag & Drop to adjust attraction in your itinerary timeline.<br />
              </p>
              <div className="headerDetails">
                <div className="peopleDetails">
                  <img src={personIcon} alt="Person" className="personIcon" />
                  <span className="numberOfPeople">{numberOfPeople} People</span>
                  <div className="tripDetails">
                    <img src={calendarIcon} alt="Calendar" className="calendarIcon" />
                    <span className="tripDates">{tripDates}</span>
                  </div>
                </div>
                <button className="saveExitButton" onClick={handleSaveAndExit}>Save and Exit</button>
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
                    <h3>Morning</h3>
                    <hr className="divider" />
                    <Section
                      activities={dayPlan.morning}
                      dayIndex={dayIndex}
                      section="morning"
                      moveActivity={moveActivity}
                      handleEdit={handleEdit}
                      handleDeleteActivity={handleDeleteActivity}
                      handleActivityClick={handleActivityClick}
                    />
                    <h3>Afternoon</h3>
                    <hr className="divider" />
                    <Section
                      activities={dayPlan.afternoon}
                      dayIndex={dayIndex}
                      section="afternoon"
                      moveActivity={moveActivity}
                      handleEdit={handleEdit}
                      handleDeleteActivity={handleDeleteActivity}
                      handleActivityClick={handleActivityClick}
                    />
                    <h3>Evening</h3>
                    <hr className="divider" />
                    <Section
                      activities={dayPlan.evening}
                      dayIndex={dayIndex}
                      section="evening"
                      moveActivity={moveActivity}
                      handleEdit={handleEdit}
                      handleDeleteActivity={handleDeleteActivity}
                      handleActivityClick={handleActivityClick}
                    />
                    <button className="addActivityButton" onClick={() => handleAddGreyBox(dayIndex, 'evening')}>
                      + Add Activity
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="rightContainer">
            <MapComponent itinerary={itinerary} selectedActivity={selectedActivity} />
          </div>
        </div>
        {showSuggestions && (
          <div className="suggestionsModal">
            <div className="suggestionsContainer">
              <div className="modalHeader">
                <h3>Select a place:</h3>
                <button className="closeButton" onClick={handleCloseSuggestions}>
                  &#10005;
                </button>
              </div>
              <div className="suggestionsList">
                {currentSuggestions.map((place, index) => (
                  <div className="suggestionItem" key={index} onClick={() => handleSuggestionSelect(place)}>
                    <div className="activityInfo">
                      <h3>{place.name}</h3>
                      <p>{place.description}</p>
                      <div className="activityDetails">
                        <span className="hours">{place.hours}</span>
                        <span className="budget">Budget: {place.budget}</span>
                      </div>
                    </div>
                    <div className="activityImage">
                      <img src={place.imageURL} alt={place.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Itinerary Saved"
          className="customModal"
          overlayClassName="customOverlay"
        >
          <h2>Itinerary Saved Successfully in My Trips!</h2>
          <button onClick={closeModal}>OK</button>
        </Modal>
        <AddActivityModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSave={handleSaveActivity}
          defaultName={`New Activity ${itinerary[currentDayIndex] ? itinerary[currentDayIndex][currentSection].length + 1 : 1}`}
          section={currentSection}
        />
      </div>
    </DndProvider>
  );
};

export default ResultsPage;
