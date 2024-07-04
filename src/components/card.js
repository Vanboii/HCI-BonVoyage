// import React from "react";
// import ButtonComponent from "../components/button";
// import "./card.css";



// const Cardcomponent = ({image='path', location="name", priceRange="xxx-yyy", likes="241"}) => {

//     const caption = "Picture of " + location

//     return (
//         <>
//         <img src={image} alt={caption} />
//         <div className="row">
//             <h2>{location}</h2>
//             <p>Likes + 'Heart'</p> 
//         </div>
//         </>
//     );

// }

// export default Cardcomponent;


// New code (celest for community page)
import React from "react";
import ButtonComponent from "../components/button";
import "./card.css";

const CardComponent = ({ image, location, priceRange, likes }) => {
    const caption = "Picture of " + location;

    return (
        <div className="card">
            <img src={image} alt={caption} className="card-image" />
            <div className="card-details">
                <h2>{location}</h2>
                <p>{priceRange}</p>
                <p>{likes} Likes</p>
            </div>
        </div>
    );
};

export default CardComponent;



//trying old one again
//New code (celest for community page)

// import React from "react";
// import ButtonComponent from "../components/button";
// import "./card.css";

// const CardComponent = ({ image, location, priceRange, likes }) => {
//     const caption = "Picture of " + location;

//     return (
//         <div className="card">
//             <img src={image} alt={caption} className="card-image" />
//             <div className="card-details">
//                 <h2>{location}</h2>
//                 <p>{priceRange}</p>
//                 <p>{likes} Likes</p>
//             </div>
//         </div>
//     );
// };

// export default CardComponent;

// (previous code):
// import React from "react";
// import ButtonComponent from "../components/button";
// import "./card.css";



// const Cardcomponent = ({image='path', location="name", priceRange="xxx-yyy", likes="241"}) => {

//     const caption = "Picture of " + location

//     return (
//         <>
//         <img src={image} alt={caption} />
//         <div className="row">
//             <h2>{location}</h2>
//             <p>Likes + 'Heart'</p> 
//         </div>
//         </>
//     );

// }

// export default Cardcomponent;

