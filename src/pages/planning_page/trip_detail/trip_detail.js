import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import countryList from 'country-list';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './trip_detail.css';
import TopBanner from '../../../components/banner';
import { useItineraries } from '../../../test/useGetItineraries';
import Cookies from 'js-cookie';

const timeOptions = [
  { value: 'early_morning', label: '0000-0859 (Early Morning)' },
  { value: 'morning', label: '0900-1259 (Morning)' },
  { value: 'afternoon', label: '1300-1859 (Afternoon)' },
  { value: 'evening', label: '1900-2359 (Evening)' }
];

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
  const [arrivalTime, setArrivalTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [hasAccommodation, setHasAccommodation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [itineraryId, setItineraryId] = useState(null); // New state to store the itinerary ID
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

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!country || !city || !startDate || !endDate || !arrivalTime || !departureTime || numberOfPeople < 1) {
      return;
    }

    // Check if the accommodation choice has been made
    if (hasAccommodation === null) {
      setErrorMessage('Please indicate whether you have an accommodation.');
      return; // Stop the form submission
    }
    

    // Handle form submission
    console.log({ country: country.label, city: city.label, startDate: startDate, endDate: endDate, arrivalTime: arrivalTime.value, departureTime: departureTime.value, numberOfPeople: numberOfPeople, streetAddress: hasAccommodation ? streetAddress : null, buildingName: hasAccommodation ? buildingName : null });
    const id = await addItinerary({  // Adds the itinerary to the database
      country: country.label, 
      city: city.label, 
      startDate: startDate, 
      endDate: endDate,
      arrivalTime: arrivalTime.value,
      departureTime: departureTime.value,
      numberOfPeople: numberOfPeople,
      streetAddress: hasAccommodation ? streetAddress : null,
      buildingName: hasAccommodation ? buildingName : null
    });
    setID(id);
    setItineraryId(id); // Store the ID in state
    console.log("Itinerary ID:", id);

    const encodedCity = encodeURIComponent(city.label);
    const encodedCountry = encodeURIComponent(country.label);
    const startMonth = monthNames[startDate.getMonth()]; // Convert start month to words
    const endMonth = monthNames[endDate.getMonth()]; // Convert end month to words
    const url = `https://bonvoyage-api.azurewebsites.net/get-categories?city=${encodedCity}&country=${encodedCountry}&startMonth=${startMonth}&endMonth=${endMonth}`;
  
    console.log('Fetching data from URL:', url);
  
    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log('Data fetched:', data);
  
      Cookies.set('tripData', JSON.stringify(data), { expires: 7 });
      Cookies.set('tripUrl', url, { expires: 7 });
  
      // Save the trip details in a single cookie
      const tripDetails = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        city: city.label,
        country: country.label,
        numberOfPeople,
        arrivalTime: arrivalTime.value,
        departureTime: departureTime.value,
        streetAddress: hasAccommodation ? streetAddress : null,
        buildingName: hasAccommodation ? buildingName : null,
      };
      Cookies.set('tripDetails', JSON.stringify(tripDetails), { expires: 7 });

      // Check safety status
      if (typeof data.safety_status === 'number') {
        setModalContent(data.reply);
        setModalVisible(true);
      } else {
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

  const handleModalClose = (proceed) => {
    setModalVisible(false);
    if (proceed) {
      const encodedCity = encodeURIComponent(city.label);
      const encodedCountry = encodeURIComponent(country.label);
      navigate(`/planning/invite/${itineraryId}?city=${encodedCity}&country=${encodedCountry}`);
    }
  };

  return (
    <div className="trip-detail-container">
      <TopBanner showAlertOnNavigate={true} />
      <main>
        <h1>Enter Your Trip Details</h1>
        <p className="description">Gateway to Planning Your Ideal Itinerary</p>
        <div className="form-box">
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
              <label htmlFor="start-date">Arrival To Destination</label>
              <div className="date-group">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date"
                  id="start-date"
                  required
                  minDate={today}
                  className="custom-date-picker start-date"
                />
                <Select
                  id="arrival-time"
                  placeholder="Select Time"
                  options={timeOptions}
                  value={arrivalTime}
                  onChange={setArrivalTime}
                  className="time-select-container"
                  required
                />
              </div>
            </div>
            <div className="form-group when-group">
              <label htmlFor="end-date">Departure To Destination</label>
              <div className="date-group">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date"
                  id="end-date"
                  required
                  minDate={startDate || today}
                  className="custom-date-picker end-date"
                />
                <Select
                  id="departure-time"
                  placeholder="Select Time"
                  options={timeOptions}
                  value={departureTime}
                  onChange={setDepartureTime}
                  className="time-select-container"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="number-of-people">Number Of People Going</label>
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
                <button type="button" className={`accommodation-button ${hasAccommodation === true ? 'selected' : ''}`} onClick={() => setHasAccommodation(true)}>Yes, I do have</button>
                <button type="button" className={`accommodation-button ${hasAccommodation === false ? 'selected' : ''}`} onClick={() => setHasAccommodation(false)}>No, I do not have</button>
              </div>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
            {hasAccommodation && (
              <div className="accommodation-details">
                <div className="form-group">
                  <label htmlFor="street-address">Street Address</label>
                  <input
                    type="text"
                    id="street-address"
                    placeholder="Eg: 17 Pasir Ris Street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="building-name">Building Name</label>
                  <input
                    type="text"
                    id="building-name"
                    placeholder="Eg: Oatside Hotel"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <button type="submit" className="next-button">Next</button>
          </form>
        </div>
      </main>
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalContent}</p>
            <button onClick={() => handleModalClose(true)}>Proceed to Travel</button>
            <button onClick={() => handleModalClose(false)}>Change Destination</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetailPage;
