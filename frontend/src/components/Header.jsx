import React, { useState } from 'react';
// Importing lucide-react icons for a modern look
import { Menu, Home, Search, Info, Mail } from 'lucide-react';

// The Header component now accepts an 'onNavigate' prop, which is a function
// that will be called when a navigation link is clicked.
const Header = ({ onNavigate }) => { // Added onNavigate as a prop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // Outer header container with animated background
    <header
      className="text-white py-4 shadow-xl fixed top-0 w-full z-50 overflow-hidden" // Increased shadow, higher z-index
      style={{
        animation: 'color-shift 8s infinite alternate ease-in-out', // Slower, smoother animation
        background: 'linear-gradient(90deg, rgba(29,78,216,0.9) 0%, rgba(59,130,246,0.9) 100%)', // Initial gradient
      }}
    >
      {/* CSS Keyframes for the background animation */}
      <style>
        {`
          @keyframes color-shift {
            0% { background-color: rgba(29, 78, 216, 0.9); } /* Original blue */
            25% { background-color: rgba(59, 130, 246, 0.9); } /* Lighter blue */
            50% { background-color: rgba(29, 78, 216, 0.9); } /* Back to original blue */
            75% { background-color: rgba(59, 130, 246, 0.9); } /* Lighter blue again */
            100% { background-color: rgba(29, 78, 216, 0.9); } /* Original blue */
          }
          /* This transition ensures smooth changes for things like mobile menu opening */
          .mobile-menu-transition {
            transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          }
        `}
      </style>

      {/* Main content container for desktop and logo */}
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        {/* Logo/App Title section - now clickable to navigate to home */}
        <div
          className="flex-shrink-0 flex items-center gap-2 text-3xl font-extrabold font-inter cursor-pointer tracking-wide transform hover:scale-105 transition-transform duration-200"
          onClick={() => onNavigate('home')} // Navigate to home on logo click
        >
          <Search size={32} strokeWidth={2.5} className="text-white" /> {/* Explicitly set icon color to white */}
          <span className="text-white text-shadow-md">Scan Me</span> {/* Explicitly set text color to white */}
        </div>

        {/* Desktop Navigation Links - now using buttons and onNavigate prop */}
        <nav className="hidden md:flex space-x-8 items-center">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors duration-200 font-semibold text-lg py-2 px-3 rounded-md hover:bg-blue-700 bg-transparent border-none cursor-pointer">
            <Home size={20} /> Home
          </button>
          <button onClick={() => onNavigate('scanUrl')} className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors duration-200 font-semibold text-lg py-2 px-3 rounded-md hover:bg-blue-700 bg-transparent border-none cursor-pointer">
            <Search size={20} /> Scan URL
          </button>
          <button onClick={() => onNavigate('about')} className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors duration-200 font-semibold text-lg py-2 px-3 rounded-md hover:bg-blue-700 bg-transparent border-none cursor-pointer">
            <Info size={20} /> About
          </button>
          <button onClick={() => onNavigate('contact')} className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors duration-200 font-semibold text-lg py-2 px-3 rounded-md hover:bg-blue-700 bg-transparent border-none cursor-pointer">
            <Mail size={20} /> Contact
          </button>
        </nav>

        {/* Mobile Menu Button (Hamburger icon) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          <Menu size={32} />
        </button>
      </div>

      {/* Mobile Menu Content (conditionally rendered and animated) - using buttons and onNavigate */}
      <div
        className={`md:hidden bg-blue-800 bg-opacity-95 overflow-hidden mobile-menu-transition ${
          isMobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col items-center space-y-4 px-4">
          <button onClick={() => { onNavigate('home'); toggleMobileMenu(); }} className="block w-full text-white text-center py-2 hover:bg-blue-700 rounded-md transition-colors duration-200 font-semibold text-lg bg-transparent border-none cursor-pointer">Home</button>
          <button onClick={() => { onNavigate('scanUrl'); toggleMobileMenu(); }} className="block w-full text-white text-center py-2 hover:bg-blue-700 rounded-md transition-colors duration-200 font-semibold text-lg bg-transparent border-none cursor-pointer">Scan URL</button>
          <button onClick={() => { onNavigate('about'); toggleMobileMenu(); }} className="block w-full text-white text-center py-2 hover:bg-blue-700 rounded-md transition-colors duration-200 font-semibold text-lg bg-transparent border-none cursor-pointer">About</button>
          <button onClick={() => { onNavigate('contact'); toggleMobileMenu(); }} className="block w-full text-white text-center py-2 hover:bg-blue-700 rounded-md transition-colors duration-200 font-semibold text-lg bg-transparent border-none cursor-pointer">Contact</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
