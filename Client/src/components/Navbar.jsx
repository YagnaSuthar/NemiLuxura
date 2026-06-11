import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/components/Navbar.css";
import cart_icon from "../assets/trolley.png";
import login_icon from "../assets/people.png";
import logo_img1 from "../assets/IMG-20251011-WA0025-removebg-preview.png";
import logo_img2 from "../assets/IMG-20251011-WA0027-removebg-preview.png";
import ShoppingCart from "../pages/Cart";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const userMenuRef = useRef(null);
  const productMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        productMenuRef.current &&
        !productMenuRef.current.contains(event.target)
      ) {
        setIsProductMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const toggleCart = () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    setIsCartOpen(!isCartOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProductMenuOpen(false);
  };

  const toggleProductMenu = (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      setIsProductMenuOpen(!isProductMenuOpen);
    }
  };

  const getUserInitial = () => user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="container-navbar">
      <div className="wrapper-navbar">
        {/* Toggle Button - Left Side (Mobile Only) */}
        <div className="toggle-wrapper-navbar">
          <button
            className="toggle-navbar"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span
              className={`bar-navbar ${isMenuOpen ? "active-navbar" : ""}`}
            ></span>
            <span
              className={`bar-navbar ${isMenuOpen ? "active-navbar" : ""}`}
            ></span>
            <span
              className={`bar-navbar ${isMenuOpen ? "active-navbar" : ""}`}
            ></span>
          </button>
        </div>

        {/* Logo - Center */}
        <div className="logo-navbar">
          <button onClick={() => navigate("/")} className="brand-navbar">
            <img
              src={logo_img2}
              alt="Logo"
              className="logo-image logo-image-2"
            />
            {/* <span className="logo-text">&</span> */}
            {/* <img src={logo_img1} alt="Logo" className="logo-image" /> */}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className={`menu-navbar ${isMenuOpen ? "active-navbar" : ""}`}>
          <li className="item-navbar">
            <button
              onClick={() => handleNavigation("/")}
              className="link-navbar"
            >
              Home
            </button>
          </li>
          <li className="item-navbar">
            <button
              onClick={() => handleNavigation("/about")}
              className="link-navbar"
            >
              About
            </button>
          </li>
          <li
            className="item-navbar product-dropdown-wrapper"
            ref={productMenuRef}
            onMouseEnter={() =>
              window.innerWidth > 768 && setIsProductMenuOpen(true)
            }
            onMouseLeave={() =>
              window.innerWidth > 768 && setIsProductMenuOpen(false)
            }
          >
            <button
              onClick={toggleProductMenu}
              className="link-navbar product-link"
            >
              <span>Product</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="dropdown-arrow"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`product-dropdown-menu ${
                isProductMenuOpen ? "active" : ""
              }`}
            >
              <button
                onClick={() => handleNavigation("/firm#product")}
                className="dropdown-item"
              >
                Foam
              </button>
              <button
                onClick={() => handleNavigation("/firm#mattress")}
                className="dropdown-item"
              >
                Mattress
              </button>
              <button
                onClick={() => handleNavigation("/firm#pillow")}
                className="dropdown-item"
              >
                Pillow
              </button>
            </div>
          </li>
          <li className="item-navbar">
            <button
              onClick={() => handleNavigation("/collection")}
              className="link-navbar"
            >
              Shop
            </button>
          </li>
          <li className="item-navbar">
            <button
              onClick={() => handleNavigation("/write-review")}
              className="link-navbar"
            >
              Write Review
            </button>
          </li>
          <li className="item-navbar">
            <button
              onClick={() => handleNavigation("/faq")}
              className="link-navbar"
            >
              FAQ
            </button>
          </li>
          <li className="item-navbar">
            <button
              onClick={() => handleNavigation("/contact")}
              className="link-navbar"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="actions-navbar">
          <button 
            onClick={() => handleNavigation("/store-detail")} 
            className="button-navbar cart-navbar"
          >
            <div className="icon-wrapper-navbar">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon-navbar"
              >
                <path d="M3 9l1-5h16l1 5" />
                <path d="M3 9a4 4 0 0 0 8 0" />
                <path d="M11 9a4 4 0 0 0 8 0" />
                <path d="M5 22V12" />
                <path d="M19 22V12" />
                <path d="M5 22h14" />
              </svg>
            </div>
            <span className="text-navbar">Store-Detail</span>
          </button>

          <button onClick={toggleCart} className="button-navbar cart-navbar">
            <div className="icon-wrapper-navbar">
              <img src={cart_icon} alt="Cart" className="icon-navbar" />
              {cartCount > 0 && <span className="badge-navbar">{cartCount}</span>}
            </div>
            <span className="text-navbar">Cart</span>
          </button>

          {isAuthenticated() ? (
            <div className="user-navbar" ref={userMenuRef}>
              <div 
                className="user-avatar-navbar" 
                onClick={toggleUserMenu}
                title={user?.name || 'User'}
                role="button"
                tabIndex={0}
              >
                {getUserInitial()}
              </div>
              <div className={`user-menu-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
                <div className="user-menu-header">
                  <div className="user-menu-name">{user?.name || 'User'}</div>
                  {user?.email && <div className="user-menu-email">{user.email}</div>}
                </div>
                <button onClick={handleLogout} className="logout-navbar">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="login-navbar">
              <img src={login_icon} alt="Login" className="icon-navbar" />
              <span className="text-navbar">Login</span>
            </button>
          )}
        </div>
      </div>

      <ShoppingCart isOpen={isCartOpen} toggleCart={toggleCart} />
    </nav>
  );
};

export default Navbar;
