import React, { useState } from 'react';
import TopBanner from "../../../components/banner";
import './waitingroomPage.css'; 

function WaitingRoomPage() {
  const [totalPeople, setTotalPeople] = useState(5); // Total number of people to fill the preference
  const [filledPeople, setFilledPeople] = useState([
    { name: 'John', img: 'path/to/your/cat1.jpg' },
    { name: 'Jane', img: 'path/to/your/cat2.jpg' },
    { name: 'Doe', img: 'path/to/your/cat3.jpg' },
  ]); // List of people who have filled the preference

  const handleAddPerson = () => {
    const newPerson = { name: `Person ${filledPeople.length + 1}`, img: 'path/to/your/cat1.jpg' };
    setFilledPeople([...filledPeople, newPerson]);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>have filled in their preference</h1>
      </header>
      <main>
        <div className="preference-text">
          <span className="fraction">{filledPeople.length}/{totalPeople}</span>
          <span className="text">have filled in their preference</span>
        </div>
        <div className="images">
          {filledPeople.map((person, index) => (
            <div key={index} className="image-container" title={person.name}>
              <img src={person.img} alt={person.name} />
            </div>
          ))}
        </div>
        <button className="generate-button" onClick={handleAddPerson}>
          <span>Generate</span>
          <img src="path/to/your/hand-cursor-icon.png" alt="Hand Cursor" className="hand-cursor" />
        </button>
      </main>
    </div>
  );
}

export default WaitingRoomPage;
