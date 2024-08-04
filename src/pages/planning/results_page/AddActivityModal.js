import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddActivityModal = ({ isOpen, onRequestClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [budget, setBudget] = useState('');

  const handleSave = () => {
    onSave({ name, description, openingHours, budget });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Activity"
      className="customModal"
      overlayClassName="customOverlay"
    >
      <h2>Add New Activity</h2>
      <form>
        <div className="form-group">
          <label htmlFor="activityName">Activity Name:</label>
          <input
            type="text"
            id="activityName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="activityDescription">Description/Notes:</label>
          <textarea
            id="activityDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="openingHours">Opening Hours:</label>
          <input
            type="text"
            id="openingHours"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget:</label>
          <input
            type="text"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddActivityModal;