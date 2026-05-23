import React, { useState } from 'react';
import { analyzeEmailHeaders } from '../api';
import { downloadPDFReport } from '../utils/ReportGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Clock, ShieldAlert, ShieldCheck, HelpCircle, Activity, Download, List } from 'lucide-react';

const EmailAnalyzer = () => {
  const [headersText, setHeadersText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!headersText.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeEmailHeaders(headersText.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Header analysis failed. Verify structure format.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyle = (status) => {
    if (status === 'pass') return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40';
    if (status === 'fail') return 'bg-red-950/40 text-red-400 border border-red-900/40';
    return 'bg-slate-800 text-slate-400 border border-slate-700/50';
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Mail className="text-blue-500 animate-pulse" />
          Email Header Analyzer
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          Paste the raw email header block (including Received, From, To headers) to trace security mechanisms and hops.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            placeholder="Paste Raw Headers here... (Received: from...)"
            rows={10}
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 focus:outline-none p-3 rounded-lg text-slate-200 font-mono text-xs"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? <Activity className="animate-spin" size={18} /> : <Activity size={18} />}
            Analyze Headers
          </button>
        </form>

        {error && (
          <div className="text-red-400 bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Parsing raw headers and verifying security hashes...</p>
        </div>
      )}

      {/* Results output wrapper */}
      {result && (
        <div id="email-scan-report" className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                {result.score >= 80 ? (
                  <ShieldCheck className="text-emerald-500" />
                ) : (
                  <ShieldAlert className="text-red-500" />
                )}
                Email Security Diagnosis Report
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Subject: <span className="text-slate-200 font-bold">{result.subject}</span>
              </p>
            </div>
            
            <button
              onClick={() => downloadPDFReport("email-scan-report", `ScanMe_Email_Report_${result.subject.slice(0, 15)}.pdf`)}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-bold transition-all text-sm border border-slate-700"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Score index dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-mono">Trust Score</p>
                  <p className={`text-4xl font-extrabold mt-2 ${result.score >= 80 ? 'text-emerald-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.score} <span className="text-slate-500 text-xs font-normal">/ 100</span>
                  </p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-mono">Risk Level</p>
                  <p className={`text-2xl font-extrabold mt-3.5 uppercase tracking-wide ${result.risk_level === 'High' ? 'text-red-400' : result.risk_level === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {result.risk_level}
                  </p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-[10px] uppercase font-mono">Mail Hops</p>
                  <p className="text-4xl font-extrabold text-blue-400 mt-2">
                    {result.hops.length} <span className="text-slate-500 text-xs font-normal">servers</span>
                  </p>
                </div>
              </div>

              {/* Envelope meta */}
              <div className="bg-slate-900/10 border border-slate-800/60 p-4 rounded-xl space-y-3 text-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">Envelope Headers</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                  <div>
                    <span className="text-slate-500 text-xs block">From:</span>
                    <span className="font-medium truncate block">{result.sender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">To:</span>
                    <span className="font-medium truncate block">{result.recipient}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Date:</span>
                    <span>{result.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Message-ID:</span>
                    <span className="font-mono text-xs break-all block">{result.message_id}</span>
                  </div>
                </div>
              </div>

              {/* Transit Hops timeline charts */}
              {result.hops.length > 0 && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm font-bold flex items-center gap-1.5"><Clock size={16} /> Relay Hops Routing Path</p>
                  <div className="relative border-l-2 border-blue-500/20 ml-3 pl-6 space-y-5">
                    {result.hops.map((hop, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-blue-500 bg-slate-950 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-blue-400">{hop.hop}</span>
                        </div>
                        <div>
                          <p className="text-slate-200 text-xs font-bold">
                            Hop {hop.hop}: {hop.by !== 'Unknown' ? hop.by : hop.from}
                          </p>
                          <p className="text-slate-500 text-[10px] mt-0.5 font-mono">
                            IP Address: <span className="text-slate-300">{hop.ip}</span> | Time: {hop.time_raw}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verdicts side panel */}
            <div className="space-y-6 bg-slate-900/20 border border-slate-800/80 p-5 rounded-2xl">
              <h4 className="text-slate-300 font-bold border-b border-slate-800 pb-2 flex items-center gap-1.5 text-sm">
                Authentication Records
              </h4>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg">
                  <span className="font-mono text-xs text-slate-300 font-bold">SPF</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${getVerdictStyle(result.verdicts.spf)}`}>
                    {result.verdicts.spf}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg">
                  <span className="font-mono text-xs text-slate-300 font-bold">DKIM</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${getVerdictStyle(result.verdicts.dkim)}`}>
                    {result.verdicts.dkim}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg">
                  <span className="font-mono text-xs text-slate-300 font-bold">DMARC</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${getVerdictStyle(result.verdicts.dmarc)}`}>
                    {result.verdicts.dmarc}
                  </span>
                </div>
              </div>

              {result.issues.length > 0 && (
                <div className="space-y-2 bg-red-950/15 border border-red-900/35 p-4 rounded-xl">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                    <ShieldAlert size={14} /> Security Issues
                  </p>
                  <ul className="list-disc list-inside text-[10px] text-red-300/80 space-y-1">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="leading-normal">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAnalyzer;
