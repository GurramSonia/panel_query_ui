import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import '../../styles/GroupPermissions.css';

const PermissionsForm = ({ groups }) => {
  const [availableOperations, setAvailableOperations] = useState([]);
  const [permissionsForm, setPermissionsForm] = useState({
    group: '',
    tableName: '',
    source: '',
    db_name: '',
    operations: [],
    view_email: false,
    view_pass: false,
  });
  const [permissionsMessage, setPermissionsMessage] = useState('');
  const [permissionsError, setPermissionsError] = useState('');

  useEffect(() => {
    if (permissionsForm.source === 'mysql') {
      setAvailableOperations(['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP']);
    } else if (permissionsForm.source === 'mongodb') {
      setAvailableOperations([
        'find', 'insert', 'update', 'delete',
        'insert_one', 'insert_many', 'update_one',
        'update_many', 'delete_one', 'delete_many', 'drop'
      ]);
    } else {
      setAvailableOperations([]);
    }
  }, [permissionsForm.source]);

  const handlePermissionsChange = (event) => {
    const { name, value } = event.target;
    setPermissionsForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPermissionsForm((prevForm) => ({
      ...prevForm,
      [name]: checked,
    }));
  };

  const handleOperationChange = (event) => {
    const { value, checked } = event.target;
    setPermissionsForm((prevForm) => ({
      ...prevForm,
      operations: checked
        ? [...prevForm.operations, value]
        : prevForm.operations.filter((op) => op !== value),
    }));
  };

  const handlePermissionsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        'admin/group-permissions',
        permissionsForm,
        { withCredentials: true }
      );
      setPermissionsMessage(response.data.message || 'Permission assigned successfully.');
      setPermissionsError('');
      setPermissionsForm({
        group: '',
        tableName: '',
        source: '',
        db_name: '',
        operations: [],
        view_email: false,
        view_pass: false,
      });
      setTimeout(() => setPermissionsMessage(null), 3000);
    } catch (err) {
      setPermissionsError(err.response?.data?.error || 'An error occurred while assigning permissions.');
      setTimeout(() => setPermissionsError(null), 3000);
    }
  };

  /* return (
    <div className="container my-4 overflow-auto" style={{ height: '500px' }}>
      <h3 className="mb-4">Assign Group Permissions</h3>
      <form onSubmit={handlePermissionsSubmit}>

        <div className="mb-3">
          <label htmlFor="group" className="form-label">Select Group</label>
          <select
            id="group"
            name="group"
            className="form-select"
            value={permissionsForm.group}
            onChange={handlePermissionsChange}
            required
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.group_name}>
                {group.group_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="source" className="form-label">Source (Database)</label>
          <select
            id="source"
            name="source"
            className="form-select"
            value={permissionsForm.source}
            onChange={handlePermissionsChange}
            required
          >
            <option value="">Select Source</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="db_name" className="form-label">Database Name</label>
          <input
            type="text"
            id="db_name"
            name="db_name"
            className="form-control"
            value={permissionsForm.db_name}
            onChange={handlePermissionsChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tableName" className="form-label">Table Name</label>
          <input
            type="text"
            id="tableName"
            name="tableName"
            className="form-control"
            value={permissionsForm.tableName}
            onChange={handlePermissionsChange}
            required
          />
        </div>

        <fieldset className="mb-3">
          <legend className="col-form-label pt-0">Operations</legend>
          <div className="row">
            {availableOperations.map((operation) => (
              <div className="form-check col-6 col-md-4" key={operation}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`op-${operation}`}
                  name="operations"
                  value={operation}
                  checked={permissionsForm.operations.includes(operation)}
                  onChange={handleOperationChange}
                />
                <label className="form-check-label" htmlFor={`op-${operation}`}>
                  {operation}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="mb-3 form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="view_email"
            name="view_email"
            checked={permissionsForm.view_email}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="view_email">
            View Email
          </label>
        </div>

        <div className="mb-4 form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="view_pass"
            name="view_pass"
            checked={permissionsForm.view_pass}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="view_pass">
            View Password
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Assign Permission
        </button>

      </form>

      {permissionsMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {permissionsMessage}
        </div>
      )}

      {permissionsError && (
        <div className="alert alert-danger mt-3" role="alert">
          {permissionsError}
        </div>
      )}
    </div>
  ); */

  // ...existing code...
  return (
    <div className="d-flex justify-content-center align-items-center my-4" style={{ minHeight: '500px' }}>
      <div className="card shadow-lg w-100" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-primary text-center fw-bold">Assign Group Permissions</h3>
          <form onSubmit={handlePermissionsSubmit}>

            <div className="mb-3">
              <label htmlFor="group" className="form-label fw-semibold">Select Group</label>
              <select
                id="group"
                name="group"
                className="form-select"
                value={permissionsForm.group}
                onChange={handlePermissionsChange}
                required
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.group_name}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="source" className="form-label fw-semibold">Source (Database)</label>
              <select
                id="source"
                name="source"
                className="form-select"
                value={permissionsForm.source}
                onChange={handlePermissionsChange}
                required
              >
                <option value="">Select Source</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="db_name" className="form-label fw-semibold">Database Name</label>
              <input
                type="text"
                id="db_name"
                name="db_name"
                className="form-control"
                value={permissionsForm.db_name}
                onChange={handlePermissionsChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tableName" className="form-label fw-semibold">Table Name</label>
              <input
                type="text"
                id="tableName"
                name="tableName"
                className="form-control"
                value={permissionsForm.tableName}
                onChange={handlePermissionsChange}
                required
              />
            </div>

            <fieldset className="mb-3">
              <legend className="col-form-label pt-0 fw-semibold">Operations</legend>
              <div className="row">
                {availableOperations.map((operation) => (
                  <div className="form-check col-6 col-md-4" key={operation}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`op-${operation}`}
                      name="operations"
                      value={operation}
                      checked={permissionsForm.operations.includes(operation)}
                      onChange={handleOperationChange}
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
                  id="view_email"
                  name="view_email"
                  checked={permissionsForm.view_email}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="view_email">
                  View Email
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="view_pass"
                  name="view_pass"
                  checked={permissionsForm.view_pass}
                  onChange={handleCheckboxChange}
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

          {permissionsMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {permissionsMessage}
            </div>
          )}

          {permissionsError && (
            <div className="alert alert-danger mt-3" role="alert">
              {permissionsError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
// ...existing code...
};

export default PermissionsForm;
