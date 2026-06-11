import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import Homepageimg from "./pages/Homepageimg";
import FirmContent from "./pages/FirmContent";
import AboutContent from "./pages/AboutContent";
import OrdersInfo from "./pages/OrdersInfo";
import './CSS/App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              <div className="app-container">
                <Sidebar sidebarOpen={sidebarOpen} />
                {sidebarOpen && window.innerWidth <= 768 && (
                  <div className="sidebar-overlay" onClick={toggleSidebar}></div>
                )}
                <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/add" replace />} />
                    <Route path='/add' element={<Add />} />
                    <Route path='/list' element={<List />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/reviews' element={<Reviews />} />
                    <Route path='/homeimg' element={<Homepageimg />} />
                    <Route path='/firm-content' element={<FirmContent />} />
                    <Route path='/about-content' element={<AboutContent />} />
                    <Route path='/orders-info' element={<OrdersInfo />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;