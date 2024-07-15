import React, { useState, useEffect } from 'react';
import './trip_detail.css';
import { useNavigate } from 'react-router-dom';
import TopBanner from '../../../components/banner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const TripDetailPage = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const navigate = useNavigate();
  const today = new Date();

  // Fetch the countries and cities data from the JSON file
  useEffect(() => {
    fetch('/countries_cities.json')
      .then(response => response.json())
      .then(data => {
        console.log('Countries data fetched:', data.countries);
        setCountriesData(data.countries);
      })
      .catch(error => console.error('Error fetching countries and cities data:', error));
  }, []);

  // Transform the countries data to match react-select's expected format
  const countries = countriesData.map(country => ({
    value: country.code,
    label: country.name,
  }));

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setCity(null); // Reset city selection when country changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Form submission started');
    console.log('Country:', country);
    console.log('City:', city);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Number of People:', numberOfPeople);

    if (!country || !city || !startDate || !endDate || numberOfPeople < 1) {
      console.log('Form submission blocked due to missing required fields');
      return; // If any required field is missing, prevent form submission
    }

    const tripDetails = {
      country: country.label,
      city: city.label,
      startDate,
      endDate,
      numberOfPeople,
    };

    // Mock the server response
    console.log('Mock saving trip details:', tripDetails);

    // Mock fetching the formatted URL
    const urlData = { url: 'http://localhost:3000/invite-link' };
    console.log('Mock formatted URL:', urlData.url);
    
    // Navigate to invite page
    navigate('/planning/invite');
  };

  // Get the list of cities for the selected country
  const cityOptions = country
    ? countriesData.find(c => c.code === country.value)?.cities.map(city => ({
        value: city,
        label: city,
      })) || []
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
