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
      day: 'Day 1: December 1',
      activities: [
        {
          name: 'Senso-ji Temple',
          description: 'Tokyo\'s oldest temple located in Asakusa, a must-see for its traditional architecture and bustling surrounding market.',
          hours: 'Open 6AM - 5PM',
          image: 'https://via.placeholder.com/150',
          lat: 35.714765,
          lng: 139.796655,
          placeId: ''
        },
        {
          name: 'Ueno Park and Zoo',
          description: 'A large public park that houses a zoo, museums, and beautiful seasonal foliage.',
          hours: 'Park open 5AM - 11PM, Zoo open 9:30AM - 5PM',
          image: 'https://via.placeholder.com/150',
          lat: 35.715098,
          lng: 139.774448,
          placeId: ''
        },
        {
          name: 'Akihabara',
          description: 'Famous for electronics shops, anime, and manga stores. A paradise for tech enthusiasts and otaku culture fans.',
          hours: 'Stores generally open 10AM - 9PM',
          image: 'https://via.placeholder.com/150',
          lat: 35.698683,
          lng: 139.774219,
          placeId: ''
        },
      ],
    },
    {
      day: 'Day 2: December 2',
      activities: [
        {
          name: 'Tokyo Skytree',
          description: 'A broadcasting tower with an observation deck offering panoramic views of Tokyo.',
          hours: 'Open 8AM - 10PM',
          image: 'https://via.placeholder.com/150',
          lat: 35.710062,
          lng: 139.810700,
          placeId: ''
        },
        {
          name: 'Asakusa',
          description: 'Historic district with Senso-ji Temple, Nakamise shopping street, and traditional Japanese culture.',
          hours: 'Open 24 hours (shops generally open 9AM - 7PM)',
          image: 'https://via.placeholder.com/150',
          lat: 35.711835,
          lng: 139.796838,
          placeId: ''
        },
        {
          name: 'Odaiba',
          description: 'A futuristic island with shopping malls, entertainment complexes, and the famous Rainbow Bridge.',
          hours: 'Open 24 hours (attractions generally open 10AM - 9PM)',
          image: 'https://via.placeholder.com/150',
          lat: 35.627222,
          lng: 139.777778,
          placeId: ''
        },
      ],
    },
    {
      day: 'Day 3: December 3',
      activities: [
        {
          name: 'Shibuya Crossing',
          description: 'The world\'s busiest pedestrian crossing located in front of Shibuya Station.',
          hours: 'Open 24 hours',
          image: 'https://via.placeholder.com/150',
          lat: 35.659494,
          lng: 139.700533,
          placeId: ''
        },
        {
          name: 'Meiji Shrine',
          description: 'A Shinto shrine dedicated to Emperor Meiji and Empress Shoken, set in a large forested area.',
          hours: 'Open 5AM - 6PM',
          image: 'https://via.placeholder.com/150',
          lat: 35.676397,
          lng: 139.699326,
          placeId: ''
        },
        {
          name: 'Harajuku',
          description: 'Known for its quirky fashion shops and street culture, as well as the serene Yoyogi Park.',
          hours: 'Open 24 hours (shops generally open 11AM - 8PM)',
          image: 'https://via.placeholder.com/150',
          lat: 35.670259,
          lng: 139.702573,
          placeId: ''
        },
      ],
    },
  ];

  const suggestedPlaces = [
      {
        name: 'Tsukiji Outer Market',
        description: 'Famous for fresh seafood and delicious street food.',
        hours: 'Open 5AM - 2PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsukiji_Outer_Market.jpg',
        lat: 35.6652,
        lng: 139.7706,
        placeId: ''
      },
      {
        name: 'Roppongi Hills and Mori Art Museum',
        description: 'Modern complex with shopping, dining, and a contemporary art museum.',
        hours: 'Open 10AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Roppongi_Hills.jpg',
        lat: 35.6605,
        lng: 139.7292,
        placeId: ''
      },
      {
        name: 'Tokyo Disneyland',
        description: 'Popular theme park with classic Disney attractions.',
        hours: 'Open 8AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Tokyo_Disneyland.jpg',
        lat: 35.6318,
        lng: 139.8804,
        placeId: ''
      },
      {
        name: 'Tokyo DisneySea',
        description: 'Unique Disney park with a nautical theme.',
        hours: 'Open 8AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Tokyo_DisneySea.jpg',
        lat: 35.6264,
        lng: 139.8824,
        placeId: ''
      },
      {
        name: 'Yoyogi Park',
        description: 'Large park ideal for picnics, jogging, and people-watching.',
        hours: 'Open 24 hours',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Yoyogi_Park.jpg',
        lat: 35.6712,
        lng: 139.6949,
        placeId: ''
      },
      {
        name: 'Odaiba',
        description: 'Man-made island with shopping, entertainment, and scenic views.',
        hours: 'Open 10AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Odaiba.jpg',
        lat: 35.6256,
        lng: 139.7764,
        placeId: ''
      },
      {
        name: 'TeamLab Borderless',
        description: 'Immersive digital art museum with interactive exhibits.',
        hours: 'Open 10AM - 7PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/TeamLab_Borderless.jpg',
        lat: 35.6249,
        lng: 139.7804,
        placeId: ''
      },
      {
        name: 'Edo-Tokyo Museum',
        description: 'Museum showcasing Tokyo\'s history from Edo period to present.',
        hours: 'Open 9:30AM - 5:30PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Edo-Tokyo_Museum.jpg',
        lat: 35.6966,
        lng: 139.7985,
        placeId: ''
      },
      {
        name: 'Ryogoku Kokugikan',
        description: 'Sumo wrestling arena with matches and museum.',
        hours: 'Open 9AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Ryogoku_Kokugikan.jpg',
        lat: 35.6966,
        lng: 139.7938,
        placeId: ''
      },
      {
        name: 'Sumida Aquarium',
        description: 'Modern aquarium with diverse marine life.',
        hours: 'Open 9AM - 9PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Sumida_Aquarium.jpg',
        lat: 35.7101,
        lng: 139.8107,
        placeId: ''
      },
      {
        name: 'Shinjuku Gyoen National Garden',
        description: 'Sprawling park with traditional Japanese gardens.',
        hours: 'Open 9AM - 4:30PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Shinjuku_Gyoen.jpg',
        lat: 35.6852,
        lng: 139.7101,
        placeId: ''
      },
      {
        name: 'Kabukicho',
        description: 'Lively entertainment district known for nightlife and dining.',
        hours: 'Open 24 hours',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Kabukicho.jpg',
        lat: 35.6963,
        lng: 139.7031,
        placeId: ''
      },
      {
        name: 'Nezu Museum',
        description: 'Art museum with a beautiful Japanese garden.',
        hours: 'Open 10AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Nezu_Museum.jpg',
        lat: 35.6641,
        lng: 139.7174,
        placeId: ''
      },
      {
        name: 'Tokyo Metropolitan Government Building',
        description: 'Observation decks offering panoramic views of Tokyo.',
        hours: 'Open 9:30AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Tokyo_Metropolitan_Government_Building.jpg',
        lat: 35.6895,
        lng: 139.6917,
        placeId: ''
      },
      {
        name: 'Nihonbashi',
        description: 'Historic commercial district with traditional shops and modern stores.',
        hours: 'Open 10AM - 8PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Nihonbashi.jpg',
        lat: 35.6848,
        lng: 139.7740,
        placeId: ''
      },
      {
        name: 'Hamarikyu Gardens',
        description: 'Beautiful landscape garden with a traditional tea house.',
        hours: 'Open 9AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Hamarikyu_Gardens.jpg',
        lat: 35.6595,
        lng: 139.7631,
        placeId: ''
      },
      {
        name: 'Ueno Zoo',
        description: 'Oldest zoo in Japan, located in Ueno Park.',
        hours: 'Open 9:30AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Ueno_Zoo.jpg',
        lat: 35.7178,
        lng: 139.7714,
        placeId: ''
      },
      {
        name: 'Tokyo Dome City',
        description: 'Entertainment complex with amusement park, shopping, and dining.',
        hours: 'Open 10AM - 9PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Tokyo_Dome_City.jpg',
        lat: 35.7042,
        lng: 139.7524,
        placeId: ''
      },
      {
        name: 'Asakusa Culture and Tourist Information Center',
        description: 'Information center with a free observation deck.',
        hours: 'Open 9AM - 8PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Asakusa_Culture_and_Tourist_Information_Center.jpg',
        lat: 35.7114,
        lng: 139.7960,
        placeId: ''
      },
      {
        name: 'Kappabashi Street',
        description: 'Street known for its stores selling kitchenware and restaurant supplies.',
        hours: 'Open 10AM - 6PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Kappabashi_Street.jpg',
        lat: 35.7135,
        lng: 139.7845,
        placeId: ''
      },

      {
        name: 'Rainbow Bridge',
        description: 'Iconic suspension bridge with stunning night views.',
        hours: 'Open 24 hours',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Rainbow_Bridge_2014.jpg',
        lat: 35.6368,
        lng: 139.7635,
        placeId: ''
      },
      {
        name: 'Zojoji Temple',
        description: 'Historic Buddhist temple located near Tokyo Tower.',
        hours: 'Open 6AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Zojoji_Temple.jpg',
        lat: 35.6586,
        lng: 139.7488,
        placeId: ''
      },
      {
        name: 'Yanaka Ginza',
        description: 'Old-fashioned shopping street with a retro atmosphere.',
        hours: 'Open 10AM - 7PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Yanaka_Ginza.jpg',
        lat: 35.7273,
        lng: 139.7708,
        placeId: ''
      },
      {
        name: 'Kyu Shiba Rikyu Garden',
        description: 'Beautifully landscaped garden near Hamamatsucho Station.',
        hours: 'Open 9AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Kyu_Shiba_Rikyu_Garden.jpg',
        lat: 35.6567,
        lng: 139.7585,
        placeId: ''
      },
      {
        name: 'Tokyo Character Street',
        description: 'Shopping area in Tokyo Station selling popular character goods.',
        hours: 'Open 10AM - 8PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Tokyo_Character_Street.jpg',
        lat: 35.6814,
        lng: 139.7670,
        placeId: ''
      },
      {
        name: 'Koishikawa Korakuen Garden',
        description: 'Historic Japanese garden with beautiful seasonal flowers.',
        hours: 'Open 9AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Koishikawa_Korakuen.jpg',
        lat: 35.7074,
        lng: 139.7519,
        placeId: ''
      },
      {
        name: 'Shinagawa Aquarium',
        description: 'Aquarium featuring a wide range of marine life exhibits.',
        hours: 'Open 10AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Shinagawa_Aquarium.jpg',
        lat: 35.6058,
        lng: 139.7384,
        placeId: ''
      },
      {
        name: 'Tokyo Joypolis',
        description: 'Indoor amusement park with virtual reality and arcade games.',
        hours: 'Open 10AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Tokyo_Joypolis.jpg',
        lat: 35.6272,
        lng: 139.7736,
        placeId: ''
      },
      {
        name: 'Hie Shrine',
        description: 'Beautiful Shinto shrine with impressive torii gates.',
        hours: 'Open 6AM - 5PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Hie_Shrine.jpg',
        lat: 35.6748,
        lng: 139.7387,
        placeId: ''
      },
      {
        name: 'Ghibli Museum',
        description: 'Museum dedicated to the works of Studio Ghibli.',
        hours: 'Open 10AM - 6PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Ghibli_Museum.jpg',
        lat: 35.6961,
        lng: 139.5702,
        placeId: ''
      },
      {
        name: 'Oedo Onsen Monogatari',
        description: 'Hot spring theme park offering a traditional Japanese bathhouse experience.',
        hours: 'Open 11AM - 9AM (next day)',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Oedo_Onsen_Monogatari.jpg',
        lat: 35.6194,
        lng: 139.7786,
        placeId: ''
      },
      {
        name: 'Mount Takao',
        description: 'Popular hiking destination with scenic views and temples.',
        hours: 'Open 24 hours',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mount_Takao.jpg',
        lat: 35.6258,
        lng: 139.2436,
        placeId: ''
      },
      {
        name: 'Tokyo Tower',
        description: 'Iconic landmark offering panoramic views of the city.',
        hours: 'Open 9AM - 11PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Tokyo_Tower.jpg',
        lat: 35.6586,
        lng: 139.7454,
        placeId: ''
      },
      {
        name: 'Samurai Museum',
        description: 'Museum showcasing samurai armor, weapons, and history.',
        hours: 'Open 10:30AM - 9PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Samurai_Museum.jpg',
        lat: 35.6954,
        lng: 139.7021,
        placeId: ''
      },
      {
        name: 'Shibuya Sky',
        description: 'Observation deck offering 360-degree views of Tokyo.',
        hours: 'Open 9AM - 11PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shibuya_Sky.jpg',
        lat: 35.6595,
        lng: 139.7004,
        placeId: ''
      },
      {
        name: 'Tokyo Ramen Street',
        description: 'Famous street in Tokyo Station dedicated to ramen shops.',
        hours: 'Open 11AM - 10PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Tokyo_Ramen_Street.jpg',
        lat: 35.6814,
        lng: 139.7670,
        placeId: ''
      },
      {
        name: 'Yanaka Cemetery',
        description: 'Historic cemetery known for its peaceful atmosphere and cherry blossoms.',
        hours: 'Open 24 hours',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Yanaka_Cemetery.jpg',
        lat: 35.7251,
        lng: 139.7656,
        placeId: ''
      },
      {
        name: 'Meguro River',
        description: 'Scenic river known for its beautiful cherry blossoms in spring.',
        hours: 'Open 24 hours',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Meguro_River.jpg',
        lat: 35.6422,
        lng: 139.7093,
        placeId: ''
      },
      {
        name: 'Tokyo Midtown',
        description: 'Modern complex with shopping, dining, and cultural facilities.',
        hours: 'Open 11AM - 9PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Tokyo_Midtown.jpg',
        lat: 35.6656,
        lng: 139.7301,
        placeId: ''
      },
      {
        name: 'Kichijoji',
        description: 'Vibrant neighborhood known for shopping, dining, and Inokashira Park.',
        hours: 'Open 10AM - 9PM',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Kichijoji.jpg',
        lat: 35.7033,
        lng: 139.5786,
        placeId: ''
      }
  ];

  const [itinerary, setItinerary] = useState(initialItinerary);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const [currentSuggestions] = useState([...suggestedPlaces]);
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
        const updatedItinerary = [...itinerary];
        for (let day of updatedItinerary) {
          for (let activity of day.activities) {
            try {
              const placeId = await fetchPlaceId(activity);
              activity.placeId = placeId;
            } catch (error) {
              console.error(`Failed to fetch place ID for ${activity.name}:`, error);
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
    const name = prompt('Enter the name of the new activity:', `New Activity ${itinerary[dayIndex].activities.length + 1}`);
    if (!name) return;
  
    const description = prompt('Enter the description for the new activity:') || '';
  
    const newItinerary = [...itinerary];
    const newActivity = {
      name: name,
      description: description,
      image: 'https://via.placeholder.com/150',
      lat: 37.5665,
      lng: 126.9780,
      placeId: ''
    };
    
    // const handleAddGreyBox = (dayIndex) => {
    // const newItinerary = [...itinerary];
    // const newActivity = {
    //   name: `New Activity ${newItinerary[dayIndex].activities.length + 1}`,
    //   description: 'Placeholder description for the new activity.',
    // };
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
    lat: 35.7042,
    lng: 139.7524,
  };

  const locations = itinerary.flatMap((day, dayIndex) =>
    day.activities.map((activity, activityIndex) => ({
      key: `day${dayIndex}-activity${activityIndex}`,
      location: { lat: activity.lat, lng: activity.lng },
      ...activity
    }))
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
