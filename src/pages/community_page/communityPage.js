
///NEW!!!!!!!!!!!!!!!!!!!!!!!!! for changing filter and fixing layout
import React, { useState } from "react";
import TopBanner from "../../components/banner";
import ButtonComponent from "../../components/button";
import CardComponent from "../../components/card";
import Bali_Image from "../../components/card_images/bali-image.jpg";
import France_Image from "../../components/card_images/france-image.jpg";
import Hawaii_Image from "../../components/card_images/hawaii-image.jpg";
import Jeju_Image from "../../components/card_images/jeju-image.jpg";
import Laos_Image from "../../components/card_images/laos-image.jpg";
import './communityPage.css';

function CommunityPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [maxBudget, setMaxBudget] = useState(15000);

    const itineraries = [
        {
            image: Bali_Image,
            location: "Bali, Indonesia",
            priceRange: "$200 - $700",
            saves: 241,
            travelers: 5, // Example number of travelers
        },
        {
            image: France_Image,
            location: "France",
            priceRange: "$500 - $1200",
            saves: 532,
            travelers: 4, // Example number of travelers
        },
        {
            image: Hawaii_Image,
            location: "Hawaii, United States",
            priceRange: "$700 - $1500",
            saves: 421,
            travelers: 2, // Example number of travelers
        },
        {
            image: Jeju_Image,
            location: "Jeju, Korea",
            priceRange: "$1200 - $2000",
            saves: 452,
            travelers: 4, // Example number of travelers
        },
        {
            image: Laos_Image,
            location: "Laos",
            priceRange: "$900 - $2300",
            saves: 51,
            travelers: 1, // Example number of travelers
        },
    ];

    const filteredItineraries = itineraries
        .filter(trip => trip.location.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(trip => {
            const price = parseInt(trip.priceRange.split(' - ')[1].replace('$', ''));
            return price <= maxBudget;
        })
        .sort((a, b) => {
            switch (filter) {
                case "Most Saved":
                    return b.saves - a.saves;
                case "Highest to Lowest Budget":
                    return parseInt(b.priceRange.split(' - ')[1].replace('$', '')) - parseInt(a.priceRange.split(' - ')[1].replace('$', ''));
                case "Lowest to Highest Budget":
                    return parseInt(a.priceRange.split(' - ')[1].replace('$', '')) - parseInt(b.priceRange.split(' - ')[1].replace('$', ''));
                default:
                    return 0;
            }
        });

    return (
        <div className="community-page">
            {/* <TopBanner /> */}
            <div className="content-community">
                <h1>Find Your Next Trip!</h1>
                <p>Explore other trips created by fellow travelers.</p>
                <div className="search-filter-container">
                    <input
                        type="text"
                        placeholder="Search Destination"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="filter">
                        <button className="filter-button">Filter</button>
                        <div className="filter-options">
                            <button onClick={() => setFilter("Most Saved")}>Most Saved</button>
                            <button onClick={() => setFilter("Highest to Lowest Budget")}>Highest to Lowest Budget</button>
                            <button onClick={() => setFilter("Lowest to Highest Budget")}>Lowest to Highest Budget</button>
                            <div className="slider-container">
                                <label>Budget Slider</label>
                                <div>Maximum Budget ${maxBudget}</div>
                                <input
                                    type="range"
                                    min="0"
                                    max="15000"
                                    value={maxBudget}
                                    onChange={(e) => setMaxBudget(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <h2>Recommended Itineraries</h2>
                <div className="itineraries">
                    {filteredItineraries.map((trip, index) => (
                        <div key={index} className="card-container">
                            <CardComponent
                                className="card-component"
                                image={trip.image}
                                location={trip.location}
                                priceRange={trip.priceRange}
                                saves={trip.saves}
                                travelers={trip.travelers} // Pass travelers prop
                            />
                            <ButtonComponent className="button-component" text="Save To My Trips" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityPage;
