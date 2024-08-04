import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useItineraries } from '../../../test/useGetItineraries';
import './start_invite.css';
import TopBanner from '../../../components/banner';
import coupletravel from '../../../components/coupletravel.png';
import { getStatesOfCountry } from 'country-state-city/lib/state';

const InviteStart = () => {
  const { id } = useParams();
  const { getItinerary } = useItineraries();

  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      const details = await getItinerary(id);
      console.log(details);
      setCountry(details.country);
      setCity(details.city);
      setStartDate(new Date(details.startDate.seconds * 1000));
      setEndDate(new Date(details.endDate.seconds * 1000));
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
        <button className="next-button">Next</button>
      </main>
    </div>
  );
};

export default InviteStart;