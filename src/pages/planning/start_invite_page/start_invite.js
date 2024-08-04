import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../../useHooks/useItineraries';
import './start_invite.css';
import TopBanner from '../../../components/banner';
import coupletravel from '../../../components/coupletravel.png';
import { auth } from '../../../firebase';

const InviteStart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItinerary } = useItinerary();

  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      const details = await getItinerary(id);
      if (details) {
        console.log('Itinerary details:', details);
        setCountry(details.country || '');
        setCity(details.city || '');
        if (details.arrivalDate && details.arrivalDate.seconds) {
          const start = new Date(details.arrivalDate.seconds * 1000);
          setStartDate(start);
          console.log('Start date:', start);
        }
        if (details.departureDate && details.departureDate.seconds) {
          const end = new Date(details.departureDate.seconds * 1000);
          setEndDate(end);
          console.log('End date:', end);
        }
      } else {
        console.error('No details found for itinerary with ID:', id);
      }
    };

    getDetails();
  }, [id, getItinerary]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleNext = () => {
    navigate(`/preferences/${id}`);
  };

  return (
    <div className="join-trip-container">
      <TopBanner />
      <main className="trip-details">
        <h1 style={{ color: "black" }}>JOIN THE TRIP NOW!</h1>
        <div className="trip-info">
          <img src={coupletravel} alt="Couple" />
          <div className="trip-description">
            <h2 style={{ color: "black" }}>Trip Details</h2>
            <p>Destination: {city}, {country}</p>
            <p>Date: {formatDate(startDate)} - {formatDate(endDate)}</p>
          </div>
        </div>
        <button className="next-button" onClick={handleNext}>Next</button>
      </main>
    </div>
  );
};

export default InviteStart;