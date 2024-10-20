// src/components/FidgetSpinner.jsx
import React from 'react';
import './FidgetSpinner.css';

const FidgetSpinner = () => {
  return (
    <div className="fidget-spinner">
      <div className="spinner-base">
        <div className="spinner-arm"></div>
        <div className="spinner-arm"></div>
        <div className="spinner-arm"></div>
      </div>
    </div>
  );
};

export default FidgetSpinner;
