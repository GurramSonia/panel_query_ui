import React from 'react';
import '../../styles/GroupManagement.css'; // You can remove/trim if Bootstrap covers styling
import useGrouplistEffects from '../../hooks/useGrouplistEffects.js';

const GroupList = ({
  groups,
  selectedGroup,
  handleGroupClick,
  handleRemoveUser,
  removeError,
  userRemoveMessage,
  handleAddNewUser,
  addError,
  userAddMessage,
  isAddUserVisible,
  setIsAddUserVisible,
  handleRemoveGroup,
  groupRemoveError,
  groupRemoveMessage,
  showDropdown,
  setShowDropdown,
  showUserDropdown,
  setShowUserDropdown,
  newUser,
  setNewUser,
}) => {
  const {
    selectedSources,
    selectedDatabases,
    selectedTables,
    selectedOperations,
    selectedSource,
    selectedDatabase,
    selectedTable,
    viewEmail,
    viewPass,
    viewEmailPass,
    viewEmailChange,
    viewPassChange,
    setViewEmailChange,
    setViewPassChange,
    setIsUpdateEmailPassVisible,
    isUpdateEmailPassVisible,
    handleUpdateEmailPass,
    isAddOperationVisible,
    setIsAddOperationVisible,
    handleSourceClick,
    handleDatabaseClick,
    handleTableClick,
    handleDeleteOperation,
    handleAddOperation,
    newOperation,
    setNewOperation,
    opAddError,
    opAddMessage,
    opRemoveError,
    opRemoveMessage,
    emailPassMessage,
    emailPassError,
  } = useGrouplistEffects(selectedGroup);

  const handleAddUserClick = () => {
    handleAddNewUser(newUser);
  };

  return (
  <div
    className="container-fluid py-4"
    style={{
      height: '100%',
      maxHeight: 'calc(100vh - 80px)', // adjust as needed for your header/footer
      overflowY: 'auto',
      background: '#f7f9fb',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
    }}
  >
    <div className="bg-white rounded shadow-sm p-4 mb-4 border">
      <h3 className="mb-4 border-bottom pb-2 text-primary">Group Management</h3>

      {/* Groups List */}
      <div className="mb-4">
        <h5 className="text-secondary">Available Groups</h5>
        {groups.length > 0 ? (
          <ul className="list-group">
            {groups.map((group, index) => (
              <li
                key={index}
                className={`list-group-item d-flex justify-content-between align-items-center ${selectedGroup?.group_name === group.group_name ? 'active bg-primary text-white' : ''}`}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => handleGroupClick(group)}
              >
                <span>{group.group_name}</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveGroup(group.group_name);
                  }}
                  className="btn btn-sm btn-outline-danger"
                  aria-label={`Remove group ${group.group_name}`}
                >
                  &minus;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No groups available.</p>
        )}
        {groupRemoveError && <div className="alert alert-danger mt-2">{groupRemoveError}</div>}
        {groupRemoveMessage && <div className="alert alert-success mt-2">{groupRemoveMessage}</div>}
      </div>

      {/* Selected Group Details */}
      {selectedGroup && (
        <div className="mb-4">
          <h5 className="text-secondary">  Users <span className="text-muted">(in <strong>{selectedGroup.group_name}</strong> group)</span></h5>
          {selectedGroup.users.length >= 6 && (
            <button
              className="btn btn-outline-secondary mb-2"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              {showUserDropdown ? 'Close users ▲' : 'Show users ▼'}
            </button>
          )}
          {selectedGroup.users.length < 6 && (
            <ul className="list-group mb-3">
              {selectedGroup.users.map((user, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {user}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveUser(user)}
                    aria-label={`Remove user ${user}`}
                  >
                    &minus;
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showUserDropdown && (
            <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {selectedGroup.users.length === 0 ? (
                <li className="list-group-item">No users</li>
              ) : (
                selectedGroup.users.map((user, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {user}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={e => {
                        e.stopPropagation();
                        setShowUserDropdown(false);
                        handleRemoveUser(user);
                      }}
                      aria-label={`Remove user ${user}`}
                    >
                      &times;
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
          {!showUserDropdown && (
            <div className="mb-3">
              <button
                onClick={() => setIsAddUserVisible(!isAddUserVisible)}
                className={`btn ${isAddUserVisible ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isAddUserVisible ? 'Cancel' : 'Add User'}
              </button>
              {isAddUserVisible && (
                <div className="input-group mt-2" style={{ maxWidth: '300px' }}>
                  <input
                    type="text"
                    value={newUser}
                    onChange={e => setNewUser(e.target.value)}
                    placeholder="Enter username"
                    className="form-control"
                  />
                  <button onClick={handleAddUserClick} className="btn btn-success">
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
          {addError && <div className="alert alert-danger">{addError}</div>}
          {userAddMessage && <div className="alert alert-success">{userAddMessage}</div>}
          {removeError && <div className="alert alert-danger">{removeError}</div>}
          {userRemoveMessage && <div className="alert alert-success">{userRemoveMessage}</div>}
        </div>
      )}

      {/* Sources */}
      {selectedSources.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">Availble Sources <span className="text-muted">(in <strong>{selectedGroup.group_name} group</strong>)</span></h5>
          <ul className="list-group" style={{ maxWidth: '300px' }}>
            {selectedSources.map((source, index) => (
              <li
                key={index}
                className={`list-group-item ${selectedSource === source ? 'active bg-info text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSourceClick(source)}
              >
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Databases */}
      {selectedDatabases.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">Databases <span className="text-muted">(for <strong>{selectedSource}</strong>)</span></h5>
          <ul className="list-group" style={{ maxWidth: '300px' }}>
            {selectedDatabases.map((database, index) => (
              <li
                key={index}
                className={`list-group-item ${selectedDatabase === database ? 'active bg-info text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleDatabaseClick(database)}
              >
                {database}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tables */}
      {selectedTables.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">Tables <span className="text-muted">(for <strong>{selectedDatabase}</strong>)</span></h5>
          <ul className="list-group" style={{ maxWidth: '300px' }}>
            {selectedTables.map((table, index) => (
              <li
                key={index}
                className={`list-group-item ${selectedTable === table ? 'active bg-info text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Email & Password Permissions */}
      {viewEmailPass && (
        <div className="mb-4 border rounded p-3 bg-light">
          <h5 className="text-secondary">Email & Password Permissions</h5>
          <div className="d-flex gap-4 align-items-center mb-3">
            <p className="mb-0">
              View Email: {viewEmail ? <span className="text-success">&#x2705;</span> : <span className="text-danger">&#x274C;</span>}
            </p>
            <p className="mb-0">
              View Password: {viewPass ? <span className="text-success">&#x2705;</span> : <span className="text-danger">&#x274C;</span>}
            </p>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setIsUpdateEmailPassVisible(!isUpdateEmailPassVisible)}
            >
              {isUpdateEmailPassVisible ? 'Cancel' : 'Update'}
            </button>
          </div>
          {isUpdateEmailPassVisible && (
            <div className="mb-3">
              <div className="form-check">
                <input
                  id="viewEmailChange"
                  type="checkbox"
                  checked={viewEmailChange}
                  onChange={() => setViewEmailChange(!viewEmailChange)}
                  className="form-check-input"
                />
                <label htmlFor="viewEmailChange" className="form-check-label">
                  View Email
                </label>
              </div>
              <div className="form-check">
                <input
                  id="viewPassChange"
                  type="checkbox"
                  checked={viewPassChange}
                  onChange={() => setViewPassChange(!viewPassChange)}
                  className="form-check-input"
                />
                <label htmlFor="viewPassChange" className="form-check-label">
                  View Password
                </label>
              </div>
              <button className="btn btn-success btn-sm mt-2" onClick={handleUpdateEmailPass}>
                Save
              </button>
            </div>
          )}
          {emailPassMessage && <div className="alert alert-success">{emailPassMessage}</div>}
          {emailPassError && <div className="alert alert-danger">{emailPassError}</div>}
        </div>
      )}

      {/* Operations */}
      {selectedOperations.length > 0 && (
        <div className="mb-4">
          <h5 className="text-secondary">Operations</h5>
          {selectedOperations.length > 5 && (
            <button
              className="btn btn-outline-secondary mb-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {showDropdown ? 'Close operations ▲' : 'Show operations ▼'}
            </button>
          )}
          {selectedOperations.length <= 5 && (
            <ul className="list-group mb-3" style={{ maxWidth: '400px' }}>
              {selectedOperations.map((operation, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {operation}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      handleDeleteOperation(
                        selectedGroup.group_name,
                        selectedSource,
                        selectedDatabase,
                        selectedTable,
                        operation
                      )
                    }
                    aria-label={`Delete operation ${operation}`}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showDropdown && (
            <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto', maxWidth: '400px' }}>
              {selectedOperations.length === 0 ? (
                <li className="list-group-item">No operations</li>
              ) : (
                selectedOperations.map((operation, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {operation}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setShowDropdown(false);
                        handleDeleteOperation(
                          selectedGroup.group_name,
                          selectedSource,
                          selectedDatabase,
                          selectedTable,
                          operation
                        );
                      }}
                      aria-label={`Delete operation ${operation}`}
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
                className={`btn ${isAddOperationVisible ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isAddOperationVisible ? 'Cancel' : 'Add Operation'}
              </button>
              {isAddOperationVisible && (
                <div className="input-group mt-2" style={{ maxWidth: '400px' }}>
                  <input
                    type="text"
                    value={newOperation}
                    onChange={e => setNewOperation(e.target.value)}
                    placeholder="Enter operation (e.g., SELECT, INSERT)"
                    className="form-control"
                  />
                  <button onClick={handleAddOperation} className="btn btn-success">
                    Add
                  </button>
                </div>
              )}
            </>
          )}
          <div className="mt-3">
            {opAddError && <div className="alert alert-danger">{opAddError}</div>}
            {opAddMessage && <div className="alert alert-success">{opAddMessage}</div>}
            {opRemoveError && <div className="alert alert-danger">{opRemoveError}</div>}
            {opRemoveMessage && <div className="alert alert-success">{opRemoveMessage}</div>}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default GroupList;
