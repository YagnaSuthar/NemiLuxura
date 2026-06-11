import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        const userData = {
          id: response.user._id,
          name: response.user.name,
          email: response.user.email
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiService.register(name, email, password);
      if (response.success) {
        const userData = {
          id: response.user._id,
          name: response.user.name,
          email: response.user.email
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const googleLogin = async (userData) => {
    try {
      console.log('Google login - received userData:', userData);
      
      // Store user data directly from Google
      const userInfo = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture
      };
      
      console.log('Google login - setting user:', userInfo);
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('token', userData.token);
      
      console.log('Google login - user state updated:', userInfo);
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: 'Google login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
