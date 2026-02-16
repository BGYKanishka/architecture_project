import React from 'react';
// Note: npm install react-icons 
import { FaFacebookF, FaWordpress, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Column 1: Logo and Branding */}
        <div className="footer-section branding">
          <img 
            src="/assets/cibf-logo.png" 
            alt="CIBF Logo" 
            className="footer-logo" 
          />
          <h3 className="branding-text">
            Colombo International <br />
            <span className="highlight">Book Fair</span>
          </h3>
          <p className="location-tag">
            <FaMapMarkerAlt className="location-icon"/> <span>Colombo - Sri Lanka.</span>
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/event">Event</a></li>
            <li><a href="/gallery">Photo Gallery</a></li>
            <li><a href="/map">Map</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-section info">
          <h4>Have a Questions?</h4>
          <div className="contact-item">
            <FaMapMarkerAlt className="icon blue-icon" />
            <p>SLBPA<br />No: 83 New Parliament Rd, Battaramulla, Sri Lanka.</p>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="icon blue-icon" />
            <p>+94 112 785 480</p>
          </div>
          <div className="contact-item">
            <FaEnvelope className="icon blue-icon" />
            <p>srilankabookpublishers@gmail.com</p>
          </div>
        </div>

        {/* Column 4: Event Details */}
        <div className="footer-section">
          <h4>Event Details</h4>
          <div className="contact-item">
            <FaCalendarAlt className="icon blue-icon" />
            <p>25<sup>th</sup> September to 04<sup>th</sup> October 2026</p>
          </div>
          <div className="contact-item">
            <FaClock className="icon blue-icon" />
            <p>9.00 AM to 9.00 PM</p>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="icon blue-icon" />
            <p>BMICH, Bauddhaloka Mawatha, Colombo 07.</p>
          </div>
        </div>

        {/* Column 5: Socials & Map */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" className="social-box"><FaFacebookF /></a>
            <a href="#" className="social-box"><FaWordpress /></a>
          </div>
          {/* Map Preview Placeholder */}
          <div className="map-preview">
             <img src="/assets/map-screenshot.png" alt="BMICH Map" />
             <div className="map-overlay">View larger map</div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Copyright ©{currentYear} All rights reserved | This web is made by SLBPA</p>
      </div>

      <style jsx>{`
        .footer-container {
          background-color: #1a202c; 
          color: white;
          padding: 4rem 0 1rem 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 100%;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 0.8fr 1.2fr 1.2fr 1.2fr;
          gap: rem;
          max-width: 1300px;
          margin: 0 auto;
          padding: 2 2rem;
        }
        .footer-logo {
          width: 90px;
          margin-bottom: 15px;
        }
        .branding-text {
          font-size: 1.8rem;
          font-weight: 400;
          line-height: 1.1;
          font-family: 'Inter' , 'Segoe UI' , sans-serif;
        }
        .branding-text .highlight {
          font-weight: 800;
          font-family: 'Montserrat', sans-serif;
          font-size: 2rem;
          display: block;
          margin-top: 5px;
        }
        .location-tag {
          color: #ffffff; 
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
          font-weight: 500;
        }
        .location-icon {
          color: #ff4d4d;
          font-size: 1.1rem; 
        }
        .footer-section h4 {
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          font-weight: 600;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        .footer-section ul li {
          margin-bottom: 12px;
        }
        .footer-section a {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.95rem;
        }
        .contact-item {
          display: flex;
          gap: 12px;
          margin-bottom: 1.2rem;
          align-items: flex-start;
        }
        .contact-item p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .blue-icon {
          color: #3182ce;
          font-size: 1.1rem;
          min-width: 20px;
        }
        .social-icons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        .social-box {
          background: #2b6cb0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        .map-preview {
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          border: 1px solid #4a5568;
        }
        .map-preview img {
          width: 100%;
          display: block;
        }
        .map-overlay {
            position: absolute;
            top: 5px;
            left: 5px;
            background: rgba(255,255,255,0.9);
            color: #3182ce;
            padding: 2px 8px;
            font-size: 10px;
            border-radius: 2px;
        }
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          margin-top: 3rem;
          border-top: 1px solid #2d3748;
          color: #ffffff;
          font-size: 0.9rem;
        }

        /* Responsive handling */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;