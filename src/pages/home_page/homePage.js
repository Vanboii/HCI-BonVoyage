import React, { useEffect, useState } from "react";
import TopBanner from '../../components/homepagebanner';
import ButtonComponent from '../../components/button';
import './homePage.css';

// Import SVG files as URLs
const images = [
    require('../../components/homepage_slideshow/cebu_slideshow.svg').default,
    require('../../components/homepage_slideshow/singapore_slideshow.svg').default,
    require('../../components/homepage_slideshow/hawaii_slideshow.svg').default,
    require('../../components/homepage_slideshow/jeju_slideshow.svg').default,
    require('../../components/homepage_slideshow/maldives_slideshow.svg').default,
    require('../../components/homepage_slideshow/mountain_slideshow.svg').default,
    require('../../components/homepage_slideshow/switzerland_slideshow.svg').default,
    require('../../components/homepage_slideshow/newzealand_slideshow.svg').default,
    require('../../components/homepage_slideshow/norway_slideshow.svg').default
];

function HomePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 6000); // Interval to change image every 6 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <>
            <TopBanner />
            <div id="main">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`background-image ${index === currentImageIndex ? "visible" : ""}`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
                <div className="overlay"></div>
                <div className="col centerAlign">
                    <h1>Bon Voyage</h1>
                    <ButtonComponent type="2" text="Start Planning" toPage="/planning/trip_detail" />
                </div>
            </div>
        </>
    );
}

export default HomePage;
