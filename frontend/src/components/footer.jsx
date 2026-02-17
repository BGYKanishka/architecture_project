import React from 'react';
// Note: npm install react-icons 
import { FaFacebookF, FaWordpress, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { BookOpenIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Column 1: Logo and Branding */}
        <div className="footer-section branding">
          <div className="bg-blue-800 p-2 rounded-lg text-white w-fit mb-4">
            <BookOpenIcon className="w-8 h-8" />
          </div>
          <h3 className="branding-text">
            Colombo International <br />
            <span className="highlight">Book Fair</span>
          </h3>
          <p className="location-tag">
            <FaMapMarkerAlt className="location-icon" /> <span>Colombo - Sri Lanka.</span>
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
            <a href="https://www.facebook.com/ColomboInternationalBookFair" className="social-box"><FaFacebookF /></a>
            <a href="https://en.wikipedia.org/wiki/Colombo_International_Book_Fair" className="social-box"><FaWordpress /></a>
          </div>
          {/* Map Preview */}
          <div className="map-preview">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.46879268393!2d79.87052968715833!3d6.901682399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597f9d09a467%3A0xee0b9455e960eba5!2sBandaranaike%20Memorial%20International%20Conference%20Hall!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BMICH Map"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright ©{currentYear} All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer-container {
          background-color: #1a202c; 
          color: white;
          padding: 4rem 0 2rem 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 100%;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1.5fr 1.2fr;
          gap: 3rem;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 2rem;
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
          gap: 10px;
          margin-top: 20px;
          font-weight: 500;
        }
        .location-icon {
          color: #ff4d4d;
          font-size: 1.2rem; 
        }
        .footer-section h4 {
          margin-bottom: 1.8rem;
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          position: relative;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        .footer-section ul li {
          margin-bottom: 14px;
        }
        .footer-section a {
          color: #cbd5e0;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.3s ease;
        }
        .footer-section a:hover {
          color: #ffffff;
        }
        .contact-item {
          display: flex;
          gap: 15px;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }
        .contact-item p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #cbd5e0;
        }
        .blue-icon {
          color: #4299e1;
          font-size: 1.2rem;
          min-width: 20px;
          margin-top: 3px;
        }
        .social-icons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .social-box {
          background: #2b6cb0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: white;
          transition: background 0.3s ease;
        }
        .social-box:hover {
          background: #3182ce;
        }
        .map-preview {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          border: 1px solid #4a5568;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .map-preview img {
          width: 100%;
          display: block;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          margin-top: 4rem;
          border-top: 1px solid #2d3748;
          color: #a0aec0;
          font-size: 0.9rem;
        }

        /* Responsive handling */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem 2rem;
          }
        }
        @media (max-width: 600px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-container {
             padding: 3rem 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;