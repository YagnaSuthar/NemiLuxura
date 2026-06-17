import React, { useEffect, useRef, useState } from 'react';
import '../CSS/pages/Store-Detail.css';
import { MapPin, ExternalLink, Map, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import brandLogo from '../assets/logo_text/image_black_text.png';

const StoreDetail = () => {
  const circleRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (circleRef.current) {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) * 0.02;
        const moveY = (clientY - window.innerHeight / 2) * 0.02;

        circleRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const storeLocations = [
    {
      id: 1,
      city: 'Ahmedabad',
      area: 'CG Road',
      name: 'Mattress - CG Road, Ahmedabad',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      address: 'Kumud Apartment, 17, Stadium Cross Rd,\nCG Road, Ahmedabad, Gujarat 380009',
      mapLink: 'https://www.google.com/maps?cid=850108390689049135',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fwww.google.com%2Fmaps%3Fcid%3D850108390689049135',
      email: 'nemluxura.cgr@gmail.com',
      phones: ['+91 98251 10919', '+91 70698 23363'],
      hours: 'Mon - Sat: 11:00 AM - 8:00 PM\nSunday: Closed'
    },
    {
      id: 2,
      city: 'Ahmedabad',
      area: 'SOBO',
      name: 'Mattress - SOBO, Ahmedabad',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
      address: 'Spring meadows, A-52, Gala Gymkhana Rd,\nSouth Bopal, Ahmedabad, Gujarat 380058',
      mapLink: 'https://www.google.com/maps?cid=2923867255364257390',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fwww.google.com%2Fmaps%3Fcid%3D2923867255364257390',
      email: 'nemluxura.sobo@gmail.com',
      phones: ['+91 75677 77279'],
      hours: 'Mon - Sat: 11:00 AM - 8:00 PM\nSunday: Closed'
    },
    {
      id: 3,
      city: 'Surat',
      area: 'Ghod Dod Rd',
      name: 'Mattress - SURAT',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
      address: 'JD Point, 101 to 105, Ghod Dod Rd,\nopp. Majura Gate Fire Station, Athwa, Surat, Gujarat 395007',
      mapLink: 'https://www.google.com/maps?cid=11036225397608951874',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fwww.google.com%2Fmaps%3Fcid%3D11036225397608951874',
      email: 'nemluxura@gmail.com',
      phones: ['+91 98251 14373'],
      hours: 'Mon - Sat: 11:00 AM - 8:00 PM\nSunday: Closed'
    }
  ];

  const filteredStores = activeTab === 'All' 
    ? storeLocations 
    : storeLocations.filter(store => store.city === activeTab);

  return (
    <div className="store-detail-container">
      {/* Animated Background Shapes */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="floating-circle" ref={circleRef}></div>
      </div>

      {/* Main Content */}
      <div className="store-detail-content">
        <div className="store-header">
          <h1 className="store-title">Our Retail Stores</h1>
          <p className="store-description">
            Experience the art of absolute luxury. Step into any of our flagship experience studios to consult with our experts and test our premium mattress ranges in person.
          </p>

          {/* Elegant City Filter Tabs */}
          <div className="store-filter-tabs">
            {['All', 'Ahmedabad', 'Surat'].map((city) => (
              <button
                key={city}
                className={`store-tab-btn ${activeTab === city ? 'active' : ''}`}
                onClick={() => setActiveTab(city)}
              >
                {city}
                {activeTab === city && <span className="tab-underline"></span>}
              </button>
            ))}
          </div>
        </div>

        <div className="stores-grid">
          {filteredStores.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-card-image-wrapper">
                <img src={store.image} alt={store.name} className="store-card-image" />
                <span className="store-card-badge">{store.city}</span>
                <span className="store-card-area-overlay">{store.area}</span>
              </div>
              
              <div className="store-card-info">
                <div className="store-brand-header">
                  <img src={brandLogo} alt="nemLUXURA" className="store-card-logo" />
                  <span className="store-card-label">Experience Studio</span>
                </div>
                <h3 className="store-card-title-location">
                  <img src={brandLogo} alt="nemLUXURA" className="store-title-logo" />
                  <span className="store-title-text">{store.name}</span>
                </h3>
                
                <div className="store-divider-line"></div>

                <div className="store-info-list">
                  {/* Address */}
                  <div className="store-info-item">
                    <MapPin className="store-info-icon" size={18} />
                    <div className="store-info-text">
                      <span className="info-label">Address</span>
                      <p className="store-address-value">{store.address}</p>
                    </div>
                  </div>

                  {/* Email & Contact Details */}
                  <div className="store-info-item">
                    <Mail className="store-info-icon" size={18} />
                    <div className="store-info-text">
                      <span className="info-label">Email Address</span>
                      <a href={`mailto:${store.email}`} className="store-link-item email-link">
                        {store.email}
                      </a>
                      <div className="store-phones-list" style={{ marginTop: '2px' }}>
                        {store.phones.map((phone, index) => (
                          <a 
                            key={index} 
                            href={`tel:${phone.replace(/\s+/g, '')}`} 
                            className="store-link-item phone-link"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="store-info-item">
                    <Clock className="store-info-icon" size={18} />
                    <div className="store-info-text">
                      <span className="info-label">Showroom Hours</span>
                      <p className="store-hours-value">{store.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="store-card-footer">
                <a 
                  href={store.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="store-directions-btn"
                >
                  <Map size={16} />
                  <span>Get Directions</span>
                  <ExternalLink size={14} className="btn-external-icon" />
                </a>
                
                <div className="store-qr-container">
                  <div className="store-qr-wrapper">
                    <img src={store.qrCode} alt="Store Address QR" className="store-qr-img" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave decoration */}
      <div className="bottom-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,80 600,80 900,40 L1200,20 L1200,120 L0,120 Z" fill="#f8f9ff"></path>
        </svg>
      </div>
    </div>
  );
};

export default StoreDetail;