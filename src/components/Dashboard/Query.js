import React, { useState, useEffect } from 'react';
import PaginationControls from './PaginationControls.js';
import axios from '../../axios'; // Adjust path as needed
import '../../styles/Query.css';
import AutoSuggestQueryInput from './AutoSuggestQueryInput.js';
import useTokenEffects from '../../hooks/useTokenEffects.js';
import usePasswordEncryptEffects from '../../hooks/usePasswordEncryptEffects.js';

const QueryPanel = ({ paginate, availableDatabases, availableConnections, onDatabaseUpdate, userRole, availableDatabasesNames }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [database, setDatabase] = useState('selectDatabase');
  const [flashMessages, setFlashMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const currentResults = paginate(results, currentPage, resultsPerPage);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState('');
  const [maskedConnection, setMaskedConnection] = useState('');
  const [originalConnection, setOriginalConnection] = useState('');
  const [databasesNames, setDatabasesNames] = useState('selectDatabase');
  const { token } = useTokenEffects();

  // Mask password in connection string
  const maskPassword = (connection) => {
    return connection.replace(/(:[^@]+)@/, ":****@");
  };

  // Restore the real password when sending the connection
  const restorePassword = (editedConn, fullConn) => {
    const fullPasswordMatch = fullConn.match(/:([^@]+)@/); // Extract original password
    const editedPasswordMatch = editedConn.match(/:([^@]*)@/); // Extract user-edited password

    if (!fullPasswordMatch || !editedPasswordMatch) return editedConn;

    const originalPassword = fullPasswordMatch[1]; // Original password
    const editedPassword = editedPasswordMatch[1]; // User's input

    // If the edited password is '****', restore the original password
    return editedPassword === "****" ? editedConn.replace(/:([^@]*)@/, `:${originalPassword}@`) : editedConn;
  };

  useEffect(() => {
    if (availableConnections.length > 0) {
      const lastConnection = availableConnections[availableConnections.length - 1];
      setOriginalConnection(lastConnection);
      setMaskedConnection(maskPassword(lastConnection));
    }
  }, [availableConnections]);

  const handleInputChange = (event) => {
    setMaskedConnection(event.target.value);
  };

  const getFinalConnection = () => {
    return restorePassword(maskedConnection, originalConnection);
  };

  const { encryptPassword, iv } = usePasswordEncryptEffects(token);
  const encryptedconnection = encryptPassword(getFinalConnection());
  const databasePlaceholders = {
    mysql: 'Write your MySQL query (e.g., SELECT * FROM table)',
    mongodb: 'Write your MongoDB query (e.g., db.collection.find({}) )',
  };
  const connectionURIPlaceholders = {
    mongodb: "mongo string (mongodb://user:Password@service-name:port/database-name?authSource=admin)",
    mysql: 'mysql string(mysql+pymysql://User:Password@service-name:port/database-name)',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Query is required before submitting');
      setTimeout(() => setError(null), 3000); // Display an error
      return;
    }
    setResults([]);
    setError('');
    setFlashMessages([]);

    try {
      if (userRole === 'admin') {
        const response = await axios.post('connection/query-connection', { query, source: database, maskedConnection: encryptedconnection, iv, token }, { withCredentials: true, validateStatus: () => true });

        if (response.data.error) {
          setError(response.data.error);
          setTimeout(() => setError(null), 3000);
        }
        if (response.data.results) {
          setResults(response.data.results || []);
          setError('');
        }
        if (response.data.flash_messages) {
          setFlashMessages('');
          setFlashMessages(response.data.flash_messages);
          setTimeout(() => setFlashMessages(null), 3000);
        }
        if (response.data.message) {
          setMessages(response.data.message);
          setTimeout(() => setMessages(null), 3000);
        }
      } else {
        const response = await axios.post('connection/query-connection-user', { query, source: database, databases_names: databasesNames }, { withCredentials: true, validateStatus: () => true });
        if (response.data.error) {
          setError(response.data.error);
          setTimeout(() => setError(null), 3000);
        }
        if (response.data.results) {
          setResults(response.data.results || []);
          setError('');
        }
        if (response.data.flash_messages) {
          setFlashMessages('');
          setFlashMessages(response.data.flash_messages);
          setTimeout(() => setFlashMessages(null), 3000);
        }
        if (response.data.message) {
          setMessages(response.data.message);
          setTimeout(() => setMessages(null), 3000);
        }
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while executing the query.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const fetchTables = async () => {
    try {
      if (userRole === 'admin') {
        const response = await axios.post('connection/get-tables', { source: database, maskedConnection: encryptedconnection, iv, token }, { withCredentials: true });
        if (response.data.tables) {
          return response.data.tables;
        }
      } else {
        if (databasesNames !== 'selectDatabase' && databasesNames !== "") {
          const response = await axios.post('connection/get-tables-user', { source: database, databases_names: databasesNames }, { withCredentials: true });
          if (response.data.tables) {
            return response.data.tables;
          }
        }
      }
    }
    catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetchingthe tables.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const fetchPreviousQueries = async () => {
    try {
      const response = await axios.post('connection/previous-queries', { source: database }, { withCredentials: true });
      if (response.data.queries) {
        const uniqueQueries = [...new Set(response.data.queries)];
        return uniqueQueries;
      }
    }
    catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching the prev queries.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDatabaseChange = (event) => {
    const selectedDB = event.target.value;
    setDatabase(selectedDB);

    if (onDatabaseUpdate) {
      onDatabaseUpdate(selectedDB);
    }
  };

  return (
    <div className="container py-4" style={{
      height: '100%',
      maxHeight: 'calc(100vh - 70px)',
      overflowY: 'auto',
      background: '#f7f9fb',
      borderRadius: '12px',
      backgroundColor: 'white'
    }}>
      {/* <h2 className="fw-bold text-primary mb-4 text-center">Query Form</h2> */}
      <h2 className="fw-bold text-primary mb-4 text-center">Query Form</h2>
      
      <form className="mb-4 p-4 rounded shadow-sm bg-white" onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Database Selection */}
        <div className="mb-3">
          {availableDatabases.length > 0 ? (
            <>
              <label htmlFor="database-select" className="form-label fw-semibold">Choose Source:</label>
              <select
                id="database-select"
                className="form-select"
                value={database}
                onChange={handleDatabaseChange}
                required
              >
                <option value="">Select Source</option>
                {availableDatabases.map((db, index) => (
                  <option key={index} value={db}>
                    {db.charAt(0).toUpperCase() + db.slice(1)}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <div className="alert alert-warning mb-0">No Sources available for this user.</div>
          )}
        </div>

        {/* Masked Connection String */}
        {userRole === 'admin' && (database === "mysql" || database === "mongodb") && (
          <div className="mb-3">
            <label className="form-label fw-semibold">Connection String:</label>
            <textarea
              className="form-control"
              value={maskedConnection}
              onChange={handleInputChange}
              placeholder={connectionURIPlaceholders[database] || 'Enter your connection uri'}
              required
              rows={2}
            />
          </div>
        )}

        {userRole !== 'admin' && (database === "mysql" || database === "mongodb") && (
          <div className="mb-3">
            {availableDatabasesNames.length > 0 ? (
              <>
                <label htmlFor="database-names-select" className="form-label fw-semibold">Choose Database Name:</label>
                <select
                  id="database-names-select"
                  className="form-select"
                  value={databasesNames}
                  onChange={(e) => setDatabasesNames(e.target.value)}
                  required
                >
                  <option value="">Select Database</option>
                  {availableDatabasesNames.map((db, index) => (
                    <option key={index} value={db}>
                      {db}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="alert alert-warning mb-0">No databases available.</div>
            )}
          </div>
        )}

        {/* Query text area (AutoSuggestQueryInput remains as is) */}
        <AutoSuggestQueryInput
          fetchTables={fetchTables}
          fetchPreviousQueries={fetchPreviousQueries}
          query={query}
          setQuery={setQuery}
          setResults={setResults}
          submitted={submitted}
          setSubmitted={setSubmitted}
          connectionURI={maskedConnection}
          database={database}
          results={results}
          databases_names={databasesNames}
        />

        {/* Query submit button */}
        <div className="d-grid mt-3">
          <button type="submit" className="btn btn-primary btn-lg fw-bold shadow">
            <i className="bi bi-play-circle me-2"></i>Execute Query
          </button>
        </div>
      </form>
    

      {/* Displays error if exists */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Display flash messages */}
      {flashMessages &&
        flashMessages.map((msg, index) => (
          <div key={index} className="alert alert-info text-center">{msg}</div>
        ))}
      {messages && <div className="alert alert-success text-center">{messages}</div>}
    
      {/* Display query results */}
      {results.length > 0 && (
        <>
          <h5 className="fw-bold text-success text-center mt-4 mb-2">Query Results</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>{Object.keys(results[0]).map((key) => <th key={key}>{key}</th>)}</tr>
              </thead>
              <tbody>
                {currentResults.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} title={String(value)}>
                        {typeof value === 'string' && value.length > 20 ? `${value.slice(0, 20)}...` : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(results.length / resultsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default QueryPanel;