import React from 'react';
import './alert.css';

function Alert({ message, onClose, onOkay, showAlert }) {
  return (
    <>
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-popup">
            <div className="alert-content">
              <p>{message}</p>
              <div className="alert-buttons">
                <button onClick={onClose}>Return to Page</button>
                <button onClick={onOkay}>Leave Page</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Alert;


