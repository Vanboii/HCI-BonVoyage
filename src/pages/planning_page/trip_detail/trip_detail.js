import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import TopBanner from '../../../components/banner';
import Select from 'react-select';
import countryList from 'country-list';
import './trip_detail.css';
import Cookies from 'js-cookie';
import { useItineraries } from '../../../test/useGetItineraries';

const countries = countryList.getData().map((country) => ({
  value: country.code,
  label: country.name,
}));

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TripDetailPage = ({ setID }) => {
  const { addItinerary } = useItineraries();
  const [countriesData, setCountriesData] = useState([]);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [hasAccommodation, setHasAccommodation] = useState(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nextPageURL, setNextPageURL] = useState('');
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    axios.get('/countries_cities.json')
      .then(response => setCountriesData(response.data.countries))
      .catch(error => console.error('Error fetching countries and cities data:', error));
  }, []);

  const countriesOptions = countriesData.map(country => ({
    value: country.code,
    label: country.name,
  }));

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setCity(null);
  };

  const handleAccommodationClick = (hasAccommodation) => {
    setHasAccommodation(hasAccommodation);
    if (!hasAccommodation) {
      setStreetAddress('');
      setBuildingName('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!country || !city || !startDate || !endDate || numberOfPeople < 1) {
      return;
    }

    // Handle form submission
    console.log({
      country: country.label,
      city: city.label,
      startDate: startDate,
      endDate: endDate,
      numberOfPeople: numberOfPeople,
      streetAddress: hasAccommodation ? streetAddress : null,
      buildingName: hasAccommodation ? buildingName : null,
    });
    const id = await addItinerary({
      country: country.label,
      city: city.label,
      startDate: startDate,
      endDate: endDate,
      numberOfPeople: numberOfPeople,
    });
    setID(id);
    console.log("Itinerary ID:", id);

    const encodedCity = encodeURIComponent(city.label);
    const encodedCountry = encodeURIComponent(country.label);
    const startMonth = monthNames[startDate.getMonth()]; // Convert start month to words
    const endMonth = monthNames[startDate.getMonth()]; // Convert end month to words
    const url = `https://bonvoyage-api.azurewebsites.net/get-categories?city=${encodedCity}&country=${encodedCountry}&startMonth=${startMonth}&endMonth=${endMonth}`;

    console.log('Fetching data from URL:', url);

    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log('Data fetched:', data);

      // Check the safety_status and display the message if necessary
      if (typeof data.safety_status === 'number') {
        setModalMessage(data.reply);
        setNextPageURL(`/planning/invite/${id}?city=${encodedCity}&country=${encodedCountry}`);
        setShowModal(true);
      } else {
        Cookies.set('tripData', JSON.stringify(data), { expires: 7 });
        Cookies.set('tripUrl', url, { expires: 7 });

        // Save the trip details in a single cookie
        const tripDetails = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          city: city.label,
          country: country.label,
          numberOfPeople
        };
        Cookies.set('tripDetails', JSON.stringify(tripDetails), { expires: 7 });

        navigate(`/planning/invite/${id}?city=${encodedCity}&country=${encodedCountry}`);
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
  };

  const cityOptions = country
    ? countriesData.find(c => c.code === country.value)?.cities.map(city => ({
        value: city,
        label: city,
      })) || []
    : [];

  const handleProceedToTravel = () => {
    Cookies.set('tripData', nextPageURL, { expires: 7 });
    Cookies.set('tripUrl', nextPageURL, { expires: 7 });
    navigate(nextPageURL);
  };

  const handleChangeDestination = () => {
    setShowModal(false);
  };

  return (
    <div className="trip-detail-container">
      <TopBanner showAlertOnNavigate={true} />
      <h1>Enter your Trip Details</h1>
      <p className="description">Gateway to Planning Your Ideal Itinerary</p>
      <div className="content">
        <div className="form-box">
          <main>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label htmlFor="country">Location</label>
                <div className="location-group">
                  <div className="input-container">
                    <Select
                      id="country"
                      placeholder="Enter Country"
                      value={country}
                      onChange={handleCountryChange}
                      options={countriesOptions}
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
                <label htmlFor="start-date">Dates</label>
                <div className="date-group">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Check In"
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
                    placeholderText="Check Out"
                    id="end-date"
                    required
                    minDate={startDate || today}
                    className="custom-date-picker end-date"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="number-of-people">Number of People Going</label>
                <input
                  type="number"
                  id="number-of-people"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.valueAsNumber)}
                  min="1"
                  required
                  className="people-count"
                />
              </div>
              <div className="form-group">
                <label>Do you have an accommodation?</label>
                <div className="accommodation-buttons">
                  <button
                    type="button"
                    className={`accommodation-button ${hasAccommodation === true ? 'selected' : ''}`}
                    onClick={() => handleAccommodationClick(true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`accommodation-button ${hasAccommodation === false ? 'selected' : ''}`}
                    onClick={() => handleAccommodationClick(false)}
                  >
                    No
                  </button>
                </div>
              </div>
              {hasAccommodation && (
                <div className="form-group accommodation-details">
                  <label htmlFor="street-address">Street Address</label>
                  <input
                    type="text"
                    id="street-address"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="accommodation-input"
                    required
                  />
                  <label htmlFor="building-name">Building Name</label>
                  <input
                    type="text"
                    id="building-name"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="accommodation-input"
                    required
                  />
                </div>
              )}
              <button type="submit" className="next-button">Next</button>
            </form>
          </main>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={handleProceedToTravel}>Proceed to Travel</button>
            <button onClick={handleChangeDestination}>Change Destination</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailPage;
