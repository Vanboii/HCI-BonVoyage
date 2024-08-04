import React, { useState, useEffect } from 'react';
import TopBanner from '../../../components/banner';

import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../../../useHooks/useItineraries';
import axios from 'axios';
import Select from 'react-select';
import countryList from 'country-list';
import DatePicker from 'react-datepicker';
import './trip_detail.css';
import 'react-datepicker/dist/react-datepicker.css';




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

const TripDetailPage = () => {

  const { addItinerary } = useItinerary();

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
  const [submitButton, setSubmitButton] = useState("Next");
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

  //function to disable buttons
  function disableButton(buttonID){
    const button = document.getElementById(buttonID);
    button.disabled = true;
    button.style.backgroundColor = "#377586";
    setSubmitButton("Loading, please wait...");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    disableButton("submitForm");
  
    if (!country || !city || !startDate || !endDate || !arrivalTime || !departureTime || numberOfPeople < 1) {
      return;
    }
  
    // Check if the accommodation choice has been made
    if (hasAccommodation === null) {
      setErrorMessage('Please indicate whether you have an accommodation.');
      return; // Stop the form submission
    }
  
    try {
      // Fetch safety status
      const response = await axios.get(`https://bonvoyage-api.azurewebsites.net/get-categories?city=${city.label}&country=${country.label}`);
      const data = response.data;
  
      // Check safety status
      if (typeof data.safety_status === 'number') {
        setModalContent(data.reply);
        setModalVisible(true);
      } else {
        let id = await addItinerary({  // Adds the itinerary to the database
          country: country.label, 
          city: city.label, 
          arrivalDate: startDate, 
          arrivalTime: arrivalTime,
          departureDate: endDate,
          departureTime: departureTime,
          numberOfPeople: numberOfPeople,
          accommodation: {
            streetAddress: streetAddress,
            buildingName: buildingName,
          },
          owner: {
            uid: auth.currentUser.uid, 
            displayName: auth.currentUser.displayName
          },
        });
  
        setItineraryId(id);
        if (id) {
          navigate(`/planning/invite/${id}`);
        } else {
          console.error("Failed", itineraryId);
        }
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
     // Navigate to invite page
  };
  

  // Get the list of cities for the selected country
  const cityOptions = country
    ? countriesData.find(c => c.code === country.value)?.cities.map(city => ({
        value: city,
        label: city,
      })) || []
    : [];

  const handleModalClose = (proceed) => {
    setModalVisible(false);
    if (proceed) {
      navigate(`/planning/invite/${itineraryId}`);
    }
  };

  return (
    <div className="trip-detail-container">
      <TopBanner showAlertOnNavigate={true} />
      <main>
        <h1>Enter Your Trip Details</h1>
        <p className="description-trip">Gateway to Planning Your Ideal Itinerary</p>
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
            <button id="submitForm" type="submit" className="next-button">{submitButton}</button>
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