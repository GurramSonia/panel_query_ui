import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useUserManagementEffects from '../../hooks/useUserManagementEffects.js';

const UserManagement = () => {
  const {
    userOperations, users, selectedUser, selectedSources, selectedDatabases, selectedTables,
    selectedOperations, selectedSource, selectedDatabase, selectedTable,
    viewEmail, viewPass, viewEmailPass, viewEmailChange, viewPassChange,
    setViewEmail, setViewPass, setViewEmailChange, setViewPassChange, opRemoveError,
    userRemoveMessage, userRemoveError, opAddError, opAddMessage, opRemoveMessage, emailPassMessage,
    emailPassError, isAddOperationVisible, setIsAddOperationVisible, handleSourceClick, handleDatabaseClick,
    handleTableClick, handleRemoveOperation, handleAddOperation, handleRemoveUser, handleUserClick,
    handleUpdateEmailPass, isUpdateEmailPassVisible, setIsUpdateEmailPassVisible, newOperation, setNewOperation,
    showDropdown, setShowDropdown
  } = useUserManagementEffects();

  // List item style for clickable
  const clickableItemStyle = {
    cursor: 'pointer',
  };

 return (
  <div
    className="container-fluid py-4"
    style={{
      height: '100%',
      maxHeight: 'calc(100vh - 70px)',
      overflowY: 'auto',
      background: '#f7f9fb',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      backgroundColor:'white'   }}
  >
    <div className="bg-white rounded shadow-sm p-4 mb-4 border">
      <h3 className="mb-4 border-bottom pb-2 text-primary">User Management</h3>

      {/* Step 1: Users */}
      <div className="mb-4">
        <h5 className="text-secondary">Users</h5>
        {users.length === 0 ? (
          <p className="text-muted">No users available.</p>
        ) : (
          <ul className="list-group " style={{ maxWidth: '500px' }}>
            {users.map((username, i) => (
              <li
                key={i}
                className={`list-group-item d-flex justify-content-between align-items-center ${selectedUser === username ? 'active bg-primary text-white' : ''}`}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => handleUserClick(username)}
              >
                <span>{username}</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveUser(username);
                  }}
                  title={`Remove user ${username}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
        {userRemoveMessage && <p className="text-success mt-2">{userRemoveMessage}</p>}
        {userRemoveError && <p className="text-danger mt-2">{userRemoveError}</p>}
      </div>

      {/* Step 2: Sources */}
      {selectedUser && selectedSources.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">
            Sources <span className="text-muted">(for <strong>{selectedUser}</strong>)</span>
          </h5>
          <ul className="list-group" style={{ maxWidth: '300px' }}>
            {selectedSources.map((source, i) => (
              <li
                key={i}
                className={`list-group-item list-group-item-action ${selectedSource === source ? 'active bg-info text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSourceClick(source)}
              >
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 3: Databases */}
      {selectedSource && selectedDatabases.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">
            Databases <span className="text-muted">(for <strong>{selectedSource}</strong>)</span>
          </h5>
          <ul className="list-group" style={{ maxWidth: '300px' }}>
            {selectedDatabases.map((db, i) => (
              <li
                key={i}
                className={`list-group-item list-group-item-action ${selectedDatabase === db ? 'active bg-info text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleDatabaseClick(db)}
              >
                {db}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 4: Tables */}
      {selectedDatabase && selectedTables.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">
            Tables <span className="text-muted">(for <strong>{selectedDatabase}</strong>)</span>
          </h5>
          <ul className="list-group" style={{ maxWidth: '300px' }}>
            {selectedTables.map((table, i) => (
              <li
                key={i}
                className={`list-group-item list-group-item-action ${selectedTable === table ? 'active bg-info text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 5: Operations */}
      {selectedTable && (
        <div className="mb-4">
          <h5 className="text-secondary">
            Operations <span className="text-muted">(for <strong>{selectedTable}</strong>)</span>
          </h5>
          {(selectedOperations.length > 5) && (
            <button
              className="btn btn-outline-primary mb-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {showDropdown ? "Hide operations ▲" : "Show operations ▼"}
            </button>
          )}

          {(selectedOperations.length <= 5 || showDropdown) && (
            <ul className="list-group" style={{ maxWidth: '300px' }}>
              {selectedOperations.length === 0 ? (
                <li className="list-group-item text-muted">No operations</li>
              ) : (
                selectedOperations.map((op, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{op}</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        handleRemoveOperation(op);
                        setShowDropdown(false);
                      }}
                      title={`Remove operation ${op}`}
                    >
                      🗑
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}

          {!showDropdown && (
            <>
              <button
                onClick={() => setIsAddOperationVisible(!isAddOperationVisible)}
                className={`btn ${isAddOperationVisible ? 'btn-secondary' : 'btn-primary'} mt-3`}
              >
                {isAddOperationVisible ? 'Cancel' : 'Add Operation'}
              </button>
              {isAddOperationVisible && (
                <div className="input-group mt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter new operation (e.g. SELECT)"
                    value={newOperation}
                    onChange={e => setNewOperation(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={handleAddOperation}>Add</button>
                </div>
              )}
            </>
          )}

          <div className="mt-2">
            {opAddError && <p className="text-danger">{opAddError}</p>}
            {opAddMessage && <p className="text-success">{opAddMessage}</p>}
            {opRemoveError && <p className="text-danger">{opRemoveError}</p>}
            {opRemoveMessage && <p className="text-success">{opRemoveMessage}</p>}
          </div>
        </div>
      )}

      {/* Email/Password Permissions Panel */}
      {viewEmailPass && (
        <div className="mb-4 border rounded p-3 bg-light" style={{ maxWidth: '400px' }}>
          <h5 className="text-secondary">Email & Password Permissions</h5>
          <div className="d-flex gap-3 mb-3">
            <p className="mb-0">
              View Email: {viewEmail ? <span className="text-success">&#x2705;</span> : <span className="text-danger">&#x274C;</span>}
            </p>
            <p className="mb-0">
              View Password: {viewPass ? <span className="text-success">&#x2705;</span> : <span className="text-danger">&#x274C;</span>}
            </p>
          </div>

          <button
            onClick={() => setIsUpdateEmailPassVisible(!isUpdateEmailPassVisible)}
            className={`btn btn-${isUpdateEmailPassVisible ? 'secondary' : 'primary'} mb-3`}
          >
            {isUpdateEmailPassVisible ? 'Cancel' : 'Update'}
          </button>

          {isUpdateEmailPassVisible && (
            <div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="viewEmailChange"
                  checked={viewEmailChange}
                  onChange={() => setViewEmailChange(!viewEmailChange)}
                />
                <label className="form-check-label" htmlFor="viewEmailChange">View Email</label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="viewPassChange"
                  checked={viewPassChange}
                  onChange={() => setViewPassChange(!viewPassChange)}
                />
                <label className="form-check-label" htmlFor="viewPassChange">View Password</label>
              </div>
              <button className="btn btn-success" onClick={handleUpdateEmailPass}>Save</button>
            </div>
          )}

          {emailPassMessage && <p className="text-success">{emailPassMessage}</p>}
          {emailPassError && <p className="text-danger">{emailPassError}</p>}
        </div>
      )}
    </div>
  </div>
);
};

export default UserManagement;