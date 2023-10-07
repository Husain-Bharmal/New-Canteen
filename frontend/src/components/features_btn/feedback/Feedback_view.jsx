// FeedbackList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedbackList.css'; // Import your CSS file

const FeedbackList = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get('/feedback');
        setFeedbackData(response.data);
        setFilteredData(response.data); // Initially, set filtered data to all feedback
      } catch (error) {
        console.error('Error fetching feedback data:', error.message);
      }
    };

    fetchFeedbackData();
  }, []);

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    // Filter data based on the selected department
    if (department === 'All') {
      setFilteredData(feedbackData);
    } else {
      const filtered = feedbackData.filter((feedback) => feedback.branch === department);
      setFilteredData(filtered);
    }
  };

  return (
    <div className="feedback-list-container">
      <h2 className="feedback-heading">Feedback Received</h2>
      <div className="filter-container">
        <label htmlFor="departmentFilter">Filter by Department:</label>
        <select
          id="departmentFilter"
          onChange={handleDepartmentChange}
          value={selectedDepartment}
        >
          <option value="All">All</option>
          <option value="COMPUTER">Computer</option>
          <option value="IT">IT</option>
          <option value="EXTC">EXTC</option>
          <option value="AIDS">AIDS</option>
        </select>
      </div>
      <div className="scrollable-table-container">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((feedback) => (
              <tr key={feedback._id} className="feedback-row">
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.branch}</td>
                <td>{feedback.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackList;
