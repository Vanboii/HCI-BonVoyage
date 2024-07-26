
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import TopBanner from '../../../components/banner';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import './resultsPage.css';
// import binIcon from '../../../components/bin.png';
// import dragIcon from '../../../components/drag.png';
// import calendarIcon from '../../../components/calendar.png'; 
// import arrowDownIcon from '../../../components/arrow-down.png';
// import arrowRightIcon from '../../../components/arrow-right.png';
// import Modal from 'react-modal';
// import Cookies from 'js-cookie';

// Modal.setAppElement('#root');

// const ItemTypes = {
//   ACTIVITY: 'activity',
// };

// const Activity = ({ activity, index, moveActivity, dayIndex, handleEdit, handleDeleteActivity }) => {
//   const ref = React.useRef(null);
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.ACTIVITY,
//     item: { index, dayIndex },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.ACTIVITY,
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index || draggedItem.dayIndex !== dayIndex) {
//         moveActivity(draggedItem.dayIndex, draggedItem.index, dayIndex, index);
//         draggedItem.index = index;
//         draggedItem.dayIndex = dayIndex;
//       }
//     },
//   });

//   drag(drop(ref));

//   return (
//     <div ref={ref} className="activityRow" style={{ opacity: isDragging ? 0.5 : 1 }}>
//       <div className="dragHandle">
//         <img src={dragIcon} alt="Drag" />
//       </div>
//       <div className="activityInfo">
//         <h3>{activity.name}</h3>
//         <p>{activity.description}</p>
//         <div className="activityDetails">
//           <span>{activity.hours}</span>
//         </div>
//         <button className="suggestionsButton" onClick={() => handleEdit(dayIndex, index)}>
//           Suggestions
//         </button>
//       </div>
//       <div className="activityImage">
//         <img src={activity.image} alt={activity.name} />
//         <img
//           src={binIcon}
//           alt="Delete"
//           className="deleteIcon"
//           onClick={() => handleDeleteActivity(dayIndex, index)}
//         />
//       </div>
//     </div>
//   );
// };

// const ResultsPage = () => {
//   const initialItinerary = [
//     {
//       day: 'Day 1: Placeholder',
//       activities: [
//         {
//           name: 'Gyeongbokgung Palace',
//           description: 'Historical palace with guided tours and cultural events.',
//           hours: 'Open 9AM - 5PM',
//           image: 'https://via.placeholder.com/150',
//         },
//         {
//           name: 'Bukchon Hanok Village',
//           description: 'Traditional village showcasing historic Korean homes.',
//           hours: 'Open 10AM - 6PM',
//           image: 'https://via.placeholder.com/150',
//         },
//         {
//           name: 'Insadong',
//           description: 'Popular street for traditional Korean culture and crafts.',
//           hours: 'Open 10AM - 9PM',
//           image: 'https://via.placeholder.com/150',
//         },
//       ],
//     },
//     {
//       day: 'Day 2: Placeholder',
//       activities: [
//         {
//           name: 'Myeongdong Shopping Street',
//           description: 'Bustling shopping area with a variety of stores and eateries.',
//           hours: 'Open 10AM - 10PM',
//           image: 'https://via.placeholder.com/150',
//         },
//         {
//           name: 'N Seoul Tower',
//           description: 'Iconic tower offering panoramic views of Seoul.',
//           hours: 'Open 10AM - 11PM',
//           image: 'https://via.placeholder.com/150',
//         },
//         {
//           name: 'Cheonggyecheon Stream',
//           description: 'Modern public recreation space along a historic stream.',
//           hours: 'Open 24 hours',
//           image: 'https://via.placeholder.com/150',
//         },
//       ],
//     },
//     // Additional placeholder days...
//   ];

//   const suggestedPlaces = [
//     {
//       name: 'Coex Mall',
//       description: 'Large shopping mall with numerous stores, restaurants, and attractions.',
//       hours: 'Open 10AM - 10PM',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       name: 'Coex Sea Aquarium',
//       description: 'Popular aquarium with a variety of marine life exhibits.',
//       hours: 'Open 10AM - 8PM',
//       image: 'https://via.placeholder.com/150',
//     },
//     {
//       name: 'Butter Store',
//       description: 'Trendy store offering a wide range of lifestyle products.',
//       hours: 'Open 10AM - 10PM',
//       image: 'https://via.placeholder.com/150',
//     },
//   ];

//   const [itinerary, setItinerary] = useState(initialItinerary);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
//   const [currentSuggestions, setCurrentSuggestions] = useState([...suggestedPlaces.slice(0, 15)]);
//   const [expandedDays, setExpandedDays] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   const startDate = Cookies.get('startDate') ? new Date(Cookies.get('startDate')) : null;
//   const endDate = Cookies.get('endDate') ? new Date(Cookies.get('endDate')) : null;
//   const tripDates = startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : 'Unknown dates';

//   useEffect(() => {
//     if (startDate && endDate) {
//       const updatedItinerary = generateItineraryDates(startDate, endDate, itinerary);
//       setItinerary(updatedItinerary);
//     }
//   }, [startDate, endDate]);

//   const generateItineraryDates = (start, end, itinerary) => {
//     const dayMilliseconds = 24 * 60 * 60 * 1000;
//     const numberOfDays = Math.ceil((end - start) / dayMilliseconds) + 1;
//     const updatedItinerary = Array.from({ length: numberOfDays }).map((_, index) => {
//       const date = new Date(start.getTime() + index * dayMilliseconds);
//       const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
//       const monthName = date.toLocaleDateString('en-US', { month: 'long' });
//       const dayNumber = date.getDate();
//       const formattedDate = `${dayName}, ${dayNumber} ${monthName}`;
//       return {
//         day: `Day ${index + 1}: ${formattedDate}`,
//         activities: itinerary[index] ? itinerary[index].activities : [],
//       };
//     });
//     return updatedItinerary;
//   };

//   const toggleExpandDay = (dayIndex) => {
//     setExpandedDays((prev) =>
//       prev.includes(dayIndex) ? prev.filter((index) => index !== dayIndex) : [...prev, dayIndex]
//     );
//   };

//   const handleEdit = (dayIndex, activityIndex) => {
//     setSelectedDayIndex(dayIndex);
//     setSelectedActivityIndex(activityIndex);
//     setShowSuggestions(true);
//   };

//   const handleSuggestionSelect = (suggestion) => {
//     if (selectedDayIndex !== null && selectedActivityIndex !== null) {
//       const newItinerary = [...itinerary];
//       newItinerary[selectedDayIndex].activities[selectedActivityIndex] = suggestion;

//       setItinerary(newItinerary);
//       setShowSuggestions(false);
//       setSelectedDayIndex(null);
//       setSelectedActivityIndex(null);
//     }
//   };

//   const handleDeleteActivity = (dayIndex, activityIndex) => {
//     const newItinerary = [...itinerary];
//     newItinerary[dayIndex].activities.splice(activityIndex, 1);
//     setItinerary(newItinerary);
//   };

//   const handleAddGreyBox = (dayIndex) => {
//     const newItinerary = [...itinerary];
//     const newActivity = {
//       name: `New Activity ${newItinerary[dayIndex].activities.length + 1}`,
//       description: 'Placeholder description for the new activity.',
//       hours: 'Open hours for the new activity.',
//       image: 'https://via.placeholder.com/150'
//     };
//     newItinerary[dayIndex].activities.push(newActivity);
//     setItinerary(newItinerary);
//   };

//   const moveActivity = (sourceDayIndex, sourceIndex, destinationDayIndex, destinationIndex) => {
//     const newItinerary = [...itinerary];
//     const [movedActivity] = newItinerary[sourceDayIndex].activities.splice(sourceIndex, 1);
//     newItinerary[destinationDayIndex].activities.splice(destinationIndex, 0, movedActivity);
//     setItinerary(newItinerary);
//   };

//   const handleCloseSuggestions = () => {
//     setShowSuggestions(false);
//     setSelectedDayIndex(null);
//     setSelectedActivityIndex(null);
//   };

//   const handleSaveAndExit = () => {
//     const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
//     const newTrip = {
//       image: 'https://via.placeholder.com/200',
//       location: 'Custom Trip',
//       priceRange: '$1000 - $3000',
//       saves: 0,
//       travelers: 1,
//       itinerary: itinerary,
//     };

//     const existingTripIndex = upcomingTrips.findIndex(trip => trip.location === newTrip.location);

//     if (existingTripIndex !== -1) {
//       upcomingTrips[existingTripIndex] = newTrip;
//     } else {
//       upcomingTrips.push(newTrip);
//     }

//     localStorage.setItem('upcomingTrips', JSON.stringify(upcomingTrips));

//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     navigate('/mytrips');
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="resultsPageContainer">
//         <TopBanner />
//         <div className="contentContainer">
//           <div className="leftContainer">
//             <div className="pageHeader">
//               <h1>Trip to South Korea</h1>
//               <p>Click on attraction to view more information.<br />
//               Drag & Drop to adjust attraction in your itinerary timeline.<br />
//               Hover over location for preview</p>
//               <div className="tripDetails">
//                 <img src={calendarIcon} alt="Calendar" className="calendarIcon" />
//                 <span className="tripDates">{tripDates}</span>
//               </div>
//             </div>
//             {itinerary.map((dayPlan, dayIndex) => (
//               <div className="dayContainer" key={dayIndex}>
//                 <div className={`dayHeader ${expandedDays.includes(dayIndex) ? 'expanded' : ''}`} onClick={() => toggleExpandDay(dayIndex)}>
//                   <span className="dayArrow">
//                     <img
//                       src={expandedDays.includes(dayIndex) ? arrowDownIcon : arrowRightIcon}
//                       alt="Arrow"
//                     />
//                   </span>
//                   <h2>{dayPlan.day}</h2>
//                 </div>
//                 {expandedDays.includes(dayIndex) && (
//                   <div className="activitiesContainer">
//                     {dayPlan.activities.map((activity, activityIndex) => (
//                       <Activity
//                         key={activityIndex}
//                         index={activityIndex}
//                         activity={activity}
//                         dayIndex={dayIndex}
//                         moveActivity={moveActivity}
//                         handleEdit={handleEdit}
//                         handleDeleteActivity={handleDeleteActivity}
//                       />
//                     ))}
//                     <button className="addActivityButton" onClick={() => handleAddGreyBox(dayIndex)}>
//                       + Add Activity
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="rightContainer">
//             <img src={require('../../../components/seoulmaptest.png')} alt="Map" className="mapImage" />
//           </div>
//         </div>
//         {showSuggestions && (
//           <div className="suggestionsModal">
//             <div className="suggestionsContainer">
//               <div className="modalHeader">
//                 <h3>Select a place:</h3>
//                 <button className="closeButton" onClick={handleCloseSuggestions}>
//                   &#10005;
//                 </button>
//               </div>
//               <ul className="suggestionsList">
//                 {currentSuggestions.map((place, index) => (
//                   <li key={index} className="suggestionItem">
//                     <button className="suggestionButton" onClick={() => handleSuggestionSelect(place)}>
//                       {place.name}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//         <button className="saveExitButton" onClick={handleSaveAndExit}>Save and Exit</button>
//         <Modal
//           isOpen={showModal}
//           onRequestClose={closeModal}
//           contentLabel="Itinerary Saved"
//           className="customModal"
//           overlayClassName="customOverlay"
//         >
//           <h2>Itinerary Saved Successfully in My Trips!</h2>
//           <button onClick={closeModal}>OK</button>
//         </Modal>
//       </div>
//     </DndProvider>
//   );
// };

// export default ResultsPage;

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
import Cookies from 'js-cookie';

Modal.setAppElement('#root');

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
      day: 'Day 1: Placeholder',
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
      day: 'Day 2: Placeholder',
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
    // Additional placeholder days...
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
  ];

  const [itinerary, setItinerary] = useState(initialItinerary);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [currentSuggestions, setCurrentSuggestions] = useState([...suggestedPlaces.slice(0, 15)]);
  const [expandedDays, setExpandedDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const tripDetails = Cookies.get('tripDetails') ? JSON.parse(Cookies.get('tripDetails')) : {};
  const { startDate, endDate, city, country, numberOfPeople } = tripDetails;
  const tripDates = startDate && endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : 'Unknown dates';

  useEffect(() => {
    if (startDate && endDate) {
      const updatedItinerary = generateItineraryDates(new Date(startDate), new Date(endDate), itinerary);
      setItinerary(updatedItinerary);
    }
  }, [startDate, endDate]);

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
    const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
    const newTrip = {
      image: 'https://via.placeholder.com/200',
      location: `${city}, ${country}`, // Update location to include city and country
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

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
};

export default ResultsPage;