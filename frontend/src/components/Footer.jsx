import React from 'react';
import { Github, Shield } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-8 mt-16 shadow-inner font-inter">
      <div className="container mx-auto px-4 text-center space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200 flex items-center justify-center gap-1.5">
            <Shield size={18} className="text-blue-500" /> ScanMe Security Suite
          </h3>
          <p className="text-slate-500 text-xs mt-1">Multi-vector threat scanning and intelligence auditing.</p>
        </div>

        <div className="flex justify-center space-x-6 text-xs font-mono">
          <button onClick={() => onNavigate('privacyPolicy')} className="text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">Privacy Policy</button>
          <button onClick={() => onNavigate('termsOfService')} className="text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">Terms of Service</button>
          <button onClick={() => onNavigate('faq')} className="text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">FAQ</button>
          <button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">About</button>
          <button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">Contact</button>
        </div>

        <div className="border-t border-slate-900/60 pt-4 text-[10px] text-slate-600 font-mono">
          © {new Date().getFullYear()} ScanMe Platform. All rights reserved. Database synced locally.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
