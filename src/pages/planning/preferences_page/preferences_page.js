import React, { useState, useEffect } from 'react';
import './preferences_page.css';

import TopBanner from '../../../components/banner';
import { Range, getTrackBackground } from 'react-range';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import { auth } from '../../../firebase';
import { usePreference } from '../../../useHooks/usePreferences';


import CompactIcon from '../../../components/travel style/compact.png';
import AdventureIcon from '../../../components/travel style/adventure.png';
import LocalIcon from '../../../components/travel style/local.png';
import RelaxedIcon from '../../../components/travel style/relaxed.png';
import TouristIcon from '../../../components/travel style/tourist.png';
import { useItinerary } from '../../../useHooks/useItineraries';

const dietaryOptions = [
  'No Restrictions', 'Halal', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Pescatarian',
  'Beef-Free', 'Shellfish-Free', 'Keto', 'Dairy-Free', 'Nut-Free', 'Soy-Free', 'Low-Carb'
];



const travelStyles = [
  { label: 'Compact', icon: CompactIcon },
  { label: 'Adventurous', icon: AdventureIcon },
  { label: 'Local Delight', icon: LocalIcon },
  { label: 'Relaxed', icon: RelaxedIcon },
  { label: 'Tourist', icon: TouristIcon },
];

const allCategories = [
  'None', 'Museums', 'Shopping', 'Amusement Park', 'Historical Site', 'Kid-friendly',
  'Pet-friendly', 'Wheelchair-friendly', 'Parks & Scenic Place', 'Theatre & Cultural', 'Food Galore', 'Night-life'
];

// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];




const PreferencesPage = () => {

  // modules
  // const { search } = useLocation();
  const { id } = useParams();
  const User = auth.currentUser
  const { addPreference } = usePreference();
  const { getItinerary } = useItinerary();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const collectItinerary = async () => {
    const itinerary = await getItinerary(id)
    setCity(itinerary.city)
    setCountry(itinerary.country)
  }

  // useState 
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [dietarySearch, setDietarySearch] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState([500, 1250]);
  const [formError, setFormError] = useState('');
  const [availableCategories, setAvailableCategories] = useState(["None"]);
  const [loading, setLoading] = useState(true);
  const [submitButton, setSubmitButton] = useState("Next");
  const navigate = useNavigate();


  //function to disable buttons
  function disableButton(buttonID){
    const button = document.getElementById(buttonID);
    button.disabled = true;
    button.style.backgroundColor = "#377586";
    setSubmitButton("Loading, please wait...");
  };


  const handleDietaryChange = (option) => {
    if (option === 'No Restrictions') {
      setSelectedDietaryRestrictions([option]);
    } else {
      setSelectedDietaryRestrictions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev.filter((item) => item !== 'No Restrictions'), option]
      );
    }
    setFormError('');
  };

  const handleAddCustomDietary = () => {
    if (
      dietarySearch &&
      !dietaryOptions.includes(dietarySearch) &&
      !selectedDietaryRestrictions.includes(dietarySearch)
    ) {
      setSelectedDietaryRestrictions([...selectedDietaryRestrictions, dietarySearch]);
      setDietarySearch('');
    }
  };

  const handleSearchFocus = () => {
    setDropdownVisible(true);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest('.dropdown') === null) {
      setDropdownVisible(false);
    }
  };

  const handleTravelStyleClick = (style) => {
    setSelectedTravelStyles((prev) =>
      prev.includes(style.label) ? prev.filter((item) => item !== style.label) : [...prev, style.label]
    );
    setFormError('');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
    setFormError('');
  };

  useEffect(() => {
    collectItinerary()
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!city || !country) return;
      try {
        console.log('Fetching categories...',city,country);
        const response = await axios.get(`https://bonvoyage-api-testing.azurewebsites.net/get-categories?city=${city}&country=${country}`);
        console.log(response)
        const fetchedCategories = response.data.data.categories; // Adjusted to match the structure in the previous example
        console.log('Fetched categories:', fetchedCategories);
        setAvailableCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [city, country]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    disableButton("submitForm");

    if (selectedDietaryRestrictions.length === 0) {
      setFormError('Please select at least one dietary restriction.');
      return;
    }
    if (selectedTravelStyles.length === 0) {
      setFormError('Please select at least one travel style.');
      return;
    }
    if (selectedCategories.length === 0) {
      setFormError('Please select at least one category of activities.');
      return;
    }

    // const currentDate = new Date();
    // const month = monthNames[currentDate.getMonth()];
    // const preferenceData = {
    //   country: country,
    //   city: city,
    //   month: month,
    //   category: selectedCategories,
    //   budget: `$${budget[1]}`,
    //   currency: "USD"
    // };

    console.log("Saving to DB...");
    addPreference(id, {
      [`${User.uid}`] : {
        displayName: User.displayName,
        diet: selectedDietaryRestrictions,
        categories: selectedCategories,
        travelStyles: selectedTravelStyles,
        currency: "USD",
        budget: budget,
        isdone: true,
      }
    });
    console.log("done");

    

    try {
      console.log('Loading data...');
      const response = await axios.get(`https://bonvoyage-api-testing.azurewebsites.net/get-recommendations?itineraryID=${id}&userID=${auth.currentUser.uid}`,  {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const recommendations = response.data;
      console.log('Recommendations fetched (POST):', recommendations);

      addPreference(id, {
        [`${User.uid}`] : {
          likes: recommendations.data,
        }});

      console.log("recommendation added to db");

      navigate(`/results/${id}`, { state: { recommendations: recommendations.data } });
    } catch (error) {
      console.error('Error fetching recommendations (POST):', error);

      // THIS IS FOR DEMO PURPOSES IF POST FAILS ON THE DAY ITSELF
      try {
        const localResponse = await axios.get('/places.json'); // Path relative to public folder
        const localRecommendations = localResponse.data;
        console.log('Recommendations fetched (local):', localRecommendations);

        addPreference(id, {
          [`${User.uid}`] : {
            likes: localRecommendations,
          }});
  
        console.log("recommendation added to db");

        navigate(`/results/${id}`, { state: { recommendations: localRecommendations } });
      } catch (localError) {
        console.error('Error fetching local recommendations:', localError);
      }
    }
  }

  //^ Add into the return block below using {loading && (<div...)}
  if (loading) {
    return (
      <div className="loading-container">
        <TopBanner showAlertOnNavigate={true} />
        <main>
          <h1>Loading...</h1>
          <p>Please wait while we fetch the available categories.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="preferences-container">
      <TopBanner showAlertOnNavigate={true} />
      <main>
        <h1>Personal Preference</h1>
        <p>Customize your own Travel Experience</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Dietary Restrictions:</label>
            <div className="dietary-restriction-container">
              <div className="selected-options">
                {selectedDietaryRestrictions.map((option) => (
                  <div key={option} className="selected-option">
                    <span>{option}</span>
                    <button type="button" onClick={() => handleDietaryChange(option)}>&times;</button>
                  </div>
                ))}
              </div>
              <div className="dropdown">
                <input
                  type="text"
                  placeholder="Search dietary restrictions"
                  value={dietarySearch}
                  onChange={(e) => setDietarySearch(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    {dietaryOptions
                      .filter((option) => option.toLowerCase().includes(dietarySearch.toLowerCase()))
                      .map((option) => (
                        <div
                          key={option}
                          className={`option ${selectedDietaryRestrictions.includes(option) ? 'selected' : ''}`}
                          onClick={() => handleDietaryChange(option)}
                        >
                          {option}
                        </div>
                      ))}
                    {dietarySearch && !dietaryOptions.includes(dietarySearch) && (
                      <div className="option" onClick={handleAddCustomDietary}>
                        {`Add "${dietarySearch}"`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Travel Style:</label>
            <div className="travel-style-container">
              {travelStyles.map((style) => (
                <div
                  key={style.label}
                  className={`travel-style-option ${selectedTravelStyles.includes(style.label) ? 'selected' : ''}`}
                  onClick={() => handleTravelStyleClick(style)}
                >
                  <img src={style.icon} alt={style.label} />
                  <span>{style.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Category of Activities:</label>
            <div className="options">
              {allCategories.map((category) => (
                <div
                  key={category}
                  className={`option-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                  style={{ display: availableCategories.includes(category) ? 'block' : 'none' }}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Estimated Budget:</label>
            <p className="budget-tagline">Use Slider or Enter the Min & Max budget</p>
            <p className="budget-tagline1">*Currency: US Dollar (USD)</p>
            <div className="price-range-container">
              <div className="price-range-inputs">
                <label className="range-label">Min</label>
                <input
                  type="number"
                  value={budget[0]}
                  min={0}
                  max={budget[1]}
                  onChange={(e) => setBudget([+e.target.valueAsNumber, budget[1]])}
                  required
                />
                <span> - </span>
                <input
                  type="number"
                  value={budget[1]}
                  min={budget[0]}
                  max={10000}
                  onChange={(e) => setBudget([budget[0], +e.target.valueAsNumber])}
                  required
                />
                <label className="range-label">Max</label>
              </div>
              <Range
                values={budget}
                step={50}
                min={0}
                max={10000}
                onChange={(values) => setBudget(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="price-range-track"
                  >
                    <div
                      className="price-range-track-active"
                      style={{
                        left: `${(budget[0] / 10000) * 100}%`,
                        right: `${100 - (budget[1] / 10000) * 100}%`
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="price-range-thumb"
                  />
                )}
              />
              <div className="price-range-labels">
                <div className="low">Low</div>
                <div className="mid">Mid</div>
                <div className="high">High</div>
              </div>
            </div>
          </div>

          {formError && <div className="error-message">{formError}</div>}
          <button id="submitForm" type="submit" className="next-button">{submitButton}</button>
        </form>
      </main>
    </div>
  );
};

export default PreferencesPage;
