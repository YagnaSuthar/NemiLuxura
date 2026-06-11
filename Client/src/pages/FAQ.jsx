import React, { useState } from 'react';
import '../CSS/pages/FAQ.css';
import wordmarkDark from '../assets/logo_text/image_black_text.png';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollToFooter = () => {
    document
      .getElementById('footer-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderWithWordmark = (text) => {
    return text.split('Luxura').map((segment, index, arr) => (
      <React.Fragment key={`segment-${index}`}>
        {segment}
        {index < arr.length - 1 && (
          <img
            src={wordmarkDark}
            alt="Luxura"
            className="inline-wordmark-dark"
          />
        )}
      </React.Fragment>
    ));
  };

  const faqData = [
    {
      question: "What makes Luxura mattresses different?",
      answer: "Luxura mattresses are crafted with premium materials and innovative sleep technology. We use high-density memory foam, advanced cooling gel layers to provide optimal support and comfort. Our mattresses are designed to adapt to your body's unique contours while maintaining proper spinal alignment throughout the night."
    },
    {
      question: "How long is the warranty on Luxura mattresses?",
      answer: "All Luxura mattresses come with a comprehensive varies from 5 to 15 years warranty that covers manufacturing defects and material issues. This warranty ensures your investment is protected and demonstrates our confidence in the quality and durability of our products."
    },
    {
      question: "Can I customize the Size of my mattress?",
      answer: "Yes! You can customize the size of your mattress to perfectly fit your bed frame or specific space requirements. We offer a wide range of size options and can tailor dimensions based on your needs. Enjoy a mattress designed exactly the way you want, without any compromise on comfort or quality."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery typically takes 5-7 business days from the date of order. Expedited shipping options are also available for faster delivery."
    },
    {
      question: "Can I customize the Firmness of my mattress?",
      answer: "Yes, Luxura offers multiple firmness levels for most of our mattress models. You can choose from soft, medium, medium-firm, and firm options to match your personal comfort preferences. Our sleep specialists are available to help you select the perfect firmness level based on your sleeping position and body type."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. We also offer financing options, allowing you to split your purchase into manageable monthly payments at competitive rates."
    },
    {
      question: "How do I clean and maintain my Luxura mattress?",
      answer: "To maintain your mattress, we recommend rotating it 180 degrees every 3-6 months to ensure even wear. Use a mattress protector to guard against spills and stains. For cleaning, spot clean with mild detergent and warm water, and allow it to air dry completely. Vacuum regularly to remove dust and allergens."
    },
    // {
    //   question: "Do you offer mattresses for different sleeping positions?",
    //   answer: "Absolutely! We have mattresses specifically designed for back sleepers, side sleepers, stomach sleepers, and combination sleepers. Our sleep quiz can help you find the perfect match for your sleeping style. Each mattress is engineered to provide optimal support and pressure relief based on different sleeping positions."
    // }
  ];

  return (
    <div className="faq-page-faq">
      {/* Hero Section */}
      <section className="faq-hero-faq">
        <div className="faq-hero-overlay-faq"></div>
        <div className="faq-hero-content-faq">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our mattresses, delivery,<br />warranty, and more.</p>
        </div>
      </section>

      {/* FAQ Content Section */}
      <section className="faq-content-section-faq">
        <div className="faq-container-faq">
          <div className="faq-list-faq">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`faq-item-faq ${openIndex === index ? 'active-faq' : ''}`}
              >
                <button
                  className="faq-question-faq"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{renderWithWordmark(faq.question)}</span>
                  <svg
                    className={`faq-icon-faq ${openIndex === index ? 'rotate-faq' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`faq-answer-faq ${openIndex === index ? 'open-faq' : ''}`}>
                  <div className="faq-answer-content-faq">
                    <p>{renderWithWordmark(faq.answer)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="faq-cta-section-faq">
        <div className="faq-cta-container-faq">
          <div className="faq-cta-content-faq">
            <div className="faq-cta-icon-faq">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Still have questions?</h2>
            <p>Our customer service team is here to help you find the perfect sleep solution.</p>
            <button className="faq-contact-btn-faq" onClick={scrollToFooter}>
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;