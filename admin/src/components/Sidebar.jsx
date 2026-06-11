import React from "react";
import { NavLink } from "react-router-dom";
import '../CSS/Sidebar.css';

const Sidebar = ({ sidebarOpen }) => {
  return (
    <div className={`sidebar-sidebaradmin ${sidebarOpen ? 'open-sidebaradmin' : 'closed-sidebaradmin'}`}>
      <div className="sidebar-content-sidebaradmin">
        <NavLink 
          to="/add" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="Add Items"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">Add Items</span>
        </NavLink>

        <NavLink 
          to="/list" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="List Items"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">List Items</span>
        </NavLink>

        <NavLink 
          to="/orders" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="Orders"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">Orders</span>
        </NavLink>

        <NavLink 
          to="/orders-info" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="Orders Info"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">Orders Info</span>
        </NavLink>

        <NavLink 
          to="/reviews" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="Reviews"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">Reviews</span>
        </NavLink>

        <NavLink 
          to="/firm-content" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="Firm Page"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="4" rx="1"></rect>
              <rect x="3" y="10" width="18" height="4" rx="1"></rect>
              <rect x="3" y="16" width="18" height="4" rx="1"></rect>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">Firm Page</span>
        </NavLink>

        <NavLink 
          to="/homeimg" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="Home"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">Home</span>
        </NavLink>

        <NavLink 
          to="/about-content" 
          className={({ isActive }) => isActive ? "sidebar-link-sidebaradmin active-sidebaradmin" : "sidebar-link-sidebaradmin"}
          title="About Page"
        >
          <div className="icon-wrapper-sidebaradmin">
            <svg className="icon-sidebaradmin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <span className="link-text-sidebaradmin">About Page</span>
        </NavLink>
      </div>
      
      <div className="sidebar-footer-sidebaradmin">
        <div className="divider-sidebaradmin"></div>
        <div className="footer-content-sidebaradmin">
          <div className="badge-sidebaradmin">Admin Panel</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;