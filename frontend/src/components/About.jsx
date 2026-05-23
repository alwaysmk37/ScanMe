import React from 'react';
import { Info, Code, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-100 flex items-center justify-center gap-2 mb-2">
        <Info className="text-blue-500" />
        About ScanMe Security Suite
      </h2>

      <div className="text-slate-300 space-y-4 text-sm leading-relaxed">
        <p>
          ScanMe is an advanced threat intelligence and security assessment platform. It helps administrators, developers, and security enthusiasts scan resources, lookup CVEs, analyze mail flow routing, and detect malicious files.
        </p>
        
        <p>
          Each scan runs across multiple security engines and vulnerability databases to aggregate threat detection. The metadata is instantly stored in MongoDB alongside user-approved IP locations to map scanning trends.
        </p>

        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 pt-4">
          <Code className="text-blue-400" size={18} /> Our Technology Architecture
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <li className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg">
            <span className="text-blue-400 font-bold block mb-1">Frontend Core</span>
            React.js, Tailwind v4, Recharts Visual Graphs, HTML5 Canvas 3D Graphics.
          </li>
          <li className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg">
            <span className="text-blue-400 font-bold block mb-1">Backend Core</span>
            FastAPI Server (Python 3.13), VirusTotal API integration, CVE CIRCL databases.
          </li>
          <li className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg">
            <span className="text-blue-400 font-bold block mb-1">Database Layer</span>
            MongoDB log tracking mapping query string, result array, and IP geolocation.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
