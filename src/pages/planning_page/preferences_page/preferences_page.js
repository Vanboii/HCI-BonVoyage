import React from 'react';
import './preferences_page.css'; // Import the CSS file to style the page
import TopBanner from '../../../components/banner'; // Correct the path to banner.js

const PreferencesPage = () => {
  return (
    <div className="preferences-container">
      <TopBanner />
      <main>
        <h1>Preferences</h1>
        <p>Customise your Travel Experience!</p>
        <form>
          <div className="form-group">
            <label>Dietary Restrictions:</label>
            <div className="options">
              <button type="button">No Restrictions</button>
              <button type="button">Halal</button>
              <button type="button">Vegetarian</button>
              <button type="button">Others</button>
            </div>
          </div>
          <div className="form-group">
            <label>Travel Style:</label>
            <div className="options">
              <button type="button">Budget/ Backpacker friendly</button>
              <button type="button">Relaxed</button>
              <button type="button">Luxurious</button>
              <button type="button">Adventurous/ Thrilling</button>
            </div>
          </div>
          <div className="form-group">
            <label>Category of Activities:</label>
            <div className="options">
              <button type="button">Museum</button>
              <button type="button">Shopping</button>
              <button type="button">Amusement Park</button>
              <button type="button">Historical Site</button>
            </div>
          </div>
          <div className="form-group">
            <label>Estimated Budget:</label>
            <div className="options">
              <button type="button">(SGD) 500 - 750</button>
              <button type="button">(SGD) 751 - 1,000</button>
              <button type="button">(SGD) 1,001 - 1,250</button>
              <button type="button">(SGD) 1,251++</button>
            </div>
          </div>
          <button type="button" className="next-button">Next</button>
        </form>
      </main>
    </div>
  );
};

export default PreferencesPage;
