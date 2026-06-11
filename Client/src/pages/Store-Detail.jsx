import React, { useEffect, useRef } from 'react';
import '../CSS/pages/Store-Detail.css';
import { MapPin, ExternalLink, Map } from 'lucide-react';
import brandLogo from '../assets/logo_text/image_black_text.png';

const StoreDetail = () => {
  const circleRef = useRef(null);

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
      area: 'Navrangpura',
      name: 'Navrangpura Store',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      address: 'GF, Kumud Apartment\nOpp. Gwaliya Sweets\nNear Stadium Cross Roads\nNavrangpura, Ahmedabad – 380009',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=GF,+Kumud+Apartment,+Opp.+Gwaliya+Sweets,+Near+Stadium+Cross+Roads,+Navrangpura,+Ahmedabad+380009',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GF%2C%20Kumud%20Apartment%20Opp.%20Gwaliya%20Sweets%20Near%20Stadium%20Cross%20Roads%20Navrangpura%2C%20Ahmedabad%20%E2%80%93%20380009',
    },
    {
      id: 2,
      city: 'Ahmedabad',
      area: 'South Bopal',
      name: 'South Bopal Store',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      address: 'Spring meadows, A-52, Gala Gymkhana Rd, nr. SOBO Center Road, Sector - 7, South Bopal, Bopal, Ahmedabad, Gujarat 380058',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=Spring+meadows,+A-52,+Gala+Gymkhana+Rd,+nr.+SOBO+Center+Road,+Sector+7,+South+Bopal,+Ahmedabad,+Gujarat+380058',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Spring%20meadows%2C%20A-52%2C%20Gala%20Gymkhana%20Rd%2C%20nr.%20SOBO%20Center%20Road%2C%20Sector%20-%207%2C%20South%20Bopal%2C%20Bopal%2C%20Ahmedabad%2C%20Gujarat%20380058',
    },
    {
      id: 3,
      city: 'Surat',
      area: 'Athwa / Ghod Dod Rd',
      name: 'Surat Store',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      address: 'JD Point, 101 to 105, Ghod Dod Rd, opp. Majura Fire Bridge, Income Tax Colony, Athwa, Surat, Gujarat 395007',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=JD+Point,+101+to+105,+Ghod+Dod+Rd,+opp.+Majura+Fire+Bridge,+Income+Tax+Colony,+Athwa,+Surat,+Gujarat+395007',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JD%20Point%2C%20101%20to%20105%2C%20Ghod%20Dod%20Rd%2C%20opp.%20Majura%20Fire%20Bridge%2C%20Income%20Tax%20Colony%2C%20Athwa%2C%20Surat%2C%20Gujarat%20395007',
    }
  ];

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
          <span className="store-subtitle">Visit Our Experience Centres</span>
          <h1 className="store-title">Our Retail Stores</h1>
          <p className="store-description">
            Step into the world of luxury comfort. Visit our retail experience centres to test our premium range of mattresses, custom foams, and sleep accessories.
          </p>
        </div>

        <div className="stores-grid">
          {storeLocations.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-card-image-wrapper">
                <img src={store.image} alt={store.name} className="store-card-image" />
                <span className="store-card-badge">{store.city}</span>
              </div>
              <div className="store-card-info">
                <span className="store-card-area">{store.area}</span>
                <h3 className="store-card-title">
                  <img src={brandLogo} alt="nemLUXURA" className="store-card-logo" />
                  <span className="store-card-logo-separator">-</span>
                  <span className="store-card-title-location">{store.name}</span>
                </h3>
                
                <div className="store-card-address-block">
                  <MapPin className="store-address-icon" size={18} />
                  <p className="store-card-address">{store.address}</p>
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
                  <img src={store.qrCode} alt="Store Address QR" className="store-qr-img" />
                  <span className="store-qr-text">Scan QR for Maps</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="bottom-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,80 600,80 900,40 L1200,20 L1200,120 L0,120 Z" fill="#f8f9ff"></path>
        </svg>
      </div>
    </div>
  );
};

export default StoreDetail;