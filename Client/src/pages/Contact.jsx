import React, { useState } from 'react';
import '../CSS/pages/Contact.css';
import image_3 from '../assets/image_3.jpg';
import wordmarkWhite from '../assets/logo_text/image_white_text.png';
import apiService from '../services/apiService';

const Contact = () => {
  const [retailForm, setRetailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [bulkForm, setBulkForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [retailFeedback, setRetailFeedback] = useState({ type: '', text: '' });
  const [bulkFeedback, setBulkFeedback] = useState({ type: '', text: '' });
  const [submittingRetail, setSubmittingRetail] = useState(false);
  const [submittingBulk, setSubmittingBulk] = useState(false);

  const handleRetailChange = (e) => {
    setRetailForm({
      ...retailForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBulkChange = (e) => {
    setBulkForm({
      ...bulkForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRetailSubmit = async (e) => {
    e.preventDefault();
    setRetailFeedback({ type: '', text: '' });
    setSubmittingRetail(true);
    try {
      const response = await apiService.submitInquiry({
        type: 'Retail',
        ...retailForm
      });
      if (response.success) {
        setRetailFeedback({
          type: 'success',
          text: response.message || 'Message sent successfully! Our team will contact you soon.'
        });
        setRetailForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setRetailFeedback({
          type: 'error',
          text: response.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setRetailFeedback({
        type: 'error',
        text: error.message || 'An error occurred. Please try again later.'
      });
    } finally {
      setSubmittingRetail(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkFeedback({ type: '', text: '' });
    setSubmittingBulk(true);
    try {
      const response = await apiService.submitInquiry({
        type: 'Bulk',
        ...bulkForm
      });
      if (response.success) {
        setBulkFeedback({
          type: 'success',
          text: response.message || 'Message sent successfully! Our team will contact you soon.'
        });
        setBulkForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setBulkFeedback({
          type: 'error',
          text: response.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setBulkFeedback({
        type: 'error',
        text: error.message || 'An error occurred. Please try again later.'
      });
    } finally {
      setSubmittingBulk(false);
    }
  };

  return (
    <div className="contact-page-contact">
      {/* Share Your Experience Section */}
      <section className="contact-experience-section-contact">
        <div className="contact-experience-overlay-contact"></div>
        <div className="contact-experience-content-contact">
          <h1>Get in Touch</h1>
          <p>Have questions about our mattresses? We're here to help you find the<br />perfect sleep solution.</p>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="contact-content-section-contact">
        <div className="contact-container-contact">
          {/* Contact Form */}
          <div>
            <div className="contact-form-wrapper-contact">
              <h2>Send us a Message For Retail orders</h2>

              {retailFeedback.text && (
                <div className={`feedback-banner-contact ${retailFeedback.type}-feedback-contact`}>
                  {retailFeedback.text}
                </div>
              )}

              <form onSubmit={handleRetailSubmit} className="contact-form-contact">
                <div className="form-row-contact">
                  <div className="form-group-contact">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter Your Name"
                      value={retailForm.name}
                      onChange={handleRetailChange}
                      required
                    />
                  </div>
                  <div className="form-group-contact">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your E-mail"
                      value={retailForm.email}
                      onChange={handleRetailChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-contact">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={retailForm.subject}
                    onChange={handleRetailChange}
                    required
                  />
                </div>

                <div className="form-group-contact">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    value={retailForm.message}
                    onChange={handleRetailChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn-contact" disabled={submittingRetail}>
                  {submittingRetail ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <svg className="send-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
            <div>
              <section className="contact-content-section-contact contact-second-section-contact">
                <div className="contact-container-contact contact-single-column-contact">
                  {/* Second Contact Form */}
                  <div className="contact-form-wrapper-contact">
                    <h2>Send us a Message for Bulk Orders</h2>

                    {bulkFeedback.text && (
                      <div className={`feedback-banner-contact ${bulkFeedback.type}-feedback-contact`}>
                        {bulkFeedback.text}
                      </div>
                    )}

                    <form onSubmit={handleBulkSubmit} className="contact-form-contact">
                      <div className="form-row-contact">
                        <div className="form-group-contact">
                          <label htmlFor="name2">Your Name</label>
                          <input
                            type="text"
                            id="name2"
                            name="name"
                            placeholder="Enter Your Name"
                            value={bulkForm.name}
                            onChange={handleBulkChange}
                            required
                          />
                        </div>
                        <div className="form-group-contact">
                          <label htmlFor="email2">Email Address</label>
                          <input
                            type="email"
                            id="email2"
                            name="email"
                            placeholder="Enter Your E-mail"
                            value={bulkForm.email}
                            onChange={handleBulkChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group-contact">
                        <label htmlFor="subject2">Subject</label>
                        <input
                          type="text"
                          id="subject2"
                          name="subject"
                          placeholder="How can we help you?"
                          value={bulkForm.subject}
                          onChange={handleBulkChange}
                          required
                        />
                      </div>

                      <div className="form-group-contact">
                        <label htmlFor="message2">Message</label>
                        <textarea
                          id="message2"
                          name="message"
                          rows="5"
                          placeholder="Tell us more about your inquiry..."
                          value={bulkForm.message}
                          onChange={handleBulkChange}
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="submit-btn-contact" disabled={submittingBulk}>
                        {submittingBulk ? (
                          <span>Sending...</span>
                        ) : (
                          <>
                            <svg className="send-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>


          {/* Contact Information Sidebar */}
          <div className="contact-info-sidebar-contact">
            {/* Contact Information */}
            <div className="contact-info-box-contact">
              <h2>Contact Information</h2>

              <div className="info-item-contact">
                <div className="info-icon-wrapper-contact">
                  <svg className="info-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="info-details-contact">
                  <h3>Email</h3>
                  <p>info@luxuramattress.com</p>
                  <p>support@luxuramattress.com</p>
                </div>
              </div>

              {/* <div className="info-item-contact">
  {/* <div className="info-icon-wrapper-contact">
    <svg className="info-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V19.92C22.0011..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>

  <div className="info-details-contact">
    <h3>Phone</h3>
    <p>+91 84602 89861</p>
    <p>+91 89805 42525</p>
  </div> 
</div> */}

              <div className="info-item-contact">
                <div className="info-icon-wrapper-contact">
                  <svg className="info-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

                <div className="info-details-contact">
                  <h3>Industrial Address</h3>
                  <p><strong>NEMI FOAM INDUSTRIES PVT. LTD.</strong></p>
                  <p>Survey No. 1136, Bh. V Trans</p>
                  <p>Off NH 08, Goblaj, Kheda – 387540</p>

                  <div className="info-details-contact">
                    <p>Mobile:+91 84602 89861,+91 89805 42525</p>
                  </div>

                </div>
              </div>

              {/* <div className="info-item-contact">
                <div className="info-icon-wrapper-contact">
                  <svg className="info-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

                <div className="info-details-contact">
                  <h3>Retail Address</h3>
                  <p>
                    <strong>
                      <img src={wordmarkWhite} alt="NemLUXURA" className="inline-wordmark" />
                      MATTRESS STUDIO
                    </strong>
                  </p>
                  <p>GF, Kumud Apartment</p>
                  <p>Opp. Gwaliya Sweets</p>
                  <p>Near Stadium Cross Roads</p>
                  <p>Navrangpura, Ahmedabad – 380009</p>
                  <p>Mobile: 98251 10919 / 70698 23363</p>
                </div>
              </div> */}


              <div className="info-item-contact">
                <div className="info-icon-wrapper-contact">
                  <svg className="info-icon-contact" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="info-details-contact">
                  <h3>Business Hours</h3>
                  <p>Monday - Saturday: 11:00 AM - 7:00 PM (IST)</p>
                  <p>Sunday: 12:00 AM - 6:00 PM (IST)</p>
                  {/* <p className="closed-contact">Sunday: Closed</p> */}
                </div>
              </div>
            </div>

            {/* Showroom Section */}
            <div className="showroom-box-contact">
              <img src={image_3} alt="Showroom" className="showroom-img-contact" />
              <div className="showroom-overlay-contact"></div>
              <div className="showroom-content-contact">
                <h3>Visit Our Showroom</h3>
                <p>Experience our mattresses in person</p>
              </div>
            </div>

            {/* Quick Support Section */}
            <div className="quick-support-box-contact">
              <h3>Quick Support</h3>

              <div className="support-category-contact">
                <h4>For Existing Customers</h4>
                <p>Order tracking, returns, warranty claims</p>
              </div>

              <div className="support-category-contact">
                <h4>For New Customers</h4>
                <p>Product information, sizing, recommendations</p>
              </div>

              <div className="support-category-contact">
                <h4>For Partners</h4>
                <p>Wholesale inquiries, business partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Contact Form Section - Below First Form */}

    </div>
  );
};

export default Contact;