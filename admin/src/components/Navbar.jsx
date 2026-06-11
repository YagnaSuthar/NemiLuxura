import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/image.png';
import '../CSS/Navbar.css';

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="navbar-logo-container">
            <img src={logoImage} alt="NemLUXURA Logo" className="navbar-logo-img" />
            <div className="navbar-brand-details">
              <span className="admin-text">ADMIN PANEL</span>
            </div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="logout-icon">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;