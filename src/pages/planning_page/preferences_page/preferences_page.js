import React, { useState, useEffect } from 'react';
import './preferences_page.css'; // Import the CSS file to style the page
import TopBanner from '../../../components/banner'; // Correct the path to banner.js
import BudgetIcon from '../../../components/budget.png'; // Import the images
import LuxuriousIcon from '../../../components/diamonds.png';
import AdventurousIcon from '../../../components/camping.png';
import RelaxedIcon from '../../../components/beach-chair.png';
import { Range, getTrackBackground } from 'react-range';
import { useNavigate } from 'react-router-dom'; 

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

const categories = [
  'Museums', 'Shopping', 'Amusement Park', 'Historical Site', 'Kid-Friendly',
  'Pet-Friendly', 'Wheelchair Friendly', 'Parks & Scenic Plane', 'Theater & Cultural', 'Food Galore'
];

const PreferencesPage = () => {
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [dietarySearch, setDietarySearch] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState([500, 1250]); // Initial budget range
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleDietaryChange = (option) => {
    setSelectedDietaryRestrictions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    setFormError(''); // Clear the error message when an option is selected
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
    setFormError(''); // Clear the error message when an option is selected
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
    setFormError(''); // Clear the error message when an option is selected
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSubmit = (event) => {
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

    // Proceed with the form submission if no errors
    fetch('/save-dietary-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dietaryOptions: selectedDietaryRestrictions }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // Handle success scenario
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error scenario
      });

    // Navigate to invite page
    navigate('/Tinderpreference');
  };

  return (
    <div className="preferences-container">
      <TopBanner />
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
              {categories.map((category) => (
                <div
                  key={category}
                  className={`option-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(category)}
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
                  max={10000}
                  onChange={(e) => setBudget([+e.target.value, budget[1]])}
                  required
                />
                <span> - </span>
                <input
                  type="number"
                  value={budget[1]}
                  min={0}
                  max={10000}
                  onChange={(e) => setBudget([budget[0], +e.target.value])}
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
