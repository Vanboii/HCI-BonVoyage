import React, { useEffect, useState } from "react";
import HomePageBanner from '../../components/homepagebanner';
import ButtonComponent from '../../components/button';
import './homePage.css';

const images = [
    require('../../components/homepage_slideshow/cebu_slideshow.jpg'),
    require('../../components/homepage_slideshow/singapore_slideshow.jpg'),
    require('../../components/homepage_slideshow/hawaii_slideshow.jpg'),
    require('../../components/homepage_slideshow/jeju_slideshow.jpg'),
    require('../../components/homepage_slideshow/maldives_slideshow.jpg'),
    require('../../components/homepage_slideshow/mountain_slideshow.jpg'),
    require('../../components/homepage_slideshow/switzerland_slideshow.jpg'),
    require('../../components/homepage_slideshow/newzealand_slideshow.jpg'),
    require('../../components/homepage_slideshow/norway_slideshow.jpg')
];

function HomePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true); // Initial fade state set to true

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fading out the current image
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFade(true); // Start fading in the next image after a delay
            }, 300); // Delay before fading in the next image (match your CSS transition duration)
        }, 6000); // Interval between image changes

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <>
            <HomePageBanner />
            <div id="main" className={fade ? 'fade' : ''} style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
                <div className="col centerAlign">
                    <h1>Bon Voyage</h1>
                    <ButtonComponent type="2" text="Start Planning" toPage="/planning/trip_detail" />
                </div>
            </div>
        </>
    );
}

export default HomePage;

