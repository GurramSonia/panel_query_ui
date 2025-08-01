import React, { useState } from 'react';
import axios from '../axios.js';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the token from the URL params
  const token = new URLSearchParams(location.search).get('token');
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  // Function to handle password reset form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError('Password must contain at least 8 characters, including uppercase, lowercase, and a number.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await axios.post('/auth/reset-password', { token, newPassword });
      if (response.data.error) {
        setError(response.data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setMessage('Password reset successful. You can now log in.');
        setTimeout(() => navigate('/query-login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while resetting the password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)" }}>
      <div className="card shadow-lg border-0" style={{ maxWidth: 420, width: '100%', borderRadius: 18 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="mb-2">
              <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: 40 }}></i>
            </div>
            <h2 className="fw-bold text-primary mb-1">Reset Password</h2>
            <p className="text-muted mb-0">Create a new password for your account</p>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                autoFocus
              />
              <div className="form-text">
                Must be at least 8 characters, include uppercase, lowercase, and a number.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm New Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
              <i className="bi bi-arrow-repeat me-2"></i>Reset Password
            </button>
            {message && <div className="alert alert-success mt-4 text-center">{message}</div>}
            {error && <div className="alert alert-danger mt-4 text-center">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;