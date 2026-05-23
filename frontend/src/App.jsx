import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Scanner from './components/Scanner.jsx';
import FileScanner from './components/FileScanner.jsx';
import CVELookup from './components/CVELookup.jsx';
import EmailAnalyzer from './components/EmailAnalyzer.jsx';
import HistoryLog from './components/HistoryLog.jsx';
import ThreatGlobe3D from './components/ThreatGlobe3D.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import FAQ from './components/FAQ.jsx';
import DataProtection from './components/DataProtection.jsx';
import TermsOfService from './components/TermsOfService.jsx';
import { getDashboardMetrics } from './api';
import { Shield, ShieldAlert, ShieldCheck, Database, LayoutGrid, Globe, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [metrics, setMetrics] = useState({
    total_scans: 0,
    type_counts: { url: 0, file: 0, cve: 0, email: 0 },
    threats_detected: 0,
    location_markers: []
  });
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dataForChart = [
    { name: 'URL Scans', count: metrics.type_counts.url || 0 },
    { name: 'File Uploads', count: metrics.type_counts.file || 0 },
    { name: 'CVE Lookups', count: metrics.type_counts.cve || 0 },
    { name: 'Email Parsed', count: metrics.type_counts.email || 0 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-inter selection:bg-blue-600/30 cyber-grid">
      {/* Background neon visual glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <Header activeTab={activeTab} onNavigate={handleNavigate} />

      <main className="pt-24 container mx-auto px-4 flex-grow z-10 space-y-8 max-w-7xl flex flex-col items-center justify-start w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col items-center space-y-8"
          >
            {activeTab === 'home' && (
              <div className="space-y-8 w-full flex flex-col items-center">
                {/* Page Title */}
                <div className="text-center flex flex-col items-center justify-center max-w-2xl">
                  <motion.h1 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-50 to-slate-400 bg-clip-text text-transparent flex items-center justify-center gap-3 text-center"
                  >
                    <Shield className="text-blue-500 fill-blue-500/10 animate-[pulse_4s_infinite]" size={40} />
                    Cybersecurity Workspace
                  </motion.h1>
                  <p className="text-slate-400 text-sm mt-2 text-center">
                    Multi-vector analysis environment integrated with VirusTotal, CVE directories, and local MongoDB logs.
                  </p>
                </div>

                {/* Quick Metrics Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {[
                    { title: "Total Scans Audited", value: metrics.total_scans, icon: Database, color: "text-blue-500" },
                    { title: "Threats Blocked", value: metrics.threats_detected, icon: ShieldAlert, color: "text-red-500" },
                    { title: "Threat Ratio", value: `${metrics.total_scans > 0 ? ((metrics.threats_detected / metrics.total_scans) * 100).toFixed(1) : 0}%`, icon: Activity, color: "text-amber-500" },
                    { title: "Engine Status", value: "100%", icon: ShieldCheck, color: "text-emerald-400" }
                  ].map((card, i) => {
                    const CardIcon = card.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-slate-900/30 backdrop-blur-md p-5 rounded-2xl flex items-center justify-between shadow-lg cyber-card w-full"
                      >
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">{card.title}</span>
                          <p className={`text-3xl font-black font-mono ${card.color === 'text-red-500' ? 'text-red-500' : card.color === 'text-amber-500' ? 'text-amber-500' : card.color === 'text-emerald-400' ? 'text-emerald-400' : 'text-slate-100'}`}>
                            {card.value}
                          </p>
                        </div>
                        <CardIcon className={`${card.color}/60`} size={28} />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Core Interactive Visual 3D and 2D charts */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
                  {/* Left Column: 3D Globe */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="lg:col-span-3 bg-slate-900/25 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 justify-center lg:justify-start">
                        <Globe size={18} className="text-blue-500" /> Active Threat GeoCore
                      </h3>
                      <p className="text-slate-500 text-xs font-mono text-center lg:text-left">Coordinated IP targets gathered from local client nodes.</p>
                    </div>

                    <div className="py-6 flex justify-center items-center">
                      <ThreatGlobe3D markers={metrics.location_markers} isScanning={loadingMetrics} />
                    </div>

                    <div className="text-center text-[10px] text-slate-600 font-mono pt-4 border-t border-slate-900/60">
                      Rotating digital sphere representing geographical geolocation logs.
                    </div>
                  </motion.div>

                  {/* Right Column: 2D Bar chart */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="lg:col-span-2 bg-slate-900/25 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 justify-center lg:justify-start">
                        <LayoutGrid size={18} className="text-purple-500" /> Scan Distribution Index
                      </h3>
                      <p className="text-slate-500 text-xs font-mono text-center lg:text-left">Metrics comparing search volumes by module category.</p>
                    </div>

                    <div className="h-[280px] w-full mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataForChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-center text-[10px] text-slate-600 font-mono pt-4 border-t border-slate-900/60">
                      Volume index aggregated dynamically from Mongo database documents.
                    </div>
                  </motion.div>
                </div>

                {/* Quick Action Navigation links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 w-full">
                  {[
                    { id: 'scanUrl', label: 'Inspect URL threat', icon: Globe, bg: 'bg-blue-950', text: 'text-blue-400' },
                    { id: 'scanFile', label: 'Scan File hashes', icon: Database, bg: 'bg-purple-950', text: 'text-purple-400' },
                    { id: 'cveLookup', label: 'CVE Lookup Search', icon: Shield, bg: 'bg-amber-950', text: 'text-amber-400' },
                    { id: 'emailAnalyzer', label: 'Parse Email Hops', icon: ShieldCheck, bg: 'bg-emerald-950', text: 'text-emerald-400' }
                  ].map((btn) => {
                    const BtnIcon = btn.icon;
                    return (
                      <motion.button
                        key={btn.id}
                        whileHover={{ y: -5, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleNavigate(btn.id)}
                        className="bg-slate-900/30 backdrop-blur-md p-5 rounded-2xl transition-all duration-300 text-center font-bold text-slate-200 text-xs space-y-2 cursor-pointer shadow-md cyber-card w-full flex flex-col items-center"
                      >
                        <div className={`w-8 h-8 rounded-full ${btn.bg} flex items-center justify-center ${btn.text} mx-auto`}>
                          <BtnIcon size={16} />
                        </div>
                        <span>{btn.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="w-full flex flex-col items-center">
              {activeTab === 'scanUrl' && <Scanner />}
              {activeTab === 'scanFile' && <FileScanner />}
              {activeTab === 'cveLookup' && <CVELookup />}
              {activeTab === 'emailAnalyzer' && <EmailAnalyzer />}
              {activeTab === 'history' && <HistoryLog />}
              {activeTab === 'about' && <About />}
              {activeTab === 'contact' && <Contact />}
              {activeTab === 'faq' && <FAQ />}
              {activeTab === 'privacyPolicy' && <DataProtection />}
              {activeTab === 'termsOfService' && <TermsOfService />}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
