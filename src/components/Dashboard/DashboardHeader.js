import React from 'react';

const DashboardHeader = ({
  profilePic,
  showProfileMenu,
  setShowProfileMenu,
  fileInputRef,
  handleProfilePicChange,
  handleDeleteProfilePic,
  username,
  userRole,
  navigate,
  setActiveSection,
  DEFAULT_PROFILE_PIC,
}) => (
  <header className="dashboard-header">
    <div className="dashboard-header-center">
      <div
        className="dashboard-main-heading"
        onClick={() => setActiveSection('queryPanel')}
      >
        <i className="bi bi-terminal me-2"></i>
        <span className="fw-bolder">Query Panel</span>
      </div>
    </div>
    <span className="fs-4 fw-bold text-primary ms-5" style={{ zIndex: 2 }}></span>
    <div className="position-relative" style={{ zIndex: 2 }}>
      <div
        className="profile-pic-topbar"
        onClick={() => setShowProfileMenu((prev) => !prev)}
        title="Profile"
      >
        <img
          src={profilePic}
          alt="User"
          className="dashboard-profile-pic"
        />
      </div>
      {showProfileMenu && (
        <div className="profile-menu card shadow animate__animated animate__fadeIn dashboard-profile-menu">
          <div className="card-body p-3">
            <div
              className="mb-2"
              style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
              onClick={() => fileInputRef.current.click()}
              title="Change profile picture"
            >
              <img
                src={profilePic}
                alt="User"
                className="dashboard-profile-pic-lg"
              />
              <span className="dashboard-profile-camera">
                <i className="bi bi-camera"></i>
              </span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfilePicChange}
              />
            </div>
            <div className="mt-2 mb-1 text-center">
              <span className="fw-semibold fs-5 text-dark">{username}</span>
              <span className="badge bg-light text-secondary ms-2 text-capitalize">{userRole}</span>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm my-2 w-100 fw-semibold"
              onClick={handleDeleteProfilePic}
              disabled={profilePic === DEFAULT_PROFILE_PIC}
            >
              <i className="bi bi-trash me-1"></i> Delete Profile Picture
            </button>
            <button
              className="btn btn-danger btn-sm w-100 fw-semibold"
              onClick={() => {
                localStorage.removeItem('userId');
                localStorage.removeItem('userInitial');
                localStorage.removeItem('userrole');
                localStorage.removeItem('username');
                localStorage.removeItem('profilePic');
                navigate('/query-login');
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  </header>
);

export default DashboardHeader;