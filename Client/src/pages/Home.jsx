import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/pages/Home.css';
import CustomerReview from '../components/CustomerReview';
import apiService from '../services/apiService';

// Import fallback images (used if API fails or returns empty)
import back1 from '../assets/DSC_3943.JPG';
import backimg2 from '../assets/DSC_3993.JPG';
import backimg3 from '../assets/memoryfoam.jpg';
import backimg4 from '../assets/memoryfoam2.JPG';
import backimg5 from '../assets/doux2.JPG';
import backimg6 from '../assets/image_5.jpg';
import logoWordmark from '../assets/logo_text/image.png';

// Import logo images from Navbar
import logo_img1 from '../assets/IMG-20251011-WA0025-removebg-preview.png';
import logo_img2 from '../assets/IMG-20251011-WA0027-removebg-preview.png';

const Homepage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [logoSectionAnimate, setLogoSectionAnimate] = useState(false);
  const [gradientTextAnimate, setGradientTextAnimate] = useState(false);

  // State for dynamic images
  const [heroImages, setHeroImages] = useState([back1, backimg2, backimg3, backimg4, backimg5]);
  const [featuredImage, setFeaturedImage] = useState(backimg6);

  // Fallback images
  const fallbackHeroImages = [back1, backimg2, backimg3, backimg4, backimg5];
  const fallbackFeaturedImage = backimg6;

  // Fetch homepage images from API
  useEffect(() => {
    const fetchHomepageImages = async () => {
      try {
        console.log('Fetching homepage images from API...');
        const data = await apiService.getHomepageImages();
        console.log('Homepage images API response:', data);

        if (data.success) {
          // Set hero images if available (these are Cloudinary URLs)
          if (data.heroImages && data.heroImages.length > 0) {
            const heroImageUrls = data.heroImages.map(img => img.imageUrl);
            console.log('Setting hero images from Cloudinary:', heroImageUrls);
            setHeroImages(heroImageUrls);
          } else {
            console.log('No hero images found, using fallback images');
            setHeroImages(fallbackHeroImages);
          }

          // Set featured image if available (this is a Cloudinary URL)
          if (data.featuredImage && data.featuredImage.imageUrl) {
            console.log('Setting featured image from Cloudinary:', data.featuredImage.imageUrl);
            setFeaturedImage(data.featuredImage.imageUrl);
          } else {
            console.log('No featured image found, using fallback image');
            setFeaturedImage(fallbackFeaturedImage);
          }
        } else {
          console.log('API returned success: false, using fallback images');
          setHeroImages(fallbackHeroImages);
          setFeaturedImage(fallbackFeaturedImage);
        }
      } catch (error) {
        console.error('Error fetching homepage images:', error);
        // Keep fallback images if API fails
        setHeroImages(fallbackHeroImages);
        setFeaturedImage(fallbackFeaturedImage);
      }
    };

    fetchHomepageImages();
  }, []);

  const scrollToFooter = () => {
    const el = document.getElementById('footer-section');
    if (!el) return;

    // 1) Try scrollIntoView with options (modern browsers)
    if (typeof el.scrollIntoView === 'function') {
      try {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        return;
      } catch (e) {
        // Some old Android browsers crash on options object → ignore and fallback
      }
    }

    // 2) Fallback: manual scroll (works almost everywhere)
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };


  // Logo intro animation
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(introTimer);
    };
  }, []);

  // Logo section animation starts when intro screen begins fading
  // This makes the animation visible as the intro screen fades away
  useEffect(() => {
    const logoSectionTimer = setTimeout(() => {
      setLogoSectionAnimate(true);
    }, 3500); // Start exactly when intro screen begins to fade

    return () => {
      clearTimeout(logoSectionTimer);
    };
  }, []);

  // Gradient text animation starts after intro screen disappears
  useEffect(() => {
    const gradientTextTimer = setTimeout(() => {
      setGradientTextAnimate(true);
    }, 3500); // Start when intro screen begins to fade

    return () => {
      clearTimeout(gradientTextTimer);
    };
  }, []);

  // Hero image slider
  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

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
      {/* Logo Intro Screen */}
      <div className={`intro-screen-homepage ${!showIntro ? 'hidden-intro-homepage' : ''}`}>
        <div className={`logo-container-homepage ${logoVisible ? 'visible-logo-homepage' : ''}`}>
          <div className="logo-wrapper-homepage">
            <img
              src={logo_img2}
              alt="Logo"
              className="logo-img-homepage"
            />
            {/* <span className="logo-text-homepage">&</span>
            <img 
              src={logo_img1} 
              alt="Logo" 
              className="logo-img-homepage"
            /> */}
          </div>
          <p className="initiative-text-homepage">A Product by Nemi Foam industries Pvt. Ltd.</p>
          <div className="div-imglogo1"><img src={logo_img1} alt="Logo" className="initiative-logo" /></div>
        </div>
      </div>

      {/* Hero Section with Image Slider */}
      <section className="hero-homepage">
        <div className="slider-homepage">
          {heroImages.map((image, index) => (
            <div
              key={`hero-${index}-${image}`}
              className={`slide-homepage ${index === currentImageIndex ? 'active-slide-homepage' : ''
                } ${index === (currentImageIndex - 1 + heroImages.length) % heroImages.length
                  ? 'prev-slide-homepage'
                  : ''
                }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="background-homepage"
                onError={(e) => {
                  console.error('Error loading hero image:', image);
                  // Fallback to first fallback image if Cloudinary image fails
                  if (fallbackHeroImages.length > 0) {
                    e.target.src = fallbackHeroImages[0];
                  }
                }}
              />
            </div>
          ))}
        </div>

        <div className="overlay-homepage"></div>

        <div className="content-homepage">
          <h1 className={`heading-homepage ${gradientTextAnimate ? 'animate-gradient-text-homepage' : ''}`}>
            <span className="gradient-text-homepage">
              {'Luxury Sleeping'.split('').map((char, index) => (
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
          <span className={`highlight-homepage ${gradientTextAnimate ? 'animate-gradient-text-homepage' : ''}`}>
            {'Solution...'.split('').map((char, index) => (
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
            <button onClick={scrollToFooter} className="primary-btn-homepage">
              Shop Mattresses
            </button>
          </div>

          <div className="indicators-homepage">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot-homepage ${index === currentImageIndex ? 'active-indicator-homepage' : ''
                  }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Logo Section - Static Permanent */}
      <section className="logo-section-homepage">
        <div className={`logo-section-container-homepage ${logoSectionAnimate ? 'animate-logo-section-homepage' : ''}`}>
          <div className="logo-section-wrapper-homepage">
            <img
              src={logo_img2}
              alt="Logo"
              className="logo-section-img-homepage"
            />
            {/* <span className={`logo-section-text-homepage ${logoSectionAnimate ? 'animate-logo-text-homepage' : ''}`}>&</span>
            <img 
              src={logo_img1} 
              alt="Logo" 
              className="logo-section-img-homepage"
            /> */}
          </div>
          <p className={`logo-section-initiative-homepage ${logoSectionAnimate ? 'animate-logo-initiative-homepage' : ''}`}>
            A Product by Nemi Foam industries Pvt. Ltd.&nbsp;
            <div className="div-imglogo1"><img src={logo_img1} alt="Logo" className="initiative-logo" /></div>
          </p>

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
        </div>
      </section>

      {/* Why Choose Luxura Section */}
      <section className="whychoose-homepage">
        <div className="header-whychoose-homepage">
          <h2 className="title-whychoose-homepage">
            <span className="title-whychoose-text">Why Choose</span>
            <img
              src={logoWordmark}
              alt="Nem Luxura wordmark"
              className="whychoose-wordmark"
            />
          </h2>
          <p className="subtitle-whychoose-homepage">
            Every detail of our mattresses is crafted with precision to give you the sleep you deserve
          </p>
        </div>

        <div className="wrapper-whychoose-homepage">
          <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">🔮</div>
            <h3 className="heading-whychoose-homepage">Premium Foam</h3>
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

          {/* <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">🛡️</div>
            <h3 className="heading-whychoose-homepage">100-Night Trial</h3>
            <p className="text-whychoose-homepage">
              Sleep on it for 100 nights. If you don't love it, we'll take it back
            </p>
          </div> */}

          <div className="card-whychoose-homepage scroll-reveal">
            <div className="icon-whychoose-homepage">♻️</div>
            <h3 className="heading-whychoose-homepage">Reusable Materials</h3>
            <p className="text-whychoose-homepage">
              Built from carefully selected reusable materials.Safe, durable and crafted for long-lasting comfort.
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
                Carefully selected layers in the mattress work together to deliver lasting comfort and deep support.
              </li>
              <li className="feature-item-homepage">
                Encourages natural body posture, helping the mattress reduce strain and support refreshed mornings.
              </li>
              <li className="feature-item-homepage">
                Built to remain hygienic and durable, the mattress stays fresh and resists moisture and allergens over time.
              </li>
              <li className="feature-item-homepage">
                Adapts to every sleeping style, ensuring the mattress offers balanced comfort for side, back, or stomach sleepers.
              </li>
            </ul>

            <div className="buttons-featured-homepage">
              <button
                onClick={scrollToFooter}
                className="primary-btn-featured"
              >
                Get Contact
              </button>
              {/* <button 
                onClick={() => navigate('/product-details')} 
                className="secondary-btn-featured"
              >
                Learn More
              </button> */}
            </div>
          </div>

          <div className="image-featured-homepage scroll-reveal">
            <img
              src={featuredImage}
              alt="Featured Mattress"
              className="featured-img-homepage"
              onError={(e) => {
                console.error('Error loading featured image:', featuredImage);
                // Fallback to fallback featured image if Cloudinary image fails
                e.target.src = fallbackFeaturedImage;
              }}
            />
            <div className="badge-featured-homepage">
              <span className="badge-number-homepage">3</span>
              <span className="badge-text-homepage">Options in</span>
              <span className="badge-text-homepage">Shopping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReview />

      {/* Newsletter Section */}
      {/* <section className="newsletter-homepage">
        <div className="container-newsletter-homepage">
          <h2 className="title-newsletter-homepage">Sleep Better Tonight</h2>
          <p className="description-newsletter-homepage">
            Get sleep tips, exclusive offers, and be the first to know about our latest innovations
          </p>
          <form
            className="form-newsletter-homepage"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Coming soon');
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input-newsletter-homepage"
              required
            />
            <button type="submit"  className="btn-newsletter-homepage">
              Subscribe
            </button>
          </form>
        </div>
      </section> */}
    </div>
  );
};

export default Homepage;