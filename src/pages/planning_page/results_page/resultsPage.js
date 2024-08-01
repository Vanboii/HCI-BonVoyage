import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
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
import Cookies from 'js-cookie';

Modal.setAppElement('#root');

const ItemTypes = {
  ACTIVITY: 'activity',
};

const Activity = ({ activity, index, moveActivity, dayIndex, section, handleEdit, handleDeleteActivity }) => {
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
    <div ref={ref} className="activityRow" style={{ opacity: isDragging ? 0.5 : 1 }}>
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
        <button className="suggestionsButton" onClick={() => handleEdit(dayIndex, index, section)}>
          Suggestions
        </button>
      </div>
      <div className="activityImage">
        <img src={activity.imageURL} alt={activity.name} />
        <img
          src={binIcon}
          alt="Delete"
          className="deleteIcon"
          onClick={() => handleDeleteActivity(dayIndex, index, section)}
        />
      </div>
    </div>
  );
};

const Section = ({ activities, dayIndex, section, moveActivity, handleEdit, handleDeleteActivity }) => {
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
  const [expandedDays, setExpandedDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const tripDetails = Cookies.get('tripDetails') ? JSON.parse(Cookies.get('tripDetails')) : {};
  const { startDate, endDate, city, country, numberOfPeople } = tripDetails;
  const tripDates = startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Unknown dates';

  useEffect(() => {
    fetch('/itinerary.json')
      .then(response => response.json())
      .then(data => {
        const itineraryData = Object.keys(data).filter(key => key.startsWith('day')).map(dayKey => ({
          day: dayKey,
          ...data[dayKey]
        }));
        setItinerary(itineraryData);
      })
      .catch(error => console.error('Error fetching itinerary data:', error));
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const fetchPlaceId = async (activity) => {
        return new Promise((resolve, reject) => {
          const service = new window.google.maps.places.PlacesService(mapRef.current);
          const request = {
            query: activity.name,
            fields: ['place_id']
          };
          service.findPlaceFromQuery(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
              resolve(results[0].place_id);
            } else {
              reject(status);
            }
          });
        });
      };

      const fetchAllPlaceIds = async () => {
        const updatedItinerary = [...itinerary];
        for (let day of updatedItinerary) {
          for (let section of ['morning', 'afternoon', 'evening']) {
            for (let activity of day[section]) {
              try {
                const placeId = await fetchPlaceId(activity);
                activity.placeId = placeId;
              } catch (error) {
                console.error(`Failed to fetch place ID for ${activity.name}:`, error);
              }
            }
          }
        }
        setItinerary(updatedItinerary);
      };

      fetchAllPlaceIds();
    }
  }, [itinerary]);

  const generateItineraryDates = (start, end, itinerary) => {
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
        morning: itinerary[index] ? itinerary[index].morning : [],
        afternoon: itinerary[index] ? itinerary[index].afternoon : [],
        evening: itinerary[index] ? itinerary[index].evening : [],
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

  const handleAddGreyBox = (dayIndex) => {
    const newItinerary = [...itinerary];
    const newActivity = {
      name: `New Activity ${newItinerary[dayIndex].morning.length + 1}`,
      description: 'Placeholder description for the new activity.',
      hours: 'Open hours for the new activity.',
      imageURL: 'https://via.placeholder.com/150',
      lat: 37.5665,
      lng: 126.9780,
      placeId: ''
    };
    newItinerary[dayIndex].morning.push(newActivity);
    setItinerary(newItinerary);
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

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: 37.5665,
    lng: 126.9780,
  };

  const locations = itinerary.flatMap((day, dayIndex) =>
    ['morning', 'afternoon', 'evening'].flatMap((section) =>
      day[section].map((activity, activityIndex) => ({
        key: `day${dayIndex}-section${section}-activity${activityIndex}`,
        location: { lat: activity.lat, lng: activity.lng },
        ...activity
      }))
    )
  );

  const PoiMarkers = ({ pois }) => {
    const handleClick = useCallback((ev, poi) => {
      if (!mapRef.current) return;
      mapRef.current.panTo(poi.location);
      mapRef.current.setZoom(15);  // Adjust zoom level as needed
    }, []);

    const handleMouseOver = useCallback((poi) => {
      const service = new window.google.maps.places.PlacesService(mapRef.current);
      const request = {
        placeId: poi.placeId,
        fields: ['name', 'formatted_address', 'place_id', 'geometry']
      };

      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaceDetails({
            name: place.name,
            address: place.formatted_address,
            placeId: place.place_id,
            location: place.geometry.location
          });
        }
      });
    }, []);

    return (
      <>
        {pois.map((poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
            clickable={true}
            onMouseOver={() => handleMouseOver(poi)}
            onMouseOut={() => setPlaceDetails(null)}
            onClick={(ev) => handleClick(ev, poi)}
          >
            <Pin background={'#ec1111'} glyphColor={'#ffffff'} borderColor={'#ffffff'} />
          </AdvancedMarker>
        ))}
        {placeDetails && (
          <InfoWindow
            position={placeDetails.location}
            onCloseClick={() => setPlaceDetails(null)}
          >
            <div>
              <h3>{placeDetails.name}</h3>
              <p>{placeDetails.address}</p>
              <p>{placeDetails.placeId}</p>
            </div>
          </InfoWindow>
        )}
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <APIProvider apiKey={'AIzaSyCSE_TMMsKRwr3TsvuwBbJEiwojEL1XF4A'} onLoad={() => console.log('Maps API has loaded.')}>
        <div className="resultsPageContainer">
          <TopBanner />
          <div className="contentContainer">
            <div className="leftContainer">
              <div className="pageHeader">
                <h1>Trip to {city}, {country}</h1>
                <p>Click on attraction to view more information.<br />
                Drag & Drop to adjust attraction in your itinerary timeline.<br />
                Hover over location for preview</p>
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
                      />
                      <button className="addActivityButton" onClick={() => handleAddGreyBox(dayIndex)}>
                        + Add Activity
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="rightContainer">
              <Map
                defaultZoom={10}
                defaultCenter={center}
                mapId='7567f4f2e6490e41'
                onLoad={map => (mapRef.current = map)}
              >
                <PoiMarkers pois={locations} />
              </Map>
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
        </div>
      </APIProvider>
    </DndProvider>
  );
};

export default ResultsPage;
