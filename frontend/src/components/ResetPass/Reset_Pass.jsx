import React, { useState } from 'react';
import "./Reset_Pass.css"

const Reset_Pass = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    try {
      // Send a request to your server to generate and send OTP to the provided email
      const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSent(true);
        setMessage('OTP sent to your email.');
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to send OTP.');
    }
  };

  const handleChangePassword = async () => {
    try {
      // Send a request to your server to verify the OTP and update the password
      const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });

      if (response.ok) {
        setMessage('Password reset successfully.');
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to reset password.');
    }
  };

  return (
    <div className="Pure_reset">
    <div className='formpage'>

    <div className='reset_form'>
      <h1 className='heading'>Password Reset</h1>
      <p className='ptag'>Enter your email to receive a verification code.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        className='inp'
        onChange={(e) => setEmail(e.target.value)}
        />
      {!otpSent ? (
          <button className='RestPassPagebtn' onClick={handleSendOTP}>Get OTP</button>
          ) : (
              <>
          <p className='ptag'>Enter the OTP you received via email.</p>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            className='inp'
            onChange={(e) => setOtp(e.target.value)}
            />
          <p className='ptag'>Enter your new password.</p>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            className='inp'
            onChange={(e) => setNewPassword(e.target.value)}
            />
          <p className='ptag'>Confirm your new password.</p>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            className='inp'
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
          <button className='RestPassPagebtn' onClick={handleChangePassword}>Change Password</button>
        </>
      )}
      <p className='ptag'>{message}</p>
    </div>
      </div>
      </div>
  );
};

export default Reset_Pass;