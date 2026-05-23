import React from 'react';
import { Shield } from 'lucide-react';

const DataProtection = () => {
  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-100 flex items-center justify-center gap-2 mb-2">
        <Shield className="text-blue-500" />
        Privacy Policy & Data Protection
      </h2>
      <div className="text-slate-300 leading-relaxed space-y-4 text-xs font-mono">
        <p className="text-slate-500">Effective Date: May 23, 2026</p>
        <p>
          Welcome to ScanMe. We are committed to protecting your privacy. This Privacy Policy explains how we collect, handle, and store threat logs when you use our security scanning features.
        </p>

        <h3 className="text-sm font-bold text-slate-200 mt-6 mb-1">1. Information We Store</h3>
        <p>
          To maintain a historical log of queries, ScanMe records submitted URLs, file hashes, CVE search parameters, and email structures in a local MongoDB database.
        </p>
        <p>
          Additionally, with your consent, we resolve your IP address to coordinate values (Latitude/Longitude, City, Country) using ipapi services. This geolocation marker is logged to populate global threat analysis graphs.
        </p>

        <h3 className="text-sm font-bold text-slate-200 mt-6 mb-1">2. Third-Party Integrations</h3>
        <p>
          ScanMe interfaces directly with VirusTotal APIs. Any uploaded files or URLs are forwarded to VirusTotal for analysis. Their policies govern how those files are treated.
        </p>

        <h3 className="text-sm font-bold text-slate-200 mt-6 mb-1">3. Data Security</h3>
        <p>
          We employ physical and network firewalls to safeguard our local MongoDB configurations. No method of data transmission is 100% secure.
        </p>
      </div>
    </div>
  );
};

export default DataProtection;
