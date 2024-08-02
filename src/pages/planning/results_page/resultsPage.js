import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useTrips } from '../../../useHooks/useTrips';
import axios from 'axios';
import { useItinerary } from '../../../useHooks/useItineraries';



Modal.setAppElement('#root');

const ItemTypes = {
  ACTIVITY: 'activity',
};

const Activity = ({ activity, index, moveActivity, period, dayIndex, handleEdit, handleDeleteActivity }) => {
  const ref = React.useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { index, period, dayIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.dayIndex !== dayIndex || draggedItem.period !== period) {
        moveActivity(draggedItem.dayIndex, draggedItem.period, draggedItem.index, dayIndex, period, index);
        draggedItem.index = index;
        draggedItem.period = period;
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
        <button className="suggestionsButton" onClick={() => handleEdit(dayIndex, period, index)}>
          Suggestions
        </button>
      </div>
      <div className="activityImage">
        <img src={activity.image} alt={activity.name} />
        <img
          src={binIcon}
          alt="Delete"
          className="deleteIcon"
          onClick={() => handleDeleteActivity(dayIndex, period, index)}
        />
      </div>
    </div>
  );
};

const Section = ({ activities, dayIndex, period, moveActivity, handleEdit, handleDeleteActivity }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    drop: (draggedItem) => {
      if (draggedItem.dayIndex !== dayIndex || draggedItem.section !== period) {
        moveActivity(draggedItem.dayIndex, draggedItem.period, draggedItem.index, dayIndex, period, activities.length);
        draggedItem.index = period.length;
        draggedItem.dayIndex = dayIndex;
        draggedItem.period = period;
      }
    },
  });

  return (
    <div ref={drop} className="sectionContainer">
      <h3>{period}</h3>
      {activities.map((activity, index) => (
        <Activity
          key={index}
          index={index}
          activity={activity}
          period={period}
          dayIndex={dayIndex}
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
  const initialItinerary = {
    day1:{
      morning: [
        {
          name: 'Gyeongbokgung Palace',
          description: 'Historical palace with guided tours and cultural events.',
          hours: 'Open 9AM - 5PM',
          image: 'https://via.placeholder.com/150',
          lat: 37.579617,
          lng: 126.977041,
          placeId: ''
        }],
      afternoon: [{
        name: 'Bukchon Hanok Village',
        description: 'Traditional village showcasing historic Korean homes.',
        hours: 'Open 10AM - 6PM',
        image: 'https://via.placeholder.com/150',
        lat: 37.582576,
        lng: 126.985648,
        placeId: ''
      }],
      evening:[{
        name: 'Insadong',
        description: 'Popular street for traditional Korean culture and crafts.',
        hours: 'Open 10AM - 9PM',
        image: 'https://via.placeholder.com/150',
        lat: 37.572768,
        lng: 126.986632,
        placeId: ''
      }],
    },
    day2: {
      morning: [{
        name: 'Myeongdong Shopping Street',
        description: 'Bustling shopping area with a variety of stores and eateries.',
        hours: 'Open 10AM - 10PM',
        image: 'https://via.placeholder.com/150',
        lat: 37.560970,
        lng: 126.985032,
        placeId: ''
      }],
      afternoon: [{
        name: 'N Seoul Tower',
        description: 'Iconic tower offering panoramic views of Seoul.',
        hours: 'Open 10AM - 11PM',
        image: 'https://via.placeholder.com/150',
        lat: 37.551169,
        lng: 126.988227,
        placeId: ''
      }],
      evening: [{
        name: 'Cheonggyecheon Stream',
        description: 'Modern public recreation space along a historic stream.',
        hours: 'Open 24 hours',
        image: 'https://via.placeholder.com/150',
        lat: 37.569273,
        lng: 126.977047,
        placeId: ''
      }],
    },
  };

  const suggestedPlaces = [
    {
      name: 'Coex Mall',
      description: 'Large shopping mall with numerous stores, restaurants, and attractions.',
      hours: 'Open 10AM - 10PM',
      image: 'https://via.placeholder.com/150',
      lat: 37.511017,
      lng: 127.059544,
      placeId: ''
    },
    {
      name: 'Coex Sea Aquarium',
      description: 'Popular aquarium with a variety of marine life exhibits.',
      hours: 'Open 10AM - 8PM',
      image: 'https://via.placeholder.com/150',
      lat: 37.511557,
      lng: 127.059899,
      placeId: ''
    },
    {
      name: 'Butter Store',
      description: 'Trendy store offering a wide range of lifestyle products.',
      hours: 'Open 10AM - 10PM',
      image: 'https://via.placeholder.com/150',
      lat: 37.570558,
      lng: 126.992528,
      placeId: ''
    },
  ];

  const [itineraryDetails, setItineraryDetails] = useState(null);
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [currentSuggestions] = useState([...suggestedPlaces.slice(0, 15)]);
  const [expandedDays, setExpandedDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const {addTrip} = useTrips();
  const {getItinerary} = useItinerary();

  const [ startDate, setStartDate] = useState("");
  const [ endDate, setEndDate] = useState("");
  const [ city, setCity] = useState("");
  const [ country, setCountry] = useState("");
  const [ numberOfPeople, setNumberOfPeople] = useState(0);
  const [ tripDates, setTripDates] = useState(``);
  // const [ locations, setLocations ] = useState([])
  // const id = "cv2e4XxVm88jmL2GQLZu" //^Dummy itinerary ID

  useEffect(()=> {
    if(itineraryDetails) {
      setStartDate(itineraryDetails.startDate)
      setEndDate(itineraryDetails.endDate)
      setCountry(itineraryDetails.country)
      setCity(itineraryDetails.city)
      setNumberOfPeople(itineraryDetails.numberOfPeople)
      setTripDates(startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Unknown dates')
    }
  },[itineraryDetails])

  // const tripDates = startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Unknown dates';

  const getItineraryDetails = async () => {
    const data = await getItinerary(id)
    setItineraryDetails(data)
  }
  const getGeneratedItinerary = async () => {
    for (let idx = 0; idx < 3; idx++) {
  
      console.log('Fetching Generated Itinerary...',id);
      const response = await axios.get(`https://bonvoyage-api.azurewebsites.net/get-resulttrip?itineraryID=${id}`);
      const generatedItinerary = response.dataResult; // Adjusted to match the structure in the previous example
      if (generatedItinerary != null && Object.keys(generatedItinerary).length > 0) {
        console.log('Fetched Generated Itinerary:', generatedItinerary);
        setItinerary(generatedItinerary);
        break
      }
      console.error('Error Fetching Itinerary', idx);
    }
    setLoading(false);
  }

  useEffect(() => {
    getGeneratedItinerary()
    getItineraryDetails()
  },[])

  useEffect(() => {
    if (startDate && endDate) {
      const updatedItinerary = generateItineraryDates(new Date(startDate), new Date(endDate), itinerary);
      setItinerary(updatedItinerary);
    }
  }, [startDate, endDate]);

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
        const updatedItinerary = {...itinerary};
        const days = Object.values(updatedItinerary);
        for (let day of days) {
          const periods = ['morning','afternoon','evening']
          for (let period of periods) {
            for (let activity of day[period]) {
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

    console.log("itinerary", itinerary)
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
        activities: itinerary[index] ? itinerary[index].activities : [],
      };
    });
    return updatedItinerary;
  };

  const toggleExpandDay = (dayIndex) => {
    setExpandedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((index) => index !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleEdit = (dayIndex, period, activityIndex) => {
    setSelectedDayIndex(dayIndex);
    setSelectedPeriodIndex(period);
    setSelectedActivityIndex(activityIndex);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (selectedDayIndex !== null && selectedActivityIndex !== null) {
      const newItinerary = {...itinerary};
      newItinerary[selectedDayIndex][selectedPeriodIndex][selectedActivityIndex] = suggestion;

      setItinerary(newItinerary);
      setShowSuggestions(false);
      setSelectedDayIndex(null);
      setSelectedActivityIndex(null);
    }
  };

  const handleDeleteActivity = (dayIndex, period, activityIndex) => {
    const newItinerary = {...itinerary};
    newItinerary[dayIndex][period].splice(activityIndex, 1);
    setItinerary(newItinerary);
  };

  const handleAddGreyBox = (day,period) => {
    const newItinerary = {...itinerary};
    const newActivity = {
      name: `New Activity ${newItinerary[day][period].length + 1}`,
      description: 'Placeholder description for the new activity.',
      hours: 'Open hours for the new activity.',
      image: 'https://via.placeholder.com/150',
      lat: 37.5665,
      lng: 126.9780,
      placeId: ''
    };
    newItinerary[day][period].push(newActivity);
    setItinerary(newItinerary);
  };

  const moveActivity = (sourceDayIndex, sourcePeriod, sourceIndex, destinationDayIndex, destinationPeriod, destinationIndex) => {
    const newItinerary = {...itinerary};
    const [movedActivity] = newItinerary[sourceDayIndex][sourcePeriod].splice(sourceIndex, 1);
    newItinerary[destinationDayIndex][destinationPeriod].splice(destinationIndex, 0, movedActivity);
    setItinerary(newItinerary);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setSelectedDayIndex(null);
    setSelectedActivityIndex(null);
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
    addTrip(id, itinerary)

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

  // const locations = Object.values(itinerary) // Get entries [ [day1, {...}], [day2, {...}] ]
  //   .map((days) => Object.values(days)
  //     .flatmap((periods) => periods)
  //   )
  

  // const locations = Object.values(itinerary).flatmap(days => {
  //   console.log(days);
  //   return Object.values(days).flatmap(periods => periods
  //   )
  // });
  const locations = Object.values(itinerary).flatMap(dayPlan =>
    Object.values(dayPlan).flatMap(periodActivities => periodActivities)
  );
  console.log("location:",locations)


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


  if (loading) {
    return (
      <div className="loading-container">
        <TopBanner showAlertOnNavigate={true} />
        <main>
          <h1>Loading...</h1>
          <p>Please wait YOU DOG.</p>
        </main>
      </div>
    );
  }

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
           
        
              <p>hello</p>
              {Object.entries(itinerary).map(([day,days]) => (
                <div>
                  <h2>{day}</h2>
                  {Object.entries(days).map(([period,periods]) => (
                    <div>
                      <Section
                        activities={periods}
                        period={period}
                        dayIndex={day}
                        handleEdit={handleEdit}
                        moveActivity={moveActivity}
                        handleDeleteActivity={handleDeleteActivity}
                      />
                      {/* <h4>{period}</h4>
                      {Object.entries(periods).map(([activityIndex,activity]) => (
                          <div>
                            <Activity
                              key={`${day}-${period}-${activityIndex}`}
                              index={activity}
                              activity={activity}
                              dayIndex={day}
                              period={period}
                              moveActivity={moveActivity}
                              handleEdit={handleEdit}
                              handleDeleteActivity={handleDeleteActivity}
                            />
                          </div>
                        )) 
                      } */}
                      
                    </div>
                    ))
                  }
                  <button className="addActivityButton" onClick={() => handleAddGreyBox(day,"evening")}>
                    + Add Activity
                  </button>
                </div>
              )

                )}
              <p>bye</p>
              {/* {itinerary.map((dayPlan, dayIndex) => (
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
                      
                    </div>
                  )}
                </div>
              ))} */}
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
                          <span>{place.hours}</span>
                        </div>
                      </div>
                      <div className="activityImage">
                        <img src={place.image} alt={place.name} />
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
