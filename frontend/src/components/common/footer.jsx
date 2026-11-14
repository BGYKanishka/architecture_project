import React from 'react';
import { FaFacebookF, FaWordpress, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070d] text-slate-300 pt-16 pb-8 font-sans w-full border-t border-slate-800/80">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr_1.5fr_1.2fr] gap-8 lg:gap-12 max-w-7xl mx-auto px-6 sm:px-8 mb-12">

        {/* Column 1: Logo and Branding */}
        <div className="flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white w-fit mb-4 shadow-lg shadow-indigo-600/20">
            <BookOpenIcon className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-white leading-tight">
            Colombo International <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 block mt-1">
              Book Fair 2026
            </span>
          </h3>
          <p className="text-slate-400 flex items-center gap-2 mt-4 text-sm font-medium">
            <FaMapMarkerAlt className="text-rose-500 text-base shrink-0" />
            <span>BMICH, Colombo, Sri Lanka</span>
          </p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Organized annually by the Sri Lanka Book Publishers’ Association (SLBPA).
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/map" className="text-slate-400 hover:text-white transition-colors">Live Floor Plan</Link></li>
            <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About CIBF</Link></li>
            <li><Link to="/help" className="text-slate-400 hover:text-white transition-colors">Exhibitor Guidelines</Link></li>
            <li><button type="button" onClick={() => AuthService.login()} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Publisher Sign In</button></li>
            <li><button type="button" onClick={() => AuthService.register()} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Register as Vendor</button></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Organizer Contact</h4>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <div className="flex gap-3 items-start">
              <FaMapMarkerAlt className="text-indigo-400 text-sm mt-0.5 shrink-0" />
              <p className="m-0">SLBPA Headquarters<br />No: 83 New Parliament Rd, Battaramulla, Sri Lanka.</p>
            </div>
            <div className="flex gap-3 items-center">
              <FaPhoneAlt className="text-indigo-400 text-sm shrink-0" />
              <p className="m-0 font-mono">+94 112 785 480</p>
            </div>
            <div className="flex gap-3 items-center">
              <FaEnvelope className="text-indigo-400 text-sm shrink-0" />
              <p className="m-0">srilankabookpublishers@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Column 4: Event Details */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Fair Schedule</h4>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex gap-3 items-start">
              <FaCalendarAlt className="text-indigo-400 text-sm mt-0.5 shrink-0" />
              <p className="m-0">September 18 – 27, 2026<br /><span className="text-indigo-400 font-semibold">10 Consecutive Days</span></p>
            </div>
            <div className="flex gap-3 items-start">
              <FaClock className="text-indigo-400 text-sm mt-0.5 shrink-0" />
              <p className="m-0">9:00 AM – 7:00 PM Daily</p>
            </div>
            <div className="flex gap-3 items-start">
              <FaMapMarkerAlt className="text-indigo-400 text-sm mt-0.5 shrink-0" />
              <p className="m-0">BMICH, Bauddhaloka Mawatha, Colombo 07</p>
            </div>
          </div>
        </div>

        {/* Column 5: Socials */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Community</h4>
          <div className="flex gap-2.5 mb-5">
            <a
              href="https://www.facebook.com/ColomboInternationalBookFair"
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500 w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Colombo_International_Book_Fair"
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500 w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <FaWordpress size={14} />
            </a>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400">
            <span className="font-bold text-white block mb-0.5">Need Help with Stalls?</span>
            Direct questions to the Fair Secretariat desk at BMICH.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-6 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {currentYear} Colombo International Book Fair. All rights reserved.</p>
        <p className="text-slate-500">Powered by Modular Spring Boot & React Digital Architecture</p>
      </div>
    </footer>
  );
};

export default Footer;
