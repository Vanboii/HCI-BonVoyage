// import React from "react";
// import TopBanner from "../../components/banner";
// import ButtonComponent from "../../components/button";
// import "./homePage.css";


//celest new code (1) - no tabs
// import React from "react";
// import TopBanner from "../../components/banner";
// import CardComponent from "../../components/card";
// import baliImage from '../../components/card_images/bali-image.jpg';
// import franceImage from '../../components/card_images/france-image.jpg';
// import cebuImage from '../../components/card_images/cebu-image.jpg';
// import hawaiiImage from '../../components/card_images/hawaii-image.jpg';
// import "./mytripsPage.css";

// function MyTripsPage() {
//     return (
//         <div>
//             <TopBanner />
//             <div className="page-content">
//                 <div className="search-filter-bar">
//                     <input type="text" placeholder="Search Destination" className="search-bar"/>
//                     <div className="filter">
//                         <button>Filter</button>
//                         <div className="filter-options">
//                             <button>Higher to Lowest Budget</button>
//                             <button>Lowest to Highest Budget</button>
//                             <button>Most Liked</button>
//                             <button>Least Liked</button>
//                             <button>Manual Filter</button>
//                         </div>
//                     </div>
//                 </div>
//                 <h1>Upcoming Trips</h1>
//                 <div className="cards-container">
//                     <CardComponent image={baliImage} location="Bali" priceRange="$200-$700" saves="20"/>
//                     <CardComponent image={franceImage} location="France" priceRange="$500-$1000" saves="15"/>
//                 </div>
//                 <h1>Past Trips</h1>
//                 <div className="cards-container">
//                     <CardComponent image={hawaiiImage} location="Hawaii" priceRange="$700-$1500" saves="25"/>
//                 </div>
//                 <h1>Saved Trips</h1>
//                 <div className="cards-container">
//                     <CardComponent image={cebuImage} location="Cebu" priceRange="$300-$800" saves="10"/>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MyTripsPage;


// celest new code (2) - tabs (WORKING!)
import React, { useState } from 'react';
import TopBanner from '../../components/banner';
import ButtonComponent from '../../components/button';
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
  { image: Cebu_Image, location: 'Cebu', priceRange: '$700 - $1500', saves: 2 },
  { image: Finland_Image, location: 'Finland', priceRange: '$4000 - $8800', saves: 5 }, // Added Finland image
];

const pastTrips = [
  { image: Kyoto_Image, location: 'Kyoto', priceRange: '$2000 - $5200', saves: 8 },
  { image: Maldives_Image, location: 'Maldives', priceRange: '$1500 - $2000', saves: 0 },
  { image: Genting_Image, location: 'Genting', priceRange: '$500 - $1200', saves: 0 }, // Added Genting image
  { image: Melbourne_Image, location: 'Melbourne', priceRange: '$6000 - $8500', saves: 0 }, // Added Melbourne image
  { image: Phuket_Image, location: 'Phuket', priceRange: '$600 - $1400', saves: 0 }, // Added Phuket image
  { image: NewYork_Image, location: 'New York', priceRange: '$6000 - $9000', saves: 6 }, // Added New York image
];

const savedTrips = [
  { image: Bali_Image, location: 'Bali', priceRange: '$200 - $700', saves: 242 },
];

const MyTripsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrips, setFilteredTrips] = useState(upcomingTrips);
  const [maxBudget, setMaxBudget] = useState(50000); // Assuming the max budget is 50000

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    if (tab === 'upcoming') setFilteredTrips(upcomingTrips);
    if (tab === 'past') setFilteredTrips(pastTrips);
    if (tab === 'saved') setFilteredTrips(savedTrips);
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
        <div className="title-container">
          {activeTab === 'upcoming' && <h1 className="title">Upcoming Trips</h1>}
          {activeTab === 'past' && <h1 className="title">Past Trips</h1>}
          {activeTab === 'saved' && <h1 className="title">Saved Trips</h1>}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTripsPage;




