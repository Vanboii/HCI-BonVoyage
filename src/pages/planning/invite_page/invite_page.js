import React, { useState, useEffect } from 'react';
import './invite_page.css'; // Import the CSS file to style the page
import TopBanner from '../../../components/banner'; // Correct the path to banner.js
import { useNavigate, useParams, } from 'react-router-dom'; // Import useNavigate and useLocation for navigation

const InvitePage = () => {
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState([]);
  const [inviteLink, setInviteLink] = useState('');

  const navigate = useNavigate(); // Initialize the useNavigate hook
  const { id } = useParams();

  useEffect(() => {
    // Generate a random invite link on component mount
    const link2 = `localhost:3000/planning/invitestart/${id}`;
    const link = `hci-bonvoyage.web.app/invitestart/${id}`;
    setInviteLink(link2);
  }, [id]);

  const addInvite = () => {
    if (email) {

      setInvited([...invited, email]);
      setEmail(''); // Clear the email input
    }
  };

  const deleteInvite = (invite) => {
    setInvited(invited.filter((i) => i !== invite));
  };
  
  const sendInvites = () => {
    return
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  const handleNext = () => {
    //# Should do something to handle the emails in the invite box.
    // const encodedCity = encodeURIComponent(city);
    // const encodedCountry = encodeURIComponent(country);
    navigate(`/preferences/${id}`); // Adjust the path to the Preferences page
  };

  return (
    <div className="invite-page-container">
      <TopBanner showAlertOnNavigate={true} />
      <main className="invite-page-main">
        <h1>Send An Invite</h1>
        <p className="invite-description">Invite others to plan your next trip together</p>
        <div className="invite-form-box">
          <form>
            <div className="invite-form-group">
              <label htmlFor="email">Email / Username:</label>
              <div className="input-container">
                <input
                  type="text"
                  id="email"
                  placeholder="eg: example@email.com or BonVoyage"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="button" className="send-invite-button" onClick={addInvite}>
                  Add
                </button>
              </div>
            </div>
            <div className="invite-form-group">
              <label htmlFor="invited">Invites: </label>
              <ul className="invite-list">
                {invited.map((invite, index) => (
                  <li key={index} className="invite-item">
                    {invite}
                    <button type="button" className="delete-button" onClick={() => deleteInvite(invite)}>
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="send-invite-button" onClick={sendInvites}>
                Send Invite
              </button>
            </div>
            <div className="invite-form-group invite-link-group">
              <label htmlFor="invite-link">Invite Link:</label>
              <input
                type="text"
                id="invite-link"
                value={inviteLink}
                readOnly
                className="invite-link"
              />
              <button type="button" className="copy-link-button" onClick={copyInviteLink}>Copy Link</button>
            </div>
            <button type="button" className="next-button" onClick={handleNext}>Next</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;
