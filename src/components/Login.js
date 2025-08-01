import React, { useState, useEffect } from 'react';
import axios from '../axios.js';
import { useNavigate, useLocation } from 'react-router-dom';
import useTokenEffects from '../hooks/useTokenEffects.js';
import usePasswordEncryptEffects from '../hooks/usePasswordEncryptEffects.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useTokenEffects();
  const { encryptPassword, iv } = usePasswordEncryptEffects(token);
  const encryptedPassword = encryptPassword(password);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setFlashMessage(message);
      setTimeout(() => setFlashMessage(null), 3000);
    }
  }, [location]);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('auth/forgot-password', { email: resetEmail });
      setResetMessage(response.data.message);
      setTimeout(() => {
        setShowModal(false);
        setResetMessage('');
      }, 3000);
    } catch (err) {
      setResetError(err.response?.data?.error || 'Failed to send reset link.');
      setTimeout(() => {
        setResetError('');
        setShowModal(false);
      }, 3000);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'auth/query-login',
        { username, password: encryptedPassword, iv, token },
        { withCredentials: true }
      );
    

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      const { message, user_id, role,jwtToken } = response.data;
      if (jwtToken) {
          localStorage.setItem('jwtToken', jwtToken);
        }
      localStorage.setItem('userId', user_id);
      localStorage.setItem('userrole', role);
      localStorage.setItem('username', username);
      localStorage.setItem('userInitial', username.charAt(0).toUpperCase());
      navigate(`/queryPanel?message=${encodeURIComponent(message)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="container mt-5">
      {flashMessage && (
        <div className="alert alert-success text-center" role="alert">
          {flashMessage}
        </div>
      )}
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => setShowModal(true)}>
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Send Reset Link
                  </button>
                </form>
                {resetError && <div className="alert alert-danger mt-3">{resetError}</div>}
                {resetMessage && <div className="alert alert-success mt-3">{resetMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
