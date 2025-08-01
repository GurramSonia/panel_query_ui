import React, { useState } from 'react';
import '../../styles/UserList.css';
import AddUser from './AddUser.js';

const UserLists = ({ admins, nonAdmins, error, activeSection, setActiveSection }) => {
  const [activeUserSection, setActiveUserSection] = useState("admins");

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeSection === "admins" ? "active" : ""}`}
            onClick={() => setActiveSection("admins")}
          >
            Admins
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeSection === "nonAdmins" ? "active" : ""}`}
            onClick={() => setActiveSection("nonAdmins")}
          >
            Non-Admins
          </button>
        </li>
        <li className="nav-item ms-auto">
          <button
            className={`btn btn-sm btn-outline-success ${activeSection === "addUser" ? "active" : ""}`}
            onClick={() => setActiveSection("addUser")}
          >
            Invite Users
          </button>
        </li>
      </ul>

      {/* Add User Form */}
      {activeSection === 'addUser' && (
        <div className="mb-4">
          <AddUser />
        </div>
      )}

      {/* Admins List */}
      {activeSection === "admins" && (
        <div className="card shadow-sm mb-3">
          <div className="card-header bg-primary text-white">Admins</div>
          <div className="card-body">
            {admins && admins.length > 0 ? (
              <ul className="list-group">
                {admins.map((admin, index) => (
                  <li key={index} className="list-group-item">
                    {admin.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No admins found.</p>
            )}
          </div>
        </div>
      )}

      {/* Non-Admins List */}
      {activeSection === "nonAdmins" && (
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white">Non-Admins</div>
          <div className="card-body">
            {nonAdmins && nonAdmins.length > 0 ? (
              <ul className="list-group">
                {nonAdmins.map((user, index) => (
                  <li key={index} className="list-group-item">
                    {user.username} <span className="badge bg-light text-dark ms-2">{user.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No non-admin users found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLists;
