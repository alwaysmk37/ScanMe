import React, { useState } from 'react';
import { lookupCVE } from '../api';
import { downloadPDFReport } from '../utils/ReportGenerator';
import { Shield, ShieldAlert, Award, Calendar, Link, Search, FileText, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CVELookup = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await lookupCVE(query.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'CVE Lookup query failed. Please verify format.');
    } finally {
      setLoading(false);
    }
  };

  // Convert severity score to color tag
  const getSeverityColor = (score) => {
    const num = parseFloat(score);
    if (isNaN(num)) return 'bg-slate-800 text-slate-400';
    if (num >= 9.0) return 'bg-red-950/60 text-red-400 border border-red-900/60';
    if (num >= 7.0) return 'bg-amber-950/60 text-amber-400 border border-amber-900/60';
    if (num >= 4.0) return 'bg-yellow-950/60 text-yellow-400 border border-yellow-900/60';
    return 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60';
  };

  return (
    <div className="space-y-8">
      {/* Search Input bar */}
      <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Shield className="text-blue-500 animate-pulse" />
          CVE Vulnerability Search
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          Query standard CVE details (e.g. <span className="font-mono text-slate-300">CVE-2021-44228</span>) or software keywords (e.g. <span className="font-mono text-slate-300">Log4j</span>, <span className="font-mono text-slate-300 font-medium">Apache</span>).
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CVE ID or keyword..."
            className="flex-1 bg-slate-900/60 border border-slate-800 focus:border-blue-500 focus:outline-none p-3 rounded-lg text-slate-200"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
          >
            {loading ? <Search className="animate-spin" size={18} /> : <Search size={18} />}
            Search
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
          <p className="text-slate-400 font-medium">Searching vulnerability repositories...</p>
        </div>
      )}

      {/* CVE Result content */}
      {result && (
        <div id="cve-scan-report" className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="text-blue-500" />
                Vulnerability Database Findings
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Found matches for query: <span className="text-blue-400 font-bold">{query}</span>
              </p>
            </div>
            
            <button
              onClick={() => downloadPDFReport("cve-scan-report", `ScanMe_CVE_Report_${query}.pdf`)}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-bold transition-all text-sm border border-slate-700"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>

          {result.type === 'single' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
                    {result.data.id}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider ${getSeverityColor(result.data.cvss)}`}>
                      CVSS {result.data.cvss}
                    </span>
                  </h4>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider font-mono">Summary Description</p>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/25 border border-slate-800/40 p-4 rounded-xl">
                    {result.data.summary}
                  </p>
                </div>

                {/* Severity visual progress bar */}
                <div className="space-y-2 bg-slate-900/10 border border-slate-800/60 p-4 rounded-xl">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">CVSS Severity Index Bar</p>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        parseFloat(result.data.cvss) >= 7.0 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-yellow-500'
                      }`}
                      style={{ width: `${(parseFloat(result.data.cvss) || 0) * 10}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                      {(parseFloat(result.data.cvss) || 0).toFixed(1)} / 10.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Side metadata panel */}
              <div className="space-y-6 bg-slate-900/20 border border-slate-800/80 p-5 rounded-2xl">
                <h5 className="text-slate-300 font-bold border-b border-slate-800 pb-2 flex items-center gap-1.5 text-sm">
                  <Award size={16} /> Reference & Intel
                </h5>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-500" />
                    <div>
                      <p className="text-slate-500">Published</p>
                      <p className="text-slate-300 font-medium">{result.data.published ? new Date(result.data.published).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-500" />
                    <div>
                      <p className="text-slate-500">Last Modified</p>
                      <p className="text-slate-300 font-medium">{result.data.modified ? new Date(result.data.modified).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-500" />
                    <div>
                      <p className="text-slate-500">Weakness Category (CWE)</p>
                      <p className="text-slate-300 font-mono font-medium">{result.data.cwes || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1"><Link size={12} /> Advisory Links</p>
                  <ul className="space-y-1.5">
                    {result.data.references && result.data.references.map((url, i) => (
                      <li key={i} className="text-[10px] text-blue-400 hover:underline break-all block">
                        <a href={url} target="_blank" rel="noreferrer">{url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Search result listing
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">Multiple matching records found:</p>
              
              {/* Show chart distribution of CVSS scores */}
              <div className="h-[200px] w-full bg-slate-900/10 border border-slate-800 p-2 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="id" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="cvss" fill="#ef4444" radius={[4, 4, 0, 0]} name="CVSS Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.data.map((cve) => (
                  <div key={cve.id} className="border border-slate-800/80 bg-slate-900/20 p-4 rounded-xl hover:border-slate-700/50 transition-colors flex justify-between items-start">
                    <div className="space-y-1.5 flex-1 pr-4">
                      <h4 className="font-bold text-slate-200 text-sm">{cve.id}</h4>
                      <p className="text-slate-400 text-xs line-clamp-2">{cve.summary}</p>
                      <p className="text-slate-500 text-[10px]">Published: {cve.published}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${getSeverityColor(cve.cvss)}`}>
                      {cve.cvss}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CVELookup;
