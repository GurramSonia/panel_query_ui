import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import QueryPanel from './Query.js';
import AuditLogs from './AuditLogs.js';
import UserLists from './UserLists.js';
import PermissionsForm from './GroupPermissionForm.js';
import UserpermissionsForm from './UserPermissionForm.js';
import GroupManagement from './GroupManagement.js';
import UserManagement from './UserManagement.js';
import useDashboardEffects from '../../hooks/useDashboardEffects.js';
import '../../styles/DashboardCustom.css';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const SIDEBAR_WIDTH = 220;
const DEFAULT_PROFILE_PIC = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [viewGroupManagement, setviewGroupManagement] = useState(false);
  const [viewUserManagement, setviewUserManagement] = useState(false);
  const [availableConnections, setAvailableConnections] = useState([]);
  const [availableDatabasesNames, setAvailableDatabaseNames] = useState([]);
  const [receivedDatabase, setReceivedDatabase] = useState("");
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem('profilePic') || DEFAULT_PROFILE_PIC
  );
  const fileInputRef = useRef(null);

  const {
    flashMessage, username, userRole, activeSection,
    admins, nonAdmins, userError, availableDatabases, groups, setGroups, showAddContainer, paginate,
    setActiveSection, setShowAddContainer,
  } = useDashboardEffects(navigate);

  
    const toggleAddContainer = () => setShowAddContainer(!showAddContainer);

  const toggleUserManagement = () => {
    setviewUserManagement((prev) => {
      const newState = !prev;
      if (newState) setviewGroupManagement(false);
      return newState;
    });
  };

  const toggleGroupManagement = () => {
    setviewGroupManagement((prev) => {
      const newState = !prev;
      if (newState) setviewUserManagement(false);
      return newState;
    });
  };

  const toggleAuditLogs = () => {
    setviewGroupManagement(false);
    setviewUserManagement(false);
    setActiveSection('audit_logs');
  };

  const handleDatabaseUpdate = (database) => {
    setReceivedDatabase(database);
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePic(ev.target.result);
        localStorage.setItem('profilePic', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle delete profile picture
  const handleDeleteProfilePic = () => {
    setProfilePic(DEFAULT_PROFILE_PIC);
    localStorage.removeItem('profilePic');
  };

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.profile-menu') &&
        !event.target.closest('.profile-pic-topbar')
      ) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    if (activeSection === 'queryPanel' && receivedDatabase) {
      const fetchAvailableConnections = async () => {
        try {
          const response = await axiosInstance.post(
            '/admin/available_connections',
            { database: receivedDatabase },
            { withCredentials: true }
          );
          setAvailableConnections(response.data);
        } catch (err) {
          setAvailableConnections([]);
        }
      };
      fetchAvailableConnections();
    }
  }, [activeSection, receivedDatabase]);

  useEffect(() => {
    if (activeSection === 'queryPanel' && receivedDatabase) {
      const fetchAvailableDatabasenames = async () => {
        try {
          const response = await axiosInstance.post(
            '/admin/available_databases_names',
            { database: receivedDatabase },
            { withCredentials: true }
          );
          setAvailableDatabaseNames(response.data);
        } catch (err) {
          setAvailableDatabaseNames([]);
        }
      };
      fetchAvailableDatabasenames();
    }
  }, [activeSection, receivedDatabase]);


  return (
    <div className="container-fluid min-vh-100 d-flex flex-column px-0 dashboard-bg">
      {flashMessage && (
        <div className="alert alert-success dashboard-flash-message">
          {flashMessage}
        </div>
      )}

      <DashboardHeader
        profilePic={profilePic}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        fileInputRef={fileInputRef}
        handleProfilePicChange={handleProfilePicChange}
        handleDeleteProfilePic={handleDeleteProfilePic}
        username={username}
        userRole={userRole}
        navigate={navigate}
        setActiveSection={setActiveSection}
        DEFAULT_PROFILE_PIC={DEFAULT_PROFILE_PIC}
      />

      <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
        {userRole === 'admin' && (
          <DashboardSidebar
            activeSection={activeSection}
            toggleAuditLogs={toggleAuditLogs}
            toggleUserManagement={toggleUserManagement}
            toggleGroupManagement={toggleGroupManagement}
            viewUserManagement={viewUserManagement}
            viewGroupManagement={viewGroupManagement}
            setActiveSection={setActiveSection}
          />
        )}

        <main className="dashboard-main-content">
          <div className="flex-grow-1 d-flex flex-column">
            {activeSection === 'queryPanel' && (
              <QueryPanel
                paginate={paginate}
                availableDatabases={availableDatabases}
                availableConnections={availableConnections}
                onDatabaseUpdate={handleDatabaseUpdate}
                userRole={userRole}
                availableDatabasesNames={availableDatabasesNames}
              />
            )}
            {activeSection === 'audit_logs' && <AuditLogs activeSection={activeSection} paginate={paginate} />}
            {activeSection === 'group-permissions' && <PermissionsForm groups={groups} />}
            {activeSection === 'user-permission' && <UserpermissionsForm admins={admins} nonAdmins={nonAdmins} />}
            {(activeSection === 'users' || activeSection === 'admins' || activeSection === 'nonAdmins' || activeSection === 'addUser') && (
              <UserLists
                admins={admins}
                nonAdmins={nonAdmins}
                error={userError}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            )}
            {(activeSection === 'group-management' || activeSection === 'add-group') && (
              <GroupManagement
                groups={groups}
                setGroups={setGroups}
                showAddContainer={showAddContainer}
                toggleAddContainer={toggleAddContainer}
                admins={admins}
                nonAdmins={nonAdmins}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            )}
            {activeSection === 'user-management' && <UserManagement />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;