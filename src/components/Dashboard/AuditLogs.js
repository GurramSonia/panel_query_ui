import React, { useState, useEffect } from 'react';
import PaginationControls from './PaginationControls.js';
import axiosInstance from '../../axios';

const AuditLogs = ({ activeSection, paginate }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsError, setAuditLogsError] = useState('');
  const [auditLogsPage, setAuditLogsPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const currentAuditLogs = paginate(auditLogs, auditLogsPage, resultsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeSection === 'audit_logs') {
      const fetchAuditLogs = async () => {
        try {
          setIsLoading(true);
          const response = await axiosInstance.get('admin/audit_logs', {
            withCredentials: true,
          });
          if (response.data.length > 0) {
            setAuditLogs(response.data || []);
            setTimeout(() => setIsLoading(false), 2);
          } else {
            setIsLoading(false);
            setAuditLogs([]);
          }
        } catch (err) {
          setAuditLogsError(err.response?.data?.error || 'An error occurred while fetching audit logs.');
          setIsLoading(false);
        }
      };

      fetchAuditLogs();
    }
  }, [activeSection]);

  if (auditLogsError) {
    return <div className="alert alert-danger">{auditLogsError}</div>;
  }

  return (
    <>
  <div
    className="container-fluid py-4"
    style={{
      height: '100%',
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
      background: '#f7f9fb',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
    }}
  >
    <div className="bg-white rounded shadow-sm p-4 mb-4 border">
      <h3 className="mb-4 border-bottom pb-2 text-primary">Audit Logs</h3>

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading audit logs...</div>
        </div>
      ) : auditLogs.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                {Object.keys(auditLogs[0]).map((key) => (
                  <th key={key} className="text-capitalize">{key.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentAuditLogs.map((log, index) => (
                <tr key={index}>
                  {Object.values(log).map((value, i) => (
                    <td key={i} title={String(value)}>
                      {typeof value === 'string' && value.length > 40
                        ? `${value.slice(0, 40)}...`
                        : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
         {/*  <div className="d-flex justify-content-center mt-3"> */}
         <div className="d-flex justify-content-center mt-3" >
            <PaginationControls
              currentPage={auditLogsPage}
              totalPages={Math.ceil(auditLogs.length / resultsPerPage)}
              onPageChange={setAuditLogsPage}
            />
          </div>
        </div>
      ) : (
        <div className="text-muted">No audit logs available.</div>
      )}
    </div>
  </div>
  </>
);
};

export default AuditLogs;
