import React from 'react';
import './LoadingSpinner.css';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ size = 'medium', overlay = false, text = 'Loading...' }) => {
  const spinnerClasses = `spinner spinner-${size}`;
  
  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className={spinnerClasses}></div>
        {text && <p className="spinner-text">{text}</p>}
      </div>
    );
  }
  
  return (
    <div className="spinner-container">
      <div className={spinnerClasses}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;