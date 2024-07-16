// import React, { useState } from 'react';
// import TopBanner from '../../components/banner';
// import CardComponent from '../../components/card';
// import Bali_Image from "../../components/card_images/bali-image.jpg";
// import Cebu_Image from "../../components/card_images/cebu-image.jpg";
// import Kyoto_Image from "../../components/card_images/kyoto-image.jpg";
// import Maldives_Image from "../../components/card_images/maldives-image.jpeg";
// import Genting_Image from "../../components/card_images/genting-image.jpg";
// import Melbourne_Image from "../../components/card_images/melbourne-image.jpg";
// import Phuket_Image from "../../components/card_images/phuket-image.jpg";
// import NewYork_Image from "../../components/card_images/newyork-image.jpg";
// import Finland_Image from "../../components/card_images/finland-image.jpg";
// import './mytripsPage.css';

// const upcomingTrips = [
//   { image: Cebu_Image, location: 'Cebu, Philippines', priceRange: '$700 - $1500', saves: 2, travelers: 1 },
//   { image: Finland_Image, location: 'Finland', priceRange: '$4000 - $8800', saves: 5, travelers: 2 },
// ];

// const pastTrips = [
//   { image: Kyoto_Image, location: 'Kyoto, Japan', priceRange: '$2000 - $5200', saves: 8, travelers: 1 },
//   { image: Maldives_Image, location: 'Maldives', priceRange: '$1500 - $2000', saves: 0, travelers: 1 },
//   { image: Genting_Image, location: 'Genting, Malaysia', priceRange: '$700 - $2230', saves: 0, travelers: 2 },
//   { image: Melbourne_Image, location: 'Melbourne, Australia', priceRange: '$6000 - $8500', saves: 0, travelers: 1 },
//   { image: Phuket_Image, location: 'Phuket, Thailand', priceRange: '$600 - $2600', saves: 0, travelers: 1 },
//   { image: NewYork_Image, location: 'New York, United States', priceRange: '$6000 - $12600', saves: 6, travelers: 2 },
// ];

// const savedTrips = [
//   { image: Bali_Image, location: 'Bali, Indonesia', priceRange: '$200 - $700', saves: 242, travelers: 1 },
// ];

// const MyTripsPage = () => {
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredTrips, setFilteredTrips] = useState(upcomingTrips);
//   const [maxBudget, setMaxBudget] = useState(20000);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//     if (tab === 'upcoming') setFilteredTrips(upcomingTrips);
//     if (tab === 'past') setFilteredTrips(pastTrips);
//     if (tab === 'saved') setFilteredTrips(savedTrips);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const trips = activeTab === 'upcoming' ? upcomingTrips : activeTab === 'past' ? pastTrips : savedTrips;
//     setFilteredTrips(trips.filter(trip => trip.location.toLowerCase().includes(e.target.value.toLowerCase())));
//   };

//   const handleFilter = (filter) => {
//     const trips = activeTab === 'upcoming' ? upcomingTrips : activeTab === 'past' ? pastTrips : savedTrips;
//     if (filter === 'highest') {
//       setFilteredTrips([...trips].sort((a, b) => parseInt(b.priceRange.split('-')[1].trim().slice(1)) - parseInt(a.priceRange.split('-')[1].trim().slice(1))));
//     } else if (filter === 'lowest') {
//       setFilteredTrips([...trips].sort((a, b) => parseInt(a.priceRange.split('-')[0].trim().slice(1)) - parseInt(b.priceRange.split('-')[0].trim().slice(1))));
//     } else {
//       setFilteredTrips(trips.filter(trip => {
//         const maxPrice = parseInt(trip.priceRange.split('-')[1].trim().slice(1));
//         return maxPrice <= maxBudget;
//       }));
//     }
//   };

//   const handleSliderChange = (e) => {
//     setMaxBudget(e.target.value);
//     handleFilter('budget');
//   };

//   return (
//     <div>
//       <TopBanner />
//       <div className="page-content">
//         <div className="mytrips-tabs">
//           <div
//             className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
//             onClick={() => handleTabClick('upcoming')}
//           >
//             Upcoming Trips
//           </div>
//           <div
//             className={`tab ${activeTab === 'past' ? 'active' : ''}`}
//             onClick={() => handleTabClick('past')}
//           >
//             Past Trips
//           </div>
//           <div
//             className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
//             onClick={() => handleTabClick('saved')}
//           >
//             Saved Trips
//           </div>
//         </div>
//         <div className="search-filter-container">
//           <input
//             type="text"
//             className="search-bar"
//             placeholder="Search Destination"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <div className="filter">
//             <button>Filter</button>
//             <div className="filter-options">
//               <button onClick={() => handleFilter('highest')}>Highest to Lowest Budget</button>
//               <button onClick={() => handleFilter('lowest')}>Lowest to Highest Budget</button>
//               <div className="slider-container">
//                 <label>Budget Slider</label>
//                 <div>Maximum Budget ${maxBudget}</div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="15000"
//                   value={maxBudget}
//                   onChange={handleSliderChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="trips-cards">
//           {filteredTrips.map((trip, index) => (
//             <CardComponent
//               key={index}
//               className="card-component"
//               image={trip.image}
//               location={trip.location}
//               priceRange={trip.priceRange}
//               saves={trip.saves}
//               travelers={trip.travelers}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyTripsPage;








//THIS WORKS EXCEPT SAVES +1 /-1
// import React, { useState, useEffect } from 'react';
// import TopBanner from '../../components/banner';
// import CardComponent from '../../components/card';
// import Bali_Image from "../../components/card_images/bali-image.jpg";
// import Cebu_Image from "../../components/card_images/cebu-image.jpg";
// import Kyoto_Image from "../../components/card_images/kyoto-image.jpg";
// import Maldives_Image from "../../components/card_images/maldives-image.jpeg";
// import Genting_Image from "../../components/card_images/genting-image.jpg";
// import Melbourne_Image from "../../components/card_images/melbourne-image.jpg";
// import Phuket_Image from "../../components/card_images/phuket-image.jpg";
// import NewYork_Image from "../../components/card_images/newyork-image.jpg";
// import Finland_Image from "../../components/card_images/finland-image.jpg";
// import './mytripsPage.css';

// const upcomingTrips = [
//   { image: Cebu_Image, location: 'Cebu, Philippines', priceRange: '$700 - $1500', saves: 2, travelers: 1 },
//   { image: Finland_Image, location: 'Finland', priceRange: '$4000 - $8800', saves: 5, travelers: 2 },
// ];

// const pastTrips = [
//   { image: Kyoto_Image, location: 'Kyoto, Japan', priceRange: '$2000 - $5200', saves: 8, travelers: 1 },
//   { image: Maldives_Image, location: 'Maldives', priceRange: '$1500 - $2000', saves: 0, travelers: 1 },
//   { image: Genting_Image, location: 'Genting, Malaysia', priceRange: '$700 - $2230', saves: 0, travelers: 2 },
//   { image: Melbourne_Image, location: 'Melbourne, Australia', priceRange: '$6000 - $8500', saves: 0, travelers: 1 },
//   { image: Phuket_Image, location: 'Phuket, Thailand', priceRange: '$600 - $2600', saves: 0, travelers: 1 },
//   { image: NewYork_Image, location: 'New York, United States', priceRange: '$6000 - $12600', saves: 6, travelers: 2 },
// ];

// const savedTripsFromLocalStorage = JSON.parse(localStorage.getItem('savedTrips')) || [
//   { image: Bali_Image, location: 'Bali, Indonesia', priceRange: '$200 - $700', saves: 242, travelers: 1 },
// ];

// const MyTripsPage = () => {
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredTrips, setFilteredTrips] = useState(upcomingTrips);
//   const [maxBudget, setMaxBudget] = useState(20000);
//   const [savedTrips, setSavedTrips] = useState(savedTripsFromLocalStorage);

//   useEffect(() => {
//     if (activeTab === 'saved') {
//       const savedTripsFromStorage = JSON.parse(localStorage.getItem('savedTrips')) || [];
//       setSavedTrips(savedTripsFromStorage);
//       setFilteredTrips(savedTripsFromStorage);
//     }
//   }, [activeTab]);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//     if (tab === 'upcoming') setFilteredTrips(upcomingTrips);
//     if (tab === 'past') setFilteredTrips(pastTrips);
//     if (tab === 'saved') setFilteredTrips(savedTrips);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const trips = activeTab === 'upcoming' ? upcomingTrips : activeTab === 'past' ? pastTrips : savedTrips;
//     setFilteredTrips(trips.filter(trip => trip.location.toLowerCase().includes(e.target.value.toLowerCase())));
//   };

//   const handleFilter = (filter) => {
//     const trips = activeTab === 'upcoming' ? upcomingTrips : activeTab === 'past' ? pastTrips : savedTrips;
//     if (filter === 'highest') {
//       setFilteredTrips([...trips].sort((a, b) => parseInt(b.priceRange.split('-')[1].trim().slice(1)) - parseInt(a.priceRange.split('-')[1].trim().slice(1))));
//     } else if (filter === 'lowest') {
//       setFilteredTrips([...trips].sort((a, b) => parseInt(a.priceRange.split('-')[0].trim().slice(1)) - parseInt(b.priceRange.split('-')[0].trim().slice(1))));
//     } else {
//       setFilteredTrips(trips.filter(trip => {
//         const maxPrice = parseInt(trip.priceRange.split('-')[1].trim().slice(1));
//         return maxPrice <= maxBudget;
//       }));
//     }
//   };

//   const handleSliderChange = (e) => {
//     setMaxBudget(e.target.value);
//     handleFilter('budget');
//   };

//   const handleDelete = (index) => {
//     const updatedTrips = savedTrips.filter((_, i) => i !== index);
//     setSavedTrips(updatedTrips);
//     localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
//     setFilteredTrips(updatedTrips);
//   };

//   return (
//     <div>
//       <TopBanner />
//       <div className="page-content">
//         <div className="mytrips-tabs">
//           <div
//             className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
//             onClick={() => handleTabClick('upcoming')}
//           >
//             Upcoming Trips
//           </div>
//           <div
//             className={`tab ${activeTab === 'past' ? 'active' : ''}`}
//             onClick={() => handleTabClick('past')}
//           >
//             Past Trips
//           </div>
//           <div
//             className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
//             onClick={() => handleTabClick('saved')}
//           >
//             Saved Trips
//           </div>
//         </div>
//         <div className="search-filter-container">
//           <input
//             type="text"
//             className="search-bar"
//             placeholder="Search Destination"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <div className="filter">
//             <button>Filter</button>
//             <div className="filter-options">
//               <button onClick={() => handleFilter('highest')}>Highest to Lowest Budget</button>
//               <button onClick={() => handleFilter('lowest')}>Lowest to Highest Budget</button>
//               <div className="slider-container">
//                 <label>Budget Slider</label>
//                 <div>Maximum Budget ${maxBudget}</div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="15000"
//                   value={maxBudget}
//                   onChange={handleSliderChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="trips-cards">
//           {filteredTrips.map((trip, index) => (
//             <CardComponent
//               key={index}
//               className="card-component"
//               image={trip.image}
//               location={trip.location}
//               priceRange={trip.priceRange}
//               saves={trip.saves}
//               travelers={trip.travelers}
//               showSaveButton={false}
//               showDeleteButton={activeTab === 'saved'}
//               onDelete={() => handleDelete(index)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyTripsPage;



//trying to get saves to work
import React, { useState, useEffect } from 'react';
import TopBanner from '../../components/banner';
import CardComponent from '../../components/card';
import Bali_Image from "../../components/card_images/bali-image.jpg";
import Cebu_Image from "../../components/card_images/cebu-image.jpg";
import Kyoto_Image from "../../components/card_images/kyoto-image.jpg";
import Maldives_Image from "../../components/card_images/maldives-image.jpeg";
import Genting_Image from "../../components/card_images/genting-image.jpg";
import Melbourne_Image from "../../components/card_images/melbourne-image.jpg";
import Phuket_Image from "../../components/card_images/phuket-image.jpg";
import NewYork_Image from "../../components/card_images/newyork-image.jpg";
import Finland_Image from "../../components/card_images/finland-image.jpg";
import './mytripsPage.css';

const upcomingTrips = [
  { image: Cebu_Image, location: 'Cebu, Philippines', priceRange: '$700 - $1500', saves: 2, travelers: 1 },
  { image: Finland_Image, location: 'Finland', priceRange: '$4000 - $8800', saves: 5, travelers: 2 },
];

const pastTrips = [
  { image: Kyoto_Image, location: 'Kyoto, Japan', priceRange: '$2000 - $5200', saves: 8, travelers: 1 },
  { image: Maldives_Image, location: 'Maldives', priceRange: '$1500 - $2000', saves: 0, travelers: 1 },
  { image: Genting_Image, location: 'Genting, Malaysia', priceRange: '$700 - $2230', saves: 0, travelers: 2 },
  { image: Melbourne_Image, location: 'Melbourne, Australia', priceRange: '$6000 - $8500', saves: 0, travelers: 1 },
  { image: Phuket_Image, location: 'Phuket, Thailand', priceRange: '$600 - $2600', saves: 0, travelers: 1 },
  { image: NewYork_Image, location: 'New York, United States', priceRange: '$6000 - $12600', saves: 6, travelers: 2 },
];

const MyTripsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrips, setFilteredTrips] = useState(upcomingTrips);
  const [maxBudget, setMaxBudget] = useState(20000);
  const [savedTrips, setSavedTrips] = useState(JSON.parse(localStorage.getItem('savedTrips')) || []);

  useEffect(() => {
    if (activeTab === 'saved') {
      const savedTripsFromStorage = JSON.parse(localStorage.getItem('savedTrips')) || [];
      setSavedTrips(savedTripsFromStorage);
      setFilteredTrips(savedTripsFromStorage);
    } else if (activeTab === 'upcoming') {
      setFilteredTrips(upcomingTrips);
    } else if (activeTab === 'past') {
      setFilteredTrips(pastTrips);
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const trips = activeTab === 'upcoming' ? upcomingTrips : activeTab === 'past' ? pastTrips : savedTrips;
    setFilteredTrips(trips.filter(trip => trip.location.toLowerCase().includes(e.target.value.toLowerCase())));
  };

  const handleFilter = (filter) => {
    const trips = activeTab === 'upcoming' ? upcomingTrips : activeTab === 'past' ? pastTrips : savedTrips;
    if (filter === 'highest') {
      setFilteredTrips([...trips].sort((a, b) => parseInt(b.priceRange.split('-')[1].trim().slice(1)) - parseInt(a.priceRange.split('-')[1].trim().slice(1))));
    } else if (filter === 'lowest') {
      setFilteredTrips([...trips].sort((a, b) => parseInt(a.priceRange.split('-')[0].trim().slice(1)) - parseInt(b.priceRange.split('-')[0].trim().slice(1))));
    } else {
      setFilteredTrips(trips.filter(trip => {
        const maxPrice = parseInt(trip.priceRange.split('-')[1].trim().slice(1));
        return maxPrice <= maxBudget;
      }));
    }
  };

  const handleSliderChange = (e) => {
    setMaxBudget(e.target.value);
    handleFilter('budget');
  };

  const handleDelete = (index) => {
    const updatedTrips = [...savedTrips];
    updatedTrips.splice(index, 1);
    setSavedTrips(updatedTrips);
    setFilteredTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
  };

  return (
    <div>
      <TopBanner />
      <div className="page-content">
        <div className="mytrips-tabs">
          <div
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleTabClick('upcoming')}
          >
            Upcoming Trips
          </div>
          <div
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => handleTabClick('past')}
          >
            Past Trips
          </div>
          <div
            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => handleTabClick('saved')}
          >
            Saved Trips
          </div>
        </div>
        <div className="search-filter-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Destination"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="filter">
            <button>Filter</button>
            <div className="filter-options">
              <button onClick={() => handleFilter('highest')}>Highest to Lowest Budget</button>
              <button onClick={() => handleFilter('lowest')}>Lowest to Highest Budget</button>
              <div className="slider-container">
                <label>Budget Slider</label>
                <div>Maximum Budget ${maxBudget}</div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  value={maxBudget}
                  onChange={handleSliderChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="trips-cards">
          {filteredTrips.map((trip, index) => (
            <CardComponent
              key={index}
              className="card-component"
              image={trip.image}
              location={trip.location}
              priceRange={trip.priceRange}
              saves={trip.saves}
              travelers={trip.travelers}
              showSaveButton={false}
              showDeleteButton={activeTab === 'saved'}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTripsPage;

