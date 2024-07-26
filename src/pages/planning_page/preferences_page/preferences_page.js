import React, { useState, useEffect } from 'react';
import './preferences_page.css';
import TopBanner from '../../../components/banner';
import BudgetIcon from '../../../components/budget.png';
import LuxuriousIcon from '../../../components/diamonds.png';
import AdventurousIcon from '../../../components/camping.png';
import RelaxedIcon from '../../../components/beach-chair.png';
import { Range, getTrackBackground } from 'react-range';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import axios from 'axios';

import { useItineraries } from '../../../test/useGetItineraries';
import { AuthenticationPopup } from '../../login_page/loginPopup';

const dietaryOptions = [
  'No Restrictions', 'Halal', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Pescatarian',
  'Beef-Free', 'Shellfish-Free', 'Keto', 'Dairy-Free', 'Nut-Free', 'Soy-Free', 'Low-Carb'
];

const travelStyles = [
  { label: 'Budget / Backpacker Friendly', icon: BudgetIcon },
  { label: 'Luxurious', icon: LuxuriousIcon },
  { label: 'Adventurous / Thrilling', icon: AdventurousIcon },
  { label: 'Relaxed', icon: RelaxedIcon },
];

const allCategories = [
  'Museums', 'Shopping', 'Amusement Park', 'Historical Site', 'Kid-friendly',
  'Pet-friendly', 'Wheelchair-friendly', 'Parks & Scenic Place', 'Theatre & Cultural', 'Food Galore'
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PreferencesPage = () => {
  const { search } = useLocation();
   
   const {id} = useParams()
   console.log("id:",id)
   const { updateItinerary}  = useItineraries();
   const { Popup } = AuthenticationPopup()

  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [dietarySearch, setDietarySearch] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState([500, 1250]);
  const [formError, setFormError] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const city = params.get('city');
  const country = params.get('country');

  const handleDietaryChange = (option) => {
    setSelectedDietaryRestrictions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    setFormError('');
  };

  const handleAddCustomDietary = () => {
    if (dietarySearch && !dietaryOptions.includes(dietarySearch) && !selectedDietaryRestrictions.includes(dietarySearch)) {
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
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!city || !country) return;

      try {
        const response = await axios.get(`https://bonvoyage-api.azurewebsites.net/get-categories?city=${city}&country=${country}`);
        const availableCategories = response.data.reply;
        console.log('Fetched categories:', availableCategories);
        setAvailableCategories(availableCategories);
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

    const currentDate = new Date();
    const month = monthNames[currentDate.getMonth()];

    const itineraryData = {
      country: country,
      city: city,
      month: month,
      category: selectedCategories,
      budget: `$${budget[1]}`
    };

    console.log('Sending data:', itineraryData);

    try {
      const response = await axios.post('https://bonvoyage-api.azurewebsites.net/get-recommendations', itineraryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const recommendations = response.data;
      console.log('Recommendations fetched (POST):', recommendations);

      navigate(`/Tinderpreference/${id}`, { state: { recommendations: recommendations.data } });
    } catch (error) {
      console.error('Error fetching recommendations (POST):', error);

    // Fallback to GET request
     try {
      const getResponse = await axios.get('https://bonvoyage-api.azurewebsites.net/get-recommendations', {
        params: {
          city: itineraryData.city,
          country: itineraryData.country
        }
      });
      const getRecommendations = getResponse.data;
      console.log('Recommendations fetched (GET):', getRecommendations);

      navigate('/Tinderpreference', { state: { recommendations: getRecommendations.data } });
    } catch (getError) {
      console.error('Error fetching recommendations (GET):', getError);
    }
    //THIS IS FOR DEMO PURPOSES IF POST FAIL ON THE DAY ITSELF
    try {
      const localResponse = await axios.get('/places.json'); // Path relative to public folder
      const localRecommendations = localResponse.data;
      console.log('Recommendations fetched (local):', localRecommendations);

      navigate(`/Tinderpreference/${id}`, { state: { recommendations: localRecommendations } });
    } catch (localError) {
      console.error('Error fetching local recommendations:', localError);
    }

    console.log("Handling submit...")
    updateItinerary(id, {
      diet: selectedDietaryRestrictions,
      categories: selectedCategories,
      travelStyles: selectedTravelStyles,
      budget: budget})
      console.log("done")
    };
  }

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
                  max={10000 || budget[1]}
                  onChange={(e) => setBudget([+e.target.valueAsNumber, budget[1]])}
                  required
                />
                <span> - </span>
                <input
                  type="number"
                  value={budget[1]}
                  min={0 || budget[0]}
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
                    style={{
                      ...props.style,
                      height: '6px',
                      width: '100%',
                      background: getTrackBackground({
                        values: budget,
                        colors: ['#ccc', '#548BF4', '#ccc'],
                        min: 0,
                        max: 10000
                      })
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '24px',
                      width: '24px',
                      backgroundColor: '#548BF4',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0px 2px 6px #AAA'
                    }}
                  >
                    <div
                      style={{
                        height: '16px',
                        width: '5px',
                        backgroundColor: '#FFF'
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
          {formError && <div className="error-message">{formError}</div>}
          <button type="submit" className="next-button">Next</button>
        </form>
      </main>
    </div>
  );
};

export default PreferencesPage;