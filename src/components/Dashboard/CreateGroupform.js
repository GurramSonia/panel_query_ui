import React, { useState } from 'react';

const CreateGroupForm = ({ users, handleCreateGroup, error, successMessage }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserCheckboxChange = (username) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  return (
    <div className="container my-4 p-4 border rounded bg-light">
      <form onSubmit={(e) => handleCreateGroup(e, groupName, selectedUsers)}>
        <h5 className="mb-3">Create a New Group</h5>

        <div className="mb-3">
          <label htmlFor="groupName" className="form-label">
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label d-block">Select Users</label>

          <div className="dropdown">
            <button
              type="button"
              className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              {selectedUsers.length > 0
                ? `${selectedUsers.length} user(s) selected`
                : 'Select Users'}
            </button>

            {isDropdownOpen && (
              <div
                className="dropdown-menu show w-100"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="dropdown-item d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.username)}
                      onChange={() => handleUserCheckboxChange(user.username)}
                      className="form-check-input me-2"
                    />
                    {user.username}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Create Group
        </button>
      </form>

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateGroupForm;
