import React, { useEffect, useState } from "react";
import TopBanner from '../../components/homepagebanner';
import ButtonComponent from '../../components/button';
import './homePage.css';
import HomePageBanner from "../../components/homepagebanner";
// Import SVG files as URLs
const images = [
    {
        src: require('../../components/homepage_slideshow/cebu_slideshow.svg').default,
        name: "Cebu, Philippines",
    },
    {
        src: require('../../components/homepage_slideshow/singapore_slideshow.svg').default,
        name: "Singapore",
    },
    {
        src: require('../../components/homepage_slideshow/hawaii_slideshow.svg').default,
        name: "Hawaii, United States",
    },
    {
        src: require('../../components/homepage_slideshow/jeju_slideshow.svg').default,
        name: "Jeju, Korea",
    },
    {
        src: require('../../components/homepage_slideshow/maldives_slideshow.svg').default,
        name: "Maldives",
    },
    {
        src: require('../../components/homepage_slideshow/mountain_slideshow.svg').default,
        name: "Mountain Escapes",
    },
    {
        src: require('../../components/homepage_slideshow/switzerland_slideshow.svg').default,
        name: "Bern, Switzerland",
    },
    {
        src: require('../../components/homepage_slideshow/newzealand_slideshow.svg').default,
        name: "Auckland, New Zealand",
    },
    {
        src: require('../../components/homepage_slideshow/norway_slideshow.svg').default,
        name: "Preikestolen, Norway",
    }
];

function HomePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 6000); // Interval to change image every 6 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const handlePrevious = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <>
            {/* <TopBanner /> */}
            <div id="main">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`background-image ${index === currentImageIndex ? "visible" : ""}`}
                        style={{ backgroundImage: `url(${image.src})` }}
                    />
                ))}
                <div className="overlay"></div>
                <div className="col centerAlign">
                    <h1>Bon Voyage</h1>
                    <ButtonComponent type="2" text="Start Planning" toPage="/planning/trip_detail" />
                </div>
                <div className="place-name">
                    <h2>{images[currentImageIndex].name}</h2>
                </div>
                <div className="navigation-container">
                    <button className="nav-button" onClick={handlePrevious}>❮</button>
                    <div className="nav-line"></div>
                    <button className="nav-button" onClick={handleNext}>❯</button>
                </div>
            </div>
        </>
    );
}

export default HomePage;
