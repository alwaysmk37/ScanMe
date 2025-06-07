import React from 'react';
// Importing lucide-react icons for social media links (optional, if you add them)
import { Github, Twitter, Linkedin } from 'lucide-react';

// The Footer component now accepts an 'onNavigate' prop, which is a function
// that will be called when a navigation link is clicked.
const Footer = ({ onNavigate }) => {
  return (
    // Redesigned footer with a darker background, more padding, and structured content.
    // bg-blue-600: Matches the primary blue of the header for consistency.
    // text-white: White text for good contrast.
    // py-8: Increased vertical padding for a more substantial footer.
    // mt-16: More margin-top to separate from the main content.
    // shadow-inner: Adds a subtle inner shadow.
    <footer className="bg-blue-600 text-white py-8 mt-16 shadow-inner font-inter">
      <div className="container mx-auto px-4 text-center">
        {/* Top section of the footer */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Scan Me App</h3>
          {/* text-blue-100 for subtle contrast on the blue background */}
          <p className="text-blue-100">Your trusted partner for URL security analysis.</p>
        </div>

        {/* Navigation links in the footer, now using onClick for internal navigation */}
        <div className="flex justify-center space-x-6 mb-6">
          {/* Default text color for links is a lighter blue, hover changes to white for emphasis */}
          {/* Calling onNavigate with a specific page identifier, now with lowercase first letter to match App.jsx */}
          <button onClick={() => onNavigate('privacyPolicy')} className="text-blue-100 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 text-base">Privacy Policy</button>
          <button onClick={() => onNavigate('termsOfService')} className="text-blue-100 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 text-base">Terms of Service</button>
          <button onClick={() => onNavigate('faq')} className="text-blue-100 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 text-base">FAQ</button>
        </div>

        {/* Optional: Social media links (placeholders with Lucide icons) */}
        {/* You'd need to install lucide-react if you haven't already: npm install lucide-react */}
        <div className="flex justify-center space-x-6 mb-6">
          {/* Icons also use a lighter blue by default, turning white on hover */}
          <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200" aria-label="GitHub">
            <Github size={24} />
          </a>
          <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
        </div>

        {/* Copyright information */}
        {/* border-blue-500 for a subtle dividing line matching the blue theme */}
        <div className="border-t border-blue-500 pt-6 text-sm text-blue-200">
          © {new Date().getFullYear()} Scan Me App. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
