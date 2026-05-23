import React, { useState } from 'react';
import { Menu, Home, Search, Info, Mail, ShieldAlert, FileText, Database, Shield } from 'lucide-react';

const Header = ({ activeTab, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'scanUrl', label: 'Scan URL', icon: Search },
    { id: 'scanFile', label: 'Scan File', icon: FileText },
    { id: 'cveLookup', label: 'CVE Lookup', icon: Shield },
    { id: 'emailAnalyzer', label: 'Email Analyzer', icon: Mail },
    { id: 'history', label: 'History Logs', icon: Database },
  ];

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 text-slate-100 py-3.5 fixed top-0 w-full z-50 shadow-2xl">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 text-2xl font-black font-inter cursor-pointer tracking-wider transform hover:scale-102 transition-transform duration-200"
          onClick={() => onNavigate('home')}
        >
          <Shield className="text-blue-500 fill-blue-500/10 animate-[pulse_3s_infinite]" size={28} />
          <span className="bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">ScanMe</span>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-500 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900/30">SUITE</span>
        </div>

        {/* Desktop Nav links */}
        <nav className="hidden xl:flex space-x-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border-blue-500/35 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon size={14} /> {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-900 absolute top-full left-0 w-full py-4 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
          <nav className="flex flex-col space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold border transition-colors ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border-blue-500/30'
                      : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-900'
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
