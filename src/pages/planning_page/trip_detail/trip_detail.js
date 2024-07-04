import React, { useState } from 'react';
import './trip_detail.css'; // Import the CSS file to style the page
import TopBanner from '../../../components/banner';  // Correct the path to banner.js

const TripDetailPage = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate dates
    if (!isValidDate(startDate)) {
      setStartDateError('Invalid date format or out of range. Use dd/mm/yyyy');
      return;
    } else {
      setStartDateError('');
    }

    if (!isValidDate(endDate)) {
      setEndDateError('Invalid date format or out of range. Use dd/mm/yyyy');
      return;
    } else {
      setEndDateError('');
    }

    // Handle form submission
    console.log({ destination, startDate, endDate, numberOfPeople });
  };

  const isValidDate = (date) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(202[4-9]|20[3-9][0-9]|2100)$/;
    return regex.test(date);
  };

  return (
    <div className="trip-detail-container">
      <TopBanner />
      <div id="main">
        <div className="col leftAlign">
          <h1>Plan your next travel</h1>
          <p>Gateway to Planning Your Next Trip</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="destination">Where?</label>
              <input
                type="text"
                id="destination"
                placeholder="Select your Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="start-date">When?</label>
              <input
                type="text"
                id="start-date"
                placeholder="Start Date (dd/mm/yyyy)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                pattern="(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(202[4-9]|20[3-9][0-9]|2100)"
                required
              />
              {startDateError && <p className="error">{startDateError}</p>}
              <span>To</span>
              <input
                type="text"
                id="end-date"
                placeholder="End Date (dd/mm/yyyy)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                pattern="(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(202[4-9]|20[3-9][0-9]|2100)"
                required
              />
              {endDateError && <p className="error">{endDateError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="number-of-people">How many people are going?</label>
              <input
                type="number"
                id="number-of-people"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                min="1"
              />
            </div>
            <button type="submit" className="next-button">Next</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
