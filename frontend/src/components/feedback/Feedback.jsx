import React, { useState } from 'react';
import { connect } from 'react-redux';
import { feedbackPost } from '../../redux/feedback/feedback.actions';
import './FeedbackForm.css'; // Import your CSS file

const Feedback = ({ feedbackPost }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    description: '',
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    feedbackPost(formData);
    setFormData({
      name: '',
      email: '',
      branch: '',
      description: '',
    });
    alert('Form submitted successfully!'); // Show success alert
  };

  return (
    <div className="feedback-form">
      <h2>Feedback Form</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <select
            name="branch"
            onChange={onChange}
            value={formData.branch}
            id="cars"
            required
          >
            <option value="">Branch</option>
            <option value="COMPUTER">Computer</option>
            <option value="IT">IT</option>
            <option value="EXTC">EXTC</option>
            <option value="AIDS">AIDS</option>
          </select>
        </div>
        <div className="form-group">
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={onChange}
            maxLength={200}
            style={{ resize: 'none' }}
            required
          />
        </div>
        <button type="submit" className="sub_btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default connect(null, { feedbackPost })(Feedback);
