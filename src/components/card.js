import React from "react";
import ButtonComponent from "../components/button";
import "./card.css";



const Cardcomponent = ({image='path', location="name", priceRange="xxx-yyy", likes="241"}) => {

    const caption = "Picture of " + location

    return (
        <>
        <img src={image} alt={caption} />
        <div className="row">
            <h2>{location}</h2>
            <p>Likes + 'Heart'</p> 
        </div>
        </>
    );

}

export default Cardcomponent;