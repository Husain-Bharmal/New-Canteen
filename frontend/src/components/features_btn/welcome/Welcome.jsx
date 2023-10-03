import React from 'react';
import './Welcome.css'; // Import your CSS file for styling

const Welcome = ({ userName }) => {
  return (
    <div className="welcome-page">
      <div className="welcome-message">
        <div className="admin-name">Welcome, {userName}!</div>
        <p>Thank you for using the Canteen Management System.</p>
        {/* Add any additional content or buttons here */}
      </div>
    </div>
  );
};

export default Welcome;
