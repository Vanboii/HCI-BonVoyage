import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddActivityModal = ({ isOpen, onRequestClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [budget, setBudget] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const initializeAutocomplete = () => {
        if (inputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ["place_id", "geometry", "formatted_address", "name"],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
              setName(place.name);
              setDescription(place.formatted_address);
              setLat(place.geometry.location.lat());
              setLng(place.geometry.location.lng());
            }
          });
        }
      };

      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCSE_TMMsKRwr3TsvuwBbJEiwojEL1XF4A&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeAutocomplete();
        document.head.appendChild(script);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave({ name, description, openingHours, budget, lat, lng });
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
          <label htmlFor="placeSearch">Place Search:</label>
          <input
            type="text"
            id="placeSearch"
            placeholder="Enter location"
            ref={inputRef}
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
