import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../config/googleConfig';
import '../CSS/pages/Login.css';
import background_image from '../assets/frontend_assets/p_img10.png';




const Login = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, googleLogin } = useAuth();

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('signup');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Form data state for backend integration
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (activeTab === 'signup') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match!');
          setLoading(false);
          return;
        }

        // Register user
        const name = `${formData.firstName} ${formData.lastName}`.trim();
        const result = await register(name, formData.email, formData.password);

        if (result.success) {
          setMessage('Account created successfully!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage(result.message);
        }
      } else {
        // Login user
        const result = await login(formData.email, formData.password);

        if (result.success) {
          setMessage('Login successful!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setMessage('');

      console.log('Google Sign-In Success:', credentialResponse);

      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      console.log('Decoded Google payload:', payload);

      const userData = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        googleId: payload.sub
      };

      console.log('Sending user data to backend:', userData);

      // Send to backend for authentication
      const result = await authenticateWithGoogle(userData);

      if (result.success) {
        // Use AuthContext to properly set user state
        const authResult = await googleLogin(result.userData);

        if (authResult.success) {
          setMessage('Google Sign-In successful!');
          console.log('Google Sign-In successful');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setMessage(authResult.message || 'Failed to set user state');
        }
      } else {
        setMessage(result.message || 'Google Sign-In failed');
        console.error('Google Sign-In failed:', result.message);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setMessage('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign-In Error:', error);

    // Provide specific error messages based on error type
    if (error.error === 'popup_closed_by_user') {
      setMessage('Sign-in was cancelled. Please try again.');
    } else if (error.error === 'access_denied') {
      setMessage('Access denied. Please check your Google account permissions.');
    } else if (error.error === 'invalid_request') {
      setMessage('Invalid request. Please refresh the page and try again.');
    } else {
      setMessage('Google Sign-In failed. Please try again.');
    }

    setLoading(false);
  };

  const authenticateWithGoogle = async (userData) => {
    try {
      console.log('Authenticating with backend...');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api'}/user/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.success && data.token) {
        // Return user data for AuthContext
        return {
          success: true,
          userData: {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            profilePicture: data.user.profilePicture,
            token: data.token
          }
        };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Google auth error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="container-login" style={{ backgroundImage: `url(${background_image})` }}>
        <div className="overlay-login"></div>

        <div className="content-login">
          <div className="header-login">
            <h1 className="title-login">Welcome to Luxura</h1>
            <p className="subtitle-login">Your journey to better sleep starts here</p>
          </div>

          <div className="tabs-login">
            <button
              className={`tab-login ${activeTab === 'login' ? 'active-login' : ''}`}
              onClick={() => {
                setActiveTab('login');
                navigate('/login');
              }}
            >
              Login
            </button>
            <button
              className={`tab-login ${activeTab === 'signup' ? 'active-login' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                navigate('/register');
              }}
            >
              Sign Up
            </button>
          </div>

          <div className="form-container-login">
            {/* Message Display */}
            {message && (
              <div className={`message-login ${message.includes('successfully') || message.includes('successful') ? 'success-login' : 'error-login'}`}>
                {message}
              </div>
            )}

            {activeTab === 'signup' ? (
              // Sign Up Form
              <div className="form-wrapper-login">
                <div className="form-header-login">
                  <h2 className="form-title-login">Create Account</h2>
                  <p className="form-description-login">
                    Join thousands of satisfied customers who sleep better with Luxura.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="form-login">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="signup_with"
                  />

                  {/* Debug information */}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    Client ID: {GOOGLE_CLIENT_ID.substring(0, 20)}...
                  </div>

                  <div className="divider-login">
                    <span className="divider-text-login">OR CONTINUE WITH</span>
                  </div>

                  <div className="input-row-login">
                    <div className="input-group-login">
                      <label className="label-login">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input-login"
                        placeholder="Rahul"
                        required
                      />
                    </div>
                    <div className="input-group-login">
                      <label className="label-login">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-login"
                        placeholder="Patel"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group-login">
                    <label className="label-login">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-login"
                      placeholder="Rahulpatel@example.com"
                      required
                    />
                  </div>

                  <div className="input-group-login">
                    <label className="label-login">Password</label>
                    <div className="password-wrapper-login">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-login"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-login"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="input-group-login">
                    <label className="label-login">Confirm Password</label>
                    <div className="password-wrapper-login">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input-login"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-login"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn-login" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <div className="admin-link-container-login">
                    <a href={`${import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}/login`} className="admin-link-login" target="_blank" rel="noopener noreferrer">
                      <svg className="admin-icon-login" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Admin Login
                    </a>
                  </div>

                  <p className="terms-login">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="link-login">Terms of Service</a> and{' '}
                    <a href="/privacy" className="link-login">Privacy Policy</a>
                  </p>
                </form>
              </div>
            ) : (
              // Login Form
              <div className="form-wrapper-login">
                <div className="form-header-login">
                  <h2 className="form-title-login">Sign In</h2>
                  <p className="form-description-login">
                    Welcome back! Please sign in to your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="form-login">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="continue_with"
                  />

                  {/* Debug information */}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    Client ID: {GOOGLE_CLIENT_ID.substring(0, 20)}...
                  </div>

                  <div className="divider-login">
                    <span className="divider-text-login">OR CONTINUE WITH</span>
                  </div>

                  <div className="input-group-login">
                    <label className="label-login">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-login"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="input-group-login">
                    <label className="label-login">Password</label>
                    <div className="password-wrapper-login">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-login"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-login"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn-login" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <div className="admin-link-container-login">
                    <a href={`${import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}/login`} className="admin-link-login" target="_blank" rel="noopener noreferrer">
                      <svg className="admin-icon-login" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Admin Login
                    </a>
                  </div>

                  <p className="terms-login">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="link-login">Terms of Service</a> and{' '}
                    <a href="/privacy" className="link-login">Privacy Policy</a>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;