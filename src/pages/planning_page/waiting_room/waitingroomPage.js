import TopBanner from "../../../components/banner";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './waitingroomPage.css';

function WaitingRoom() {
  const [users, setUsers] = useState([]);
  const maxUsers = 5; // Set the number of users expected to join
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
    if (storedUsers.length >= maxUsers) {
      navigate('/pageA');
    }
  }, [navigate]);

  const userStatuses = Array(maxUsers).fill('Waiting for response...');
  users.forEach((user, index) => {
    userStatuses[index] = `${user} is ready for the trip!`;
  });

  return (
    <div className="container">
      <div className="header">
        <img src="path/to/logo.png" title="Logo" alt="Logo" className="logo" />
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/mytrips">My Trips</a>
          <a href="/community">Community Trips</a>
          <a href="/tab">Tab</a>
          <div className="profile">
            <span>Hello, User</span>
            <a href="/login">Sign In / Log In</a>
          </div>
        </nav>
      </div>
      <div className="content">
        <div>
          <p className="progress">{users.length}/{maxUsers} has filled in their preference</p>
        </div>
        <div className="status">
          <h2>Status:</h2>
          {userStatuses.map((status, index) => (
            <div key={index} className="statusItem">
              {status}
            </div>
          ))}
        </div>
      </div>
      <button className="button" onClick={() => navigate('/start')}>Start Generating</button>
    </div>
  );
}

export default WaitingRoom;
