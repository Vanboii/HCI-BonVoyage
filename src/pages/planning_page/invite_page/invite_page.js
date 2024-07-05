import React, { useState, useEffect } from 'react';
import './invite_page.css'; // Import the CSS file to style the page
import TopBanner from '../../../components/banner';  // Correct the path to banner.js
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const InvitePage = () => {
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState([]);
  const [inviteLink, setInviteLink] = useState('');

  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Generate a random invite link on component mount
    const link = `https://example.com/invite/${Math.random().toString(36).substring(2, 15)}`;
    setInviteLink(link);
  }, []);

  const sendInvite = () => {
    if (email) {
      setInvited([...invited, email]);
      setEmail(''); // Clear the email input
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  const handleNext = () => {
    navigate('/preferences'); // Adjust the path to the Preferences page
  };

  return (
    <div className="invite-container">
      <TopBanner />
      <div id="main">
        <h1>Invite and Plan Your Trip Together</h1>
        <p>Invite your friends and loved ones to join in the fun of planning your next adventure together!</p>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={sendInvite}>Send Invite</button>
          </div>
          <div className="form-group">
            <label htmlFor="invited">People with Access:</label>
            <textarea
              id="invited"
              value={invited.join('\n')}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="invite-link">Invite Link:</label>
            <input
              type="text"
              id="invite-link"
              value={inviteLink}
              readOnly
            />
            <button type="button" onClick={copyInviteLink}>Copy Invite Link</button>
          </div>
        </form>
        <button className="next-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default InvitePage;
