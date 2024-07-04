// import React from "react";
// import TopBanner from "../../components/banner";
// import ButtonComponent from "../../components/button";
// import "../home_page/homePage.css";





// export default function CommunityPage() {

//     return (
//         <div>Hello World</div>
//     )

// }

//celest new code no.4:
// import React, { useState } from "react";
// import TopBanner from "../components/banner";
// import CardComponent from "../components/card";
// import ButtonComponent from "../components/button";
// import "./communityPage.css";

import React, { useState } from "react";
import TopBanner from "../../components/banner";
import ButtonComponent from "../../components/button";
import CardComponent from "../../components/card";
import '../home_page/homePage.css'; 
import { useNavigate } from "react-router-dom";

function CommunityPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    const itineraries = [
        {
            image: "card_images/bali-image.jpg",
            location: "Bali",
            priceRange: "$200 - $700",
            likes: 241,
        },
        {
            image: "card_images/france-image.jpg",
            location: "France",
            priceRange: "$500 - $1200",
            likes: 532,
        },
        {
            image: "card_images/hawaii-image.jpg",
            location: "Hawaii",
            priceRange: "$700 - $1500",
            likes: 421,
        },
    ];

    const filteredItineraries = itineraries.filter(trip => {
        return trip.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === "all" || filter === trip.priceRange);
    });

    return (
        <div className="community-page">
            <TopBanner />
            <div>
                {/* <div className="halfWidth leftAlign"> */}

                
                    <h1>Find Your Next Trip!</h1>
                    <p>Explore other trips created by fellow travelers.</p>
                    <input
                        type="text"
                        placeholder="Search Destination"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="filter-bar"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="$200 - $700">$200 - $700</option>
                        <option value="$500 - $1200">$500 - $1200</option>
                        <option value="$700 - $1500">$700 - $1500</option>
                    </select>
                    <h2>Recommended Itineraries</h2>
                    <div className="itineraries">
                        {filteredItineraries.map((trip, index) => (
                            <div key={index} className="card-container">
                                <CardComponent
                                    image={trip.image}
                                    location={trip.location}
                                    priceRange={trip.priceRange}
                                    likes={trip.likes}
                                />
                                <ButtonComponent text="Copy to My Trips" />
                            </div>
                        ))}
                    </div>
                {/* </div> */}
            </div>
        </div>
    );
}

export default CommunityPage;