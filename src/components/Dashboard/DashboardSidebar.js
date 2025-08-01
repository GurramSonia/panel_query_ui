import React from 'react';

const DashboardSidebar = ({
  activeSection,
  toggleAuditLogs,
  toggleUserManagement,
  toggleGroupManagement,
  viewUserManagement,
  viewGroupManagement,
  setActiveSection,
}) => (
  <aside className="dashboard-sidebar">
    <div className="d-flex flex-column gap-2">
      <>
        <button
          type="button"
          className={`btn btn-outline-secondary text-start ${activeSection === 'audit_logs' ? 'active' : ''}`}
          onClick={toggleAuditLogs}
        >
          <i className="bi bi-clipboard-data me-2"></i> View Audit Logs
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary text-start"
          onClick={toggleUserManagement}
          aria-expanded={viewUserManagement}
          aria-controls="userManagementSubmenu"
        >
          <i className="bi bi-person-gear me-2"></i>
          {viewUserManagement ? 'User Management ▼' : 'User Management ▲'}
        </button>
        {viewUserManagement && (
          <div id="userManagementSubmenu" className="submenu ms-3">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary w-100 text-start ${activeSection === 'users' ? 'active' : ''} mb-1`}
              onClick={() => setActiveSection('users')}
            >
              Users
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary w-100 text-start ${activeSection === 'user-permission' ? 'active' : ''} mb-1`}
              onClick={() => setActiveSection('user-permission')}
            >
              Set User Permissions
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary w-100 text-start ${activeSection === 'user-management' ? 'active' : ''}`}
              onClick={() => setActiveSection('user-management')}
            >
              User Management
            </button>
          </div>
        )}
        <button
          type="button"
          className="btn btn-outline-secondary text-start"
          onClick={toggleGroupManagement}
          aria-expanded={viewGroupManagement}
          aria-controls="groupManagementSubmenu"
        >
          <i className="bi bi-people me-2"></i>
          {viewGroupManagement ? 'Group Management ▼' : 'Group Management ▲'}
        </button>
        {viewGroupManagement && (
          <div id="groupManagementSubmenu" className="submenu ms-3">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary w-100 text-start ${activeSection === 'group-permissions' ? 'active' : ''} mb-1`}
              onClick={() => setActiveSection('group-permissions')}
            >
              Set Group Permissions
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary w-100 text-start ${activeSection === 'group-management' ? 'active' : ''}`}
              onClick={() => setActiveSection('group-management')}
            >
              Group Management
            </button>
          </div>
        )}
      </>
    </div>
  </aside>
);

export default DashboardSidebar;