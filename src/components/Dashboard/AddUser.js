import React, { useState } from 'react';
import axios from '../../axios'; 
import '../../styles/AddUser.css'
import useTokenEffects from '../../hooks/useTokenEffects.js';
import usePasswordEncryptEffects from '../../hooks/usePasswordEncryptEffects.js';

const AddUser = () => { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useTokenEffects();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const { encryptPassword, iv } = usePasswordEncryptEffects(token);
  const encryptedPassword = encryptPassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('auth/query-signup', { username, email, password: encryptedPassword, iv, token, role });
      const message = response.data[0]?.message;
      if (message) {
        setMessage(message);
        setTimeout(() => setMessage(null), 3000);
        setUsername('');
        setEmail('');
        setRole('user');
        setPassword('');
      }

      if (response.data[0]?.error) {
        setError(response.data[0]?.error || 'Signup failed! Please try again.');
        setTimeout(() => setError(null), 7000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed! Please try again.');
      setTimeout(() => setError(null), 7000);
    }
  };

  return (
    <div className="container my-5"  style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4 text-center">Add User</h2>
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    placeholder="your_name (at least 5 characters)"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    minLength={5}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="example@altimetrik.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="At least 6 chars with upper, lower, digit"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    id="role"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add User
                </button>
              </form>

              {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
              {message && <div className="alert alert-success mt-3" role="alert">{message}</div>}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
