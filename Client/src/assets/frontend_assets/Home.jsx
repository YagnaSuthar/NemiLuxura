import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/pages/Home.css';
import CustomerReview from '../../components/CustomerReview';

// Import your 5 hero background images
import back1 from '../assets/frontend_assets/back1.jpg';
import backimg1 from '../assets/frontend_assets/backimg2.webp';
import backimg2 from '../assets/frontend_assets/p_img4.png';
import backimg3 from '../assets/frontend_assets/p_img8.png';
import backimg4 from '../assets/frontend_assets/p_img10.png';

// Import featured product image
import featuredMattress from '../assets/frontend_assets/p_img1.png'; // Add your image path

const Homepage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [back1, backimg1, backimg2, backimg3, backimg4];

  // Hero image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        } else {
          // Remove class when element goes out of view
          entry.target.classList.remove('reveal-visible');
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    return () => {
      scrollElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="container-homepage">
      {/* Hero Section with Image Slider */}
      <section className="hero-homepage">
        <div className="slider-homepage">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`slide-homepage ${
                index === currentImageIndex ? 'active-slide-homepage' : ''
              } ${
                index === (currentImageIndex - 1 + heroImages.length) % heroImages.length
                  ? 'prev-slide-homepage'
                  : ''
              }`}
            >
              <img 
                src={image} 
                alt={`Hero ${index + 1}`} 
                className="background-homepage"
              />
            </div>
          ))}
        </div>
        
        <div className="overlay-homepage"></div>
        
        <div className="content-homepage">
          <h1 className="heading-homepage">
            <span className="gradient-text-homepage">
              {'Sleep Like Never'.split('').map((char, index) => (
                <span 
                  key={index} 
                  className="char" 
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </h1>
          <span className="highlight-homepage">
              {'Before'.split('').map((char, index) => (
                <span 
                  key={index} 
                  className="char" 
                  style={{ animationDelay: `${(index + 16) * 0.08}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          <p className="description-homepage">
            Experience the perfect blend of comfort, support, and innovation 
            with our premium mattresses designed for your best night's sleep.
          </p>
          
          <div className="buttons-homepage">
            <button 
              onClick={() => navigate('/collection')} 
              className="primary-btn-homepage"
            >
              Shop Mattresses →
            </button>
          </div>

          <div className="indicators-homepage">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot-homepage ${
                  index === currentImageIndex ? 'active-indicator-homepage' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-homepage">
        <div className="wrapper-features-homepage">
          <div className="feature-card-homepage scroll-reveal">
            <div className="icon-feature-homepage">🛏️</div>
            <h3 className="title-feature-homepage">Premium Quality</h3>
            <p className="text-feature-homepage">
              Crafted with the finest materials for ultimate comfort and durability.
            </p>
          </div>

          <div className="feature-card-homepage scroll-reveal">
            <div className="icon-feature-homepage">✨</div>
            <h3 className="title-feature-homepage">Innovative Design</h3>
            <p className="text-feature-homepage">
              Advanced technology meets ergonomic excellence for perfect support.
            </p>
          </div>

          <div className="feature-card-homepage scroll-reveal">
            <div className="icon-feature-homepage">💤</div>
            <h3 className="title-feature-homepage">Better Sleep</h3>
            <p className="text-feature-homepage">
              Wake up refreshed and energized with our sleep optimization technology.
            </p>
          </div>
           
          <div className="feature-card-homepage scroll-reveal">
            <div className="icon-feature-homepage">💤</div>
            <h3 className="title-feature-homepage">Better Sleep</h3>
            <p className="text-feature-homepage">
              Wake up refreshed and energized with our sleep optimization technology.
            </p>
          </div>

          
        </div>
      </section>

      {/* Why Choose Luxura Section */}
      <section className="whychoose-homepage">
        <div className="header-whychoose-homepage">
          <h2 className="title-whychoose-homepage">Why Choose Luxura?</h2>
          <p className="subtitle-whychoose-homepage">
            Every detail of our mattresses is crafted with precision to give you the sleep you deserve
          </p>
        </div>

        <div className="wrapper-whychoose-homepage">
          <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">🔮</div>
            <h3 className="heading-whychoose-homepage">Premium Memory Foam</h3>
            <p className="text-whychoose-homepage">
              Adaptive support that contours to your body for perfect spinal alignment
            </p>
          </div>

          <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">🌡️</div>
            <h3 className="heading-whychoose-homepage">Temperature Regulation</h3>
            <p className="text-whychoose-homepage">
              Advanced cooling technology keeps you comfortable all night long
            </p>
          </div>

          <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">🛡️</div>
            <h3 className="heading-whychoose-homepage">100-Night Trial</h3>
            <p className="text-whychoose-homepage">
              Sleep on it for 100 nights. If you don't love it, we'll take it back
            </p>
          </div>

          <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">♻️</div>
            <h3 className="heading-whychoose-homepage">Eco-Friendly Materials</h3>
            <p className="text-whychoose-homepage">
              Sustainably sourced materials that are safe for you and the planet
            </p>
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="featured-product-homepage">
        <div className="container-featured-homepage">
          <div className="content-featured-homepage scroll-reveal">
            <h2 className="title-featured-homepage">
              The Perfect Mattress for Every Sleep Style
            </h2>
            <p className="description-featured-homepage">
              Our signature mattress combines the latest in sleep technology with 
              premium materials to deliver unparalleled comfort and support.
            </p>
            
            <ul className="features-list-homepage">
              <li className="feature-item-homepage">
                7-zone pocket spring system for targeted support
              </li>
              <li className="feature-item-homepage">
                Natural latex layer for responsive comfort
              </li>
              <li className="feature-item-homepage">
                Bamboo fiber cover for breathability
              </li>
              <li className="feature-item-homepage">
                Motion isolation for undisturbed sleep
              </li>
            </ul>
            
            <div className="buttons-featured-homepage">
              <button 
                onClick={() => navigate('/collection')} 
                className="primary-btn-featured"
              >
                Shop Now - ₹25,999
              </button>
              <button 
                onClick={() => navigate('/product-details')} 
                className="secondary-btn-featured"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="image-featured-homepage scroll-reveal">
            <img 
              src={featuredMattress} 
              alt="Featured Mattress" 
              className="featured-img-homepage"
            />
            <div className="badge-featured-homepage">
              <span className="badge-number-homepage">100</span>
              <span className="badge-text-homepage">Night Trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReview />

      {/* Newsletter Section */}
      <section className="newsletter-homepage">
        <div className="container-newsletter-homepage">
          <h2 className="title-newsletter-homepage">Sleep Better Tonight</h2>
          <p className="description-newsletter-homepage">
            Get sleep tips, exclusive offers, and be the first to know about our latest innovations
          </p>
          <form className="form-newsletter-homepage" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-newsletter-homepage"
              required
            />
            <button type="submit" className="btn-newsletter-homepage">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Homepage;