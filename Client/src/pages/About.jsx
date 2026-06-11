import React, { useEffect, useRef, useState } from 'react';
import '../CSS/pages/About.css';
import { Users, Clock, Star, Phone, Target, Lightbulb, Sparkles, Leaf, Award, Heart } from 'lucide-react';
import image_2 from '../assets/image_2.jpg';
import wordmarkDark from '../assets/logo_text/image_black_text.png';
import apiService from '../services/apiService';

const About = () => {
  const observerRef = useRef(null);

  // Dynamic images state
  const [images, setImages] = useState(null);

  const renderBrandText = (text) => {
    if (!text) return text;
    const parts = text.split(/(NemLuxura|NemLUXURA)/);
    return parts.map((part, index) => {
      if (part === 'NemLuxura' || part === 'NemLUXURA') {
        return (
          <img
            key={`brand-${index}`}
            src={wordmarkDark}
            alt="NemLuxura"
            className="inline-wordmark-dark"
          />
        );
      }
      if (!part) {
        return null;
      }
      return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
    });
  };

  // Fetch dynamic images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await apiService.getAboutContent();
        if (data.success) {
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching about images:', error);
        // Keep images as null to use fallback static images
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible-about');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all scroll-reveal elements
    const elements = document.querySelectorAll('.scroll-reveal-about');
    elements.forEach((el) => observerRef.current.observe(el));

    // Separate observer for journey items with smooth, gradual visibility
    const journeyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small delay before triggering animation for smoother effect
            setTimeout(() => {
              entry.target.classList.add('visible-about');
            }, 50);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    // Observe each journey item individually for smooth sequential animation
    const journeyItems = document.querySelectorAll('.journey-item-about');
    journeyItems.forEach((item) => journeyObserver.observe(item));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (journeyObserver) {
        journeyObserver.disconnect();
      }
    };
  }, []);

  // Static text content
  const stats = [
    { icon: <Users size={32} />, value: '50K+', label: 'Happy Customers' },
    { icon: <Clock size={32} />, value: '15+', label: 'Years Experience' },
    { icon: <Star size={32} />, value: '100%', label: 'Satisfaction Rate' },
    { icon: <Phone size={32} />, value: '24/7', label: 'Customer Support' }
  ];

  const mission = {
    icon: <Target size={40} />,
    title: 'Our Mission',
    description: 'At Nemi Foam Industries Private Limited, our mission is simple yet powerful: to manufacture high-quality foam and mattresses that bring comfort, reliability, and innovation to every space we serve. We are dedicated to supporting furniture manufacturers, retailers, end-consumers, and industrial clients with foam solutions that meet today\'s needs — and anticipate tomorrow\'s demands. Every product we create reflects our deep commitment to quality, sustainability, and customer satisfaction. Our journey is driven by a passion for innovation and a responsibility to the planet. We are continuously working towards offering Reusable foam products without compromising performance. As we grow, our vision is clear: To become a market leader in the foam and mattress industry, expand our reach to global markets, and remain a trusted partner for those who value both excellence and integrity. At Nemi Foam, we don\'t just manufacture foam — we build comfort, trust, and a better tomorrow.'
  };

  const vision = {
    icon: <Lightbulb size={40} />,
    title: 'About Us',
    description: 'Welcome to Nemi Foam Industries Private Limited, the proud manufacturer behind the premium brand NemLuxura — a name synonymous with comfort, quality, and innovation in foam and mattress solutions. Founded with a clear vision to raise industry standards, Nemi Foam has grown into a trusted name among furniture manufacturers, retailers, industrial clients, and end-consumers across India and beyond. With cutting-edge technology and a commitment to excellence, we manufacture a wide range of foam and mattresses designed to enhance comfort, durability, and performance. NemLuxura is our flagship brand, created to deliver superior sleep and seating experiences. Every NemLuxura product reflects our values of quality craftsmanship, sustainability, and customer satisfaction. Whether it\'s for homes, offices, or industrial use, NemLuxura stands out as a brand that blends luxury with reliability.'
  };

  const values = [
    {
      icon: <Sparkles size={32} />,
      title: 'Quality without compromise',
      description: 'We believe in delivering the highest quality foam and mattress products that meet and exceed industry standards.',
      color: '#5b7cff'
    },
    {
      icon: <Leaf size={32} />,
      title: 'Continuous innovation',
      description: 'We are committed to continuous innovation in foam technology and manufacturing processes.',
      color: '#4caf50'
    },
    {
      icon: <Award size={32} />,
      title: 'Reusable manufacturing',
      description: 'Our commitment to sustainability drives us to develop Reusable foam products without compromising performance.',
      color: '#ffc107'
    },
    {
      icon: <Heart size={32} />,
      title: 'Customer-first approach',
      description: 'We prioritize our customers\' needs and satisfaction in everything we do, from product development to service delivery.',
      color: '#ff6b9d'
    }
  ];

  const journey = [
    { year: 'Foundation', title: 'Company Founded', description: 'Every great company begins with a vision — and Nemi Foam Industries Private Limited is no exception. What started as a commitment to deliver quality foam and mattress solutions has grown into a trusted name in the industry.' },
    { year: 'Growth', title: 'Industry Recognition', description: 'From our earliest days, we focused on precision manufacturing, customer satisfaction, and sustainable practices. With each passing year, we\'ve expanded our capabilities and invested in advanced technologies.' },
    { year: 'Expansion', title: 'Market Leadership', description: 'Along the way, we\'ve faced challenges — and embraced them as opportunities to learn and grow. These experiences have shaped our values and sharpened our focus on excellence.' },
    { year: 'Innovation', title: 'Sustainable Future', description: 'Today, we stand proud not just of what we\'ve built, but of the trust we\'ve earned. As we look to the future, we aim to expand globally and continue developing Reusable foam solutions.' },
    { year: 'Vision', title: 'Global Reach', description: 'At Nemi Foam, our journey is driven by purpose — and powered by people. We\'re not just shaping foam — We\'re shaping the future of comfort.' }
  ];

  const team = [
    {
      name: 'Mr. Chetan Shah',
      position: 'Founder Director',
      description: 'A results-driven leader with a sharp business acumen, Mr. Chetan Shah has been instrumental in scaling operations and building key industry partnerships. His focus on long-term strategy and market expansion ensures NemLuxura consistently delivers value.',
    },
    {
      name: 'Mr. Dhruv Shah',
      position: 'Director',
      description: 'Representing the new generation of leadership, Mr. Dhruv Shah brings energy, fresh perspectives, and a passion for innovation. His focus on technology integration and market trends ensures NemLuxura stays ahead in a competitive industry.',
    },
    {
      name: 'Mr. Apurva Desai',
      position: 'Founder Director',
      description: 'With a forward-thinking mindset and deep industry understanding, Mr. Apurva Desai brings strategic vision and strong leadership to Nemi Foam Industries. His belief in building a brand rooted in quality and innovation laid the foundation for NemLuxura.',
    },
    {
      name: 'Mr. Alok Desai',
      position: 'Founder Director',
      description: 'Mr. Alok Desai brings a modern approach to manufacturing and product development. His hands-on involvement in production innovation and sustainable practices has helped position Nemi Foam Industries as a trusted name in high-quality solutions.',
    },
  ];

  // Dynamic images (fallback to static if not available)
  const heroImage = images?.heroImage?.imageUrl || image_2;

  // Get team images by index
  const getTeamImage = (index) => {
    const teamImage = images?.teamImages?.find(img => img.teamMemberIndex === index);
    return teamImage?.imageUrl || null;
  };

  return (
    <div className="about-page-about">
      {/* Stats Section */}
      <section className="stats-hero-section-about scroll-reveal-about">
        <div className="stats-hero-container-about">
          {stats.map((stat, index) => (
            <div key={index} className="stat-hero-item-about" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="stat-hero-icon-about">{stat.icon}</div>
              <h3 className="stat-hero-value-about">{stat.value}</h3>
              <p className="stat-hero-label-about">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section-about">
        <div className="mission-vision-container-about">
          <div className="mission-vision-image-about scroll-reveal-about">
            <img
              src={heroImage}
              alt="Luxura Mission"
              onError={(e) => {
                e.target.src = image_2;
              }}
            />
          </div>
          <div className="mission-vision-content-about">
            <div className="mission-box-about scroll-reveal-about">
              <div className="mission-icon-about">{mission.icon}</div>
              <h2 className="mission-title-about">{mission.title}</h2>
              <p className="mission-description-about">{mission.description}</p>
            </div>
            <div className="vision-box-about scroll-reveal-about">
              <div className="vision-icon-about">{vision.icon}</div>
              <h2 className="vision-title-about">{vision.title}</h2>
              <p className="vision-description-about">
                {renderBrandText(vision.description)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="core-values-section-about">
        <div className="core-values-container-about">
          <h2 className="core-values-heading-about scroll-reveal-about">What Drives Us</h2>
          <p className="core-values-subheading-about scroll-reveal-about">
            At the heart of our business is a simple promise: To provide high-quality, innovative, and eco-conscious foam products that meet the evolving needs of our customers.
          </p>
          <div className="core-values-grid-about">
            {values.map((value, index) => (
              <div
                key={index}
                className="core-value-card-about scroll-reveal-about"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="core-value-icon-about" style={{ color: value.color }}>
                  {value.icon}
                </div>
                <h3 className="core-value-title-about">{value.title}</h3>
                <p className="core-value-description-about">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="journey-section-about">
        <div className="journey-container-about">
          <h2 className="journey-heading-about scroll-reveal-about">Our Journey</h2>
          <p className="journey-subheading-about scroll-reveal-about">
            From humble beginnings to becoming a growing force in the industry, our journey is built on hard work, smart solutions, and strong relationships.
          </p>
          <div className="journey-timeline-about">
            {journey.map((milestone, index) => (
              <div
                key={index}
                className={`journey-item-about ${index % 2 === 0 ? 'left-about' : 'right-about'} scroll-reveal-about`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="journey-card-about">
                  <div className="journey-year-about">{milestone.year}</div>
                  <h3 className="journey-title-about">{milestone.title}</h3>
                  <p className="journey-description-about">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section-about">
        <div className="team-container-about">
          <h2 className="team-heading-about scroll-reveal-about">Founders & Directors</h2>
          <p className="team-subheading-about scroll-reveal-about">
            {renderBrandText('The Visionaries Behind NemLuxura - Leadership That Builds Comfort')}
          </p>
          <div className="team-grid-about">
            {team.map((member, index) => {
              const teamImage = getTeamImage(index);
              return (
                <div
                  key={index}
                  className="team-card-about scroll-reveal-about"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {teamImage && (
                    <div className="team-image-about">
                      <img src={teamImage} alt={member.name} />
                    </div>
                  )}
                  <h3 className="team-name-about">{member.name}</h3>
                  <p className="team-position-about">{member.position}</p>
                  <p className="team-description-about">
                    {renderBrandText(member.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;