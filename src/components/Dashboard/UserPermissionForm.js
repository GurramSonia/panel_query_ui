import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios'; 
import '../../styles/UserPermissions.css';

const UserpermissionsForm = ({ admins, nonAdmins }) => {
  const [availableOperations, setAvailableOperations] = useState([]);
  const [users, setUsers] = useState([]);
  const [userpermissionsForm, setUserPermissionsForm] = useState({
    username: '',
    tableName: '',
    db_name: '',
    source: '',
    operations: [],
    view_email: false,
    view_pass: false,
  });
  const [userpermissionsMessage, setuserPermissionsMessage] = useState('');
  const [userpermissionsError, setuserPermissionsError] = useState('');

  useEffect(() => {
    if (admins && nonAdmins) {
      setUsers([...admins, ...nonAdmins]);
    }
  }, [admins, nonAdmins]);

  useEffect(() => {
    if (userpermissionsForm.source === 'mysql') {
      setAvailableOperations(['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP']);
    } else if (userpermissionsForm.source === 'mongodb') {
      setAvailableOperations([
        'find', 'insert', 'update', 'delete', 'insert_one', 'insert_many',
        'update_one', 'update_many', 'delete_one', 'delete_many', 'drop'
      ]);
    } else {
      setAvailableOperations([]);
    }
  }, [userpermissionsForm.source]);

  const handleuserPermissionsChange = (event) => {
    const { name, value } = event.target;
    setUserPermissionsForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleOperationChange = (event) => {
    const { value, checked } = event.target;
    setUserPermissionsForm((prevForm) => ({
      ...prevForm,
      operations: checked
        ? [...prevForm.operations, value]
        : prevForm.operations.filter((op) => op !== value),
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setUserPermissionsForm((prevForm) => ({
      ...prevForm,
      [name]: checked,
    }));
  };

  const handleuserPermissionsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        'admin/user-permissions',
        userpermissionsForm,
        { withCredentials: true }
      );
      setuserPermissionsMessage(response.data.message || 'Permission assigned successfully.');
      setuserPermissionsError('');
      setUserPermissionsForm({ username: '', tableName: '', db_name: '', source: '', operations: [], view_email: false, view_pass: false });
      setTimeout(() => setuserPermissionsMessage(null), 3000);
    } catch (err) {
      setuserPermissionsError(err.response?.data?.error || 'An error occurred while assigning permissions.');
      setTimeout(() => setuserPermissionsError(null), 3000);
    }
  };

 /*  return (
    <div className="container mt-4 overflow-auto" style={{ height: '500px' }}>
      <div className="card shadow">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">Assign User Permissions</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleuserPermissionsSubmit}>
            <div className="mb-3">
              <label className="form-label">Select User</label>
              <select
                className="form-select"
                name="username"
                value={userpermissionsForm.username}
                onChange={handleuserPermissionsChange}
              >
                <option value="">Select User</option>
                {users.map((user, index) => (
                  <option key={index} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Source (Database)</label>
              <select
                className="form-select"
                name="source"
                value={userpermissionsForm.source}
                onChange={handleuserPermissionsChange}
              >
                <option value="">Select Source</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Database Name</label>
              <input
                type="text"
                className="form-control"
                name="db_name"
                value={userpermissionsForm.db_name}
                onChange={handleuserPermissionsChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Table Name</label>
              <input
                type="text"
                className="form-control"
                name="tableName"
                value={userpermissionsForm.tableName}
                onChange={handleuserPermissionsChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Operations</label>
              <div className="row">
                {availableOperations.map((operation, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="operations"
                        value={operation}
                        checked={userpermissionsForm.operations.includes(operation)}
                        onChange={handleOperationChange}
                        id={`op-${operation}`}
                      />
                      <label className="form-check-label" htmlFor={`op-${operation}`}>
                        {operation}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="view_email"
                  checked={userpermissionsForm.view_email}
                  onChange={handleCheckboxChange}
                  id="view_email"
                />
                <label className="form-check-label" htmlFor="view_email">
                  View Email
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="view_pass"
                  checked={userpermissionsForm.view_pass}
                  onChange={handleCheckboxChange}
                  id="view_pass"
                />
                <label className="form-check-label" htmlFor="view_pass">
                  View Password
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Assign Permission
            </button>
          </form>

          {userpermissionsMessage && <div className="alert alert-success mt-3">{userpermissionsMessage}</div>}
          {userpermissionsError && <div className="alert alert-danger mt-3">{userpermissionsError}</div>}
        </div>
      </div>
    </div>
  ); */


  // ...existing code...
  return (
    <div className="d-flex justify-content-center align-items-center my-4" style={{ minHeight: '500px' }}>
      <div className="card shadow-lg w-100" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-primary text-center fw-bold">Assign User Permissions</h3>
          <form onSubmit={handleuserPermissionsSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Select User</label>
              <select
                className="form-select"
                name="username"
                value={userpermissionsForm.username}
                onChange={handleuserPermissionsChange}
              >
                <option value="">Select User</option>
                {users.map((user, index) => (
                  <option key={index} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Source (Database)</label>
              <select
                className="form-select"
                name="source"
                value={userpermissionsForm.source}
                onChange={handleuserPermissionsChange}
              >
                <option value="">Select Source</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Database Name</label>
              <input
                type="text"
                className="form-control"
                name="db_name"
                value={userpermissionsForm.db_name}
                onChange={handleuserPermissionsChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Table Name</label>
              <input
                type="text"
                className="form-control"
                name="tableName"
                value={userpermissionsForm.tableName}
                onChange={handleuserPermissionsChange}
                required
              />
            </div>

            <fieldset className="mb-3">
              <legend className="col-form-label pt-0 fw-semibold">Operations</legend>
              <div className="row">
                {availableOperations.map((operation, i) => (
                  <div className="form-check col-6 col-md-4" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="operations"
                      value={operation}
                      checked={userpermissionsForm.operations.includes(operation)}
                      onChange={handleOperationChange}
                      id={`op-${operation}`}
                    />
                    <label className="form-check-label" htmlFor={`op-${operation}`}>
                      {operation}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="view_email"
                  checked={userpermissionsForm.view_email}
                  onChange={handleCheckboxChange}
                  id="view_email"
                />
                <label className="form-check-label" htmlFor="view_email">
                  View Email
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="view_pass"
                  checked={userpermissionsForm.view_pass}
                  onChange={handleCheckboxChange}
                  id="view_pass"
                />
                <label className="form-check-label" htmlFor="view_pass">
                  View Password
                </label>
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary fw-semibold">
                Assign Permission
              </button>
            </div>
          </form>

          {userpermissionsMessage && <div className="alert alert-success mt-3">{userpermissionsMessage}</div>}
          {userpermissionsError && <div className="alert alert-danger mt-3">{userpermissionsError}</div>}
        </div>
      </div>
    </div>
  );
// ...existing code...
};

export default UserpermissionsForm;
