// import React from "react";
// import "./card.css";

// const CardComponent = ({ image, location, priceRange, saves, travelers }) => {
//     const caption = "Picture of " + location;
//     const travelerText = travelers === 1 ? "traveler" : "travelers";

//     return (
//         <div className="card">
//             <img src={image} alt={caption} className="card-image" />
//             <div className="card-details">
//                 <h2>{location}</h2>
//                 <p>{priceRange}</p>
//                 <p>{saves} Saves</p>
//                 <p>{travelers} {travelerText}</p> {/* Display travelers or traveler based on count */}
//             </div>
//         </div>
//     );
// };

// export default CardComponent;




//new card that has save to saved trips button- working functions, wrong layout
// card.js
// import React from "react";
// import "./card.css";

// const CardComponent = ({ image, location, priceRange, saves, travelers, onSave }) => {
//     const caption = "Picture of " + location;
//     const travelerText = travelers === 1 ? "traveler" : "travelers";

//     return (
//         <div className="card">
//             <img src={image} alt={caption} className="card-image" />
//             <div className="card-details">
//                 <h2>{location}</h2>
//                 <p>{priceRange}</p>
//                 <p>{saves} Saves</p>
//                 <p>{travelers} {travelerText}</p> {/* Display travelers or traveler based on count */}
//                 <button onClick={onSave}>Save to My Trips</button>
//             </div>
//         </div>
//     );
// };

// export default CardComponent;



//THIS WORKS EXCEPT SAVES +1 /-1
import React from "react";
import "./card.css";

const CardComponent = ({ image, location, priceRange, saves, travelers, showSaveButton, showDeleteButton, onSave, onDelete, onClick }) => {
    const caption = "Picture of " + location;
    const travelerText = travelers === 1 ? "traveler" : "travelers";

    return (
        <div className="card" onClick={onClick}>
            <img src={image} alt={caption} className="card-image" />
            <div className="card-details">
                <h2>{location}</h2>
                <p>{priceRange}</p>
                <p>{saves} Saves</p>
                <p>{travelers} {travelerText}</p>
                {showSaveButton && <button onClick={onSave}>Save to My Trips</button>}
                {showDeleteButton && <button onClick={onDelete}>Delete from Saved Trips</button>}
            </div>
        </div>
    );
};

export default CardComponent;



