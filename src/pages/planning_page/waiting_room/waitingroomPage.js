import React, { useState } from 'react';
import TopBanner from "../../../components/banner";
import './waitingroomPage.css'; 

const WaitingRoomPage = () => {
  const [responses, setResponses] = useState([
    { name: 'Jamie', status: 'ready' },
    { name: 'Rachel', status: 'ready' },
    { name: 'Brad', status: 'ready' },
    { name: 'Waiting', status: 'waiting' },
    { name: 'Waiting', status: 'waiting' },
  ]);

  const readyCount = responses.filter(response => response.status === 'ready').length;

  return (
    <>
    <TopBanner/>
      <div className="trip-status-container">
        <div className="progress">
          <div className="progress-text">
            <span>{readyCount}</span>/<span>5</span> has filled in their preference
          </div>
        </div>
        <div className="status">
          {responses.map((response, index) => (
            <div key={index} className="status-item">
              <div className={`circle ${response.status}`} />
            </div>
          ))}
        </div>
        <button className="generate-button">Start Generating</button>
      </div>
    </>
  );
};

export default WaitingRoomPage;



