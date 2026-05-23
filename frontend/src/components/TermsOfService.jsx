import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-100 flex items-center justify-center gap-2 mb-2">
        <FileText className="text-blue-500" />
        Terms of Service
      </h2>
      <div className="text-slate-300 leading-relaxed space-y-4 text-xs font-mono">
        <p className="text-slate-500">Last Updated: May 23, 2026</p>
        <p>
          Welcome to ScanMe. These Terms govern your access to the scanning environment. By using the platform, you verify you are authorized to analyze the files and parameters submitted.
        </p>

        <h3 className="text-sm font-bold text-slate-200 mt-6 mb-1">1. Acceptable Security Use</h3>
        <p>
          ScanMe is intended strictly for authorized audit processes. You must not upload or query URLs/files that you do not own or have written permission to scan, nor use this suite for hostile exploit analysis.
        </p>

        <h3 className="text-sm font-bold text-slate-200 mt-6 mb-1">2. Disclaimers</h3>
        <p>
          The service is provided "AS IS". Vulnerability information and threat indices are gathered from external directories and CIRCL databases. We cannot guarantee completeness or mitigation accuracy.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
