import React, { useState } from 'react';
import './trip_detail.css';
import { useNavigate } from 'react-router-dom';
import TopBanner from '../../../components/banner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import countryList from 'country-list';
import { City } from 'country-state-city'; 

// Transform the country list to match react-select's expected format
const countries = countryList.getData().map((country) => ({
  value: country.code,
  label: country.name,
}));

const TripDetailPage = () => {
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const navigate = useNavigate();
  const today = new Date();

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setCity(null); // Reset city selection when country changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!country || !city || !startDate || !endDate || numberOfPeople < 1) {
      return; // If any required field is missing, prevent form submission
    }

    const tripDetails = {
      country: country.label,
      city: city.label,
      startDate,
      endDate,
      numberOfPeople,
    };

    try {
      const response = await fetch('http://localhost:5000/save-trip-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripDetails),
      });

      if (response.ok) {
        console.log('Trip details saved successfully:', tripDetails);
        
        // Fetch the formatted URL
        const urlResponse = await fetch('http://localhost:5000/get-trip-url');
        const urlData = await urlResponse.json();
        
        console.log('Formatted URL:', urlData.url);
        
        // Send the formatted URL to your Python llama
        // You can use this URL to make a request or pass it to another component/function

        // Navigate to invite page
        navigate('/planning/invite');
      } else {
        console.error('Failed to save trip details');
      }
    } catch (error) {
      console.error('Error saving trip details:', error);
    }
  };

  // Get the list of cities for the selected country
  const cityOptions = country
    ? City.getCitiesOfCountry(country.value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  return (
    <div className="trip-detail-container">
      <TopBanner />
      <main>
        <h1>Plan your next travel</h1>
        <p>Gateway to Planning Your Next Trip</p>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="country">Where?</label>
            <div className="location-group">
              <div className="input-container">
                <Select
                  id="country"
                  placeholder="Enter Country"
                  value={country}
                  onChange={handleCountryChange}
                  options={countries}
                  isClearable
                  isSearchable
                  required
                />
              </div>
              <div className="input-container">
                <Select
                  id="city"
                  placeholder="Enter City"
                  value={city}
                  onChange={setCity}
                  options={cityOptions}
                  isClearable
                  isSearchable
                  isDisabled={!country}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-group when-group">
            <label htmlFor="start-date">When?</label>
            <div className="date-group">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Start Date"
                id="start-date"
                required
                minDate={today}
                className="custom-date-picker start-date"
              />
              <span>To</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="End Date"
                id="end-date"
                required
                minDate={startDate || today}
                className="custom-date-picker end-date"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="number-of-people">How many people are going?</label>
            <input
              type="number"
              id="number-of-people"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              min="1"
              required
              className="people-count"
            />
          </div>
          <button type="submit" className="next-button">Next</button>
        </form>
      </main>
    </div>
  );
};

export default TripDetailPage;
