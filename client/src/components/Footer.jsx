import React from "react";
import { Link } from "react-router-dom";
import {
  FaNewspaper,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaArrowUp,
} from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/community", label: "Community" },
    { to: "/polls", label: "Polls" },
    { to: "/contact", label: "Contact Us" },
  ];

  const categories = [
    { to: "/", label: "National" },
    { to: "/", label: "International" },
    { to: "/", label: "Politics" },
    { to: "/", label: "Technology" },
    { to: "/", label: "Sports" },
    { to: "/", label: "Entertainment" },
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FaNewspaper className="w-5 h-5 text-primary-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-[Playfair_Display] text-white tracking-tight">
                  Janawaj
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-primary-400">
                  News Agency
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted source for breaking news, in-depth analysis, and
              comprehensive coverage of events that matter. Stay informed with
              Janawaj.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {[
                { icon: <FaFacebook />, href: "#", label: "Facebook" },
                { icon: <FaTwitter />, href: "#", label: "Twitter" },
                { icon: <FaInstagram />, href: "#", label: "Instagram" },
                { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
                { icon: <FaYoutube />, href: "#", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label={social.label}
                >
                  {React.cloneElement(social.icon, { className: "w-4 h-4" })}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <HiLocationMarker className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  introducing soon
                  <br />
                  on pending
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Coming soon...
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@janawaj.com"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  janawajmanage@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Janawaj News Agency. All rights
              reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-500 hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
