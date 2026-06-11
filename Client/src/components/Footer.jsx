import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/components/Footer.css';
import wordmarkWhite from '../assets/logo_text/image_white_text.png';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="container-footer" id="footer-section">
      <div className="wrapper-footer">
        {/* Main Footer Content */}
        <div className="main-footer">
          {/* Company Info */}
          <div className="section-footer">
            <div className="logo-footer">
              <h3 className="brand-footer">
                <img
                  src={wordmarkWhite}
                  alt="NemLUXURA"
                  className="brand-footer-img"
                />
              </h3>
              <p className="tagline-footer">Luxury Sleeping Solution...</p>
            </div>
            <p className="description-footer">
              We're dedicated to providing you with the perfect mattress that ensures
              your best night's sleep. Experience comfort, quality, and innovation
              with every product.
            </p>
            <div className="social-footer">
              <a
                href="https://www.facebook.com/share/1ADKnbxTxn/?mibextid=wwXIfr"
                className="social-link-footer"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="social-icon-footer" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/luxuramattress?igsh=MWhkMHJ6NnBjMnp3dQ=="
                className="social-link-footer"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="social-icon-footer" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* <a 
                href="https://twitter.com" 
                className="social-link-footer" 
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="social-icon-footer" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                className="social-link-footer" 
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="social-icon-footer" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                className="social-link-footer" 
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="social-icon-footer" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://pinterest.com" 
                className="social-link-footer" 
                aria-label="Pinterest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="social-icon-footer" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="section-footer">
            <h4 className="title-footer">Quick Links</h4>
            <ul className="links-footer">
              <li className="item-footer">
                <button onClick={() => handleNavigation('/')} className="link-footer">Home</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/collection')} className="link-footer">Shop</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/about')} className="link-footer">About Us</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/contact')} className="link-footer">Contact</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/faq')} className="link-footer">FAQ</button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          {/* <div className="section-footer">
            <h4 className="title-footer">Customer Service</h4>
            <ul className="links-footer">
              <li className="item-footer">
                <button onClick={() => handleNavigation('/shipping')} className="link-footer">Shipping Info</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/returns')} className="link-footer">Returns & Exchanges</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/warranty')} className="link-footer">Warranty</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/size-guide')} className="link-footer">Size Guide</button>
              </li>
              <li className="item-footer">
                <button onClick={() => handleNavigation('/care-instructions')} className="link-footer">Care Instructions</button>
              </li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="section-footer">
            <h4 className="title-footer">Get in Touch</h4>
            <div className="contact-footer">
              {/* Retail Address */}
              <div className="address-section-footer">
                <h5 className="address-title-footer">For Retail / Direct Consumer:</h5>
                <div className="contact-item-footer">
                  <span className="contact-icon-footer">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </span>
                  <div className="contact-text-footer">
                    <div className="address-text-footer">
                      <strong>
                        <img
                          src={wordmarkWhite}
                          alt="NemLUXURA"
                          className="inline-wordmark"
                        />
                        MATTRESS STUDIO
                      </strong><br />
                      GF, Kumud Apartment<br />
                      Opp. Gwaliya Sweets<br />
                      Near Stadium Cross Roads<br />
                      Navrangpura, Ahmedabad – 380009
                    </div>
                    <div className="phone-text-footer">
                      Mobile: 98251 10919 / 70698 23363
                    </div>
                  </div>
                </div>
              </div>

              {/* Industrial Address */}
              <div className="address-section-footer">
                <h5 className="address-title-footer">For Bulk / Industrial Requirement:</h5>
                <div className="contact-item-footer">
                  <span className="contact-icon-footer">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </span>
                  <div className="contact-text-footer">
                    <div className="address-text-footer">
                      <strong>NEMI FOAM INDUSTRIES PVT. LTD.</strong><br />
                      Survey No. 1136, Bh. V Trans<br />
                      Off NH 08, Goblaj, Kheda – 387540
                    </div>
                    <div className="phone-text-footer">
                      Mobile: 84602 89861 / 89805 42525
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            {/* <div className="newsletter-footer">
              <h5 className="newsletter-title-footer">Stay Updated</h5>
              <p className="newsletter-text-footer">Get sleep tips and exclusive offers</p>
              <form className="form-footer" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-footer"
                  required
                />
                <button type="submit" className="btn-footer">
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bottom-footer">
          <div className="bottom-content-footer">
            <div className="copyright-footer">
              <p className="copyright-text-footer">
                © 2025{' '}
                <img
                  src={wordmarkWhite}
                  alt="NemLUXURA"
                  className="inline-wordmark"
                />
                All rights reserved.
              </p>
            </div>
            <div className="legal-footer">
              {/* <button onClick={() => handleNavigation('/privacy')} className="legal-link-footer">
                Privacy Policy
              </button>
              <button onClick={() => handleNavigation('/terms')} className="legal-link-footer">
                Terms of Service
              </button>
              <button onClick={() => handleNavigation('/cookies')} className="legal-link-footer">
                Cookie Policy
              </button> */}
              <p className="legal-link-footer">Privacy Policy</p>
              <p className="legal-link-footer">Terms of Service</p>
              <p className="legal-link-footer">Cookie Policy</p>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;