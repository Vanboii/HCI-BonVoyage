import React from "react";
import "./card.css";

const CardComponent = ({ image, location, priceRange, saves, travelers }) => {
    const caption = "Picture of " + location;
    const travelerText = travelers === 1 ? "traveler" : "travelers";

    return (
        <div className="card">
            <img src={image} alt={caption} className="card-image" />
            <div className="card-details">
                <h2>{location}</h2>
                <p>{priceRange}</p>
                <p>{saves} Saves</p>
                <p>{travelers} {travelerText}</p> {/* Display travelers or traveler based on count */}
            </div>
        </div>
    );
};

export default CardComponent;





