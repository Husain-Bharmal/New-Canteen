import React, { useState } from 'react';
import { connect } from "react-redux";
import  {feedbackPost}  from '../../redux/feedback/feedback.actions';
import './FeedbackForm.css'; // Import your CSS file

const Feedback = ({feedbackPost}) => {
    const [formData,setFormData] = useState({
  name:'',
  email:'',
  branch:'',
  description:'',
    })
    const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
      e.preventDefault();
      console.log("the data is gone");
      feedbackPost(formData);
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
            placeholder='Name'
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <select name="branch" onChange={onChange} id="cars">
              <option value="null">Branch </option>
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
            placeholder='description'
            onChange={onChange}
            maxLength={200}
            style={{ resize: 'none' }}
            required
          />
        </div>
        <button type="submit" className='sub_btn'>Submit</button>
      </form>
    </div>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps,{feedbackPost})(Feedback);
