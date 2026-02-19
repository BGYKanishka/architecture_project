import React from 'react';
import { FaFacebookF, FaWordpress, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { BookOpenIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="bg-[#1a202c] text-white pt-12 pb-6 font-sans w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr_1.5fr_1.2fr] gap-8 lg:gap-12 max-w-400 mx-auto px-8 mb-8">

          {/* Column 1: Logo and Branding */}
          <div className="flex flex-col">
            <div className="bg-blue-800 p-2 rounded-lg text-white w-fit mb-4">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <h3 className="text-[1.8rem] font-normal leading-tight">
              Colombo International <br />
              <span className="font-extrabold font-sans text-3xl block mt-1">Book Fair</span>
            </h3>
            <p className="text-white flex items-center gap-2 mt-5 font-medium">
              <FaMapMarkerAlt className="text-[#ff4d4d] text-xl" /> <span>Colombo - Sri Lanka.</span>
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="mb-4 text-xl font-semibold tracking-wide">Quick Links</h4>
            <ul className="list-none p-0">
              <li className="mb-3.5"><a href="/" className="text-slate-300 no-underline text-base transition-colors duration-300 hover:text-white">Home</a></li>
              <li className="mb-3.5"><a href="/about" className="text-slate-300 no-underline text-base transition-colors duration-300 hover:text-white">About</a></li>
              <li className="mb-3.5"><a href="/event" className="text-slate-300 no-underline text-base transition-colors duration-300 hover:text-white">Event</a></li>
              <li className="mb-3.5"><a href="/gallery" className="text-slate-300 no-underline text-base transition-colors duration-300 hover:text-white">Photo Gallery</a></li>
              <li className="mb-3.5"><a href="/map" className="text-slate-300 no-underline text-base transition-colors duration-300 hover:text-white">Map</a></li>
              <li className="mb-3.5"><a href="/contact" className="text-slate-300 no-underline text-base transition-colors duration-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="mb-4 text-xl font-semibold tracking-wide">Have a Question?</h4>
            <div className="flex gap-4 mb-3 items-start">
              <FaMapMarkerAlt className="text-blue-500 text-xl min-w-[20px] mt-1" />
              <p className="m-0 text-[0.95rem] leading-relaxed text-slate-300">SLBPA<br />No: 83 New Parliament Rd, Battaramulla, Sri Lanka.</p>
            </div>
            <div className="flex gap-4 mb-3 items-start">
              <FaPhoneAlt className="text-blue-500 text-xl min-w-[20px] mt-1" />
              <p className="m-0 text-[0.95rem] leading-relaxed text-slate-300">+94 112 785 480</p>
            </div>
            <div className="flex gap-4 mb-3 items-start">
              <FaEnvelope className="text-blue-500 text-xl min-w-[20px] mt-1" />
              <p className="m-0 text-[0.95rem] leading-relaxed text-slate-300">srilankabookpublishers@gmail.com</p>
            </div>
          </div>

          {/* Column 4: Event Details */}
          <div>
            <h4 className="mb-4 text-xl font-semibold tracking-wide">Event Details</h4>
            <div className="flex gap-4 mb-3 items-start">
              <FaCalendarAlt className="text-blue-500 text-xl min-w-[20px] mt-1" />
              <p className="m-0 text-[0.95rem] leading-relaxed text-slate-300">25<sup>th</sup> September to 04<sup>th</sup> October 2026</p>
            </div>
            <div className="flex gap-4 mb-3 items-start">
              <FaClock className="text-blue-500 text-xl min-w-[20px] mt-1" />
              <p className="m-0 text-[0.95rem] leading-relaxed text-slate-300">9.00 AM to 9.00 PM</p>
            </div>
            <div className="flex gap-4 mb-3 items-start">
              <FaMapMarkerAlt className="text-blue-500 text-xl min-w-[20px] mt-1" />
              <p className="m-0 text-[0.95rem] leading-relaxed text-slate-300">BMICH, Bauddhaloka Mawatha, Colombo 07.</p>
            </div>
          </div>

          {/* Column 5: Socials & Map */}
          <div>
            <h4 className="mb-4 text-xl font-semibold tracking-wide">Follow Us</h4>
            <div className="flex gap-3 mb-5">
              <a href="https://www.facebook.com/ColomboInternationalBookFair" className="bg-blue-700 w-9 h-9 flex items-center justify-center rounded-md text-white transition-colors duration-300 hover:bg-blue-600"><FaFacebookF /></a>
              <a href="https://en.wikipedia.org/wiki/Colombo_International_Book_Fair" className="bg-blue-700 w-9 h-9 flex items-center justify-center rounded-md text-white transition-colors duration-300 hover:bg-blue-600"><FaWordpress /></a>
            </div>
            {/* Map Preview */}
            <div className="w-full rounded-lg overflow-hidden relative border border-slate-600 shadow-md">
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

        <div className="text-center pt-4 border-t border-slate-700 text-slate-400 text-sm">
          <p>Copyright ©{currentYear} All rights reserved.</p>
        </div>
      </footer>
  );
};

export default Footer;