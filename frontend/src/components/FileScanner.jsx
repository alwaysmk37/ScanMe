import React, { useState } from 'react';
import { scanFileHash, uploadFileForScan } from '../api';
import { downloadPDFReport } from '../utils/ReportGenerator';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShieldAlert, ShieldCheck, FileText, Upload, RefreshCw, Key, Download } from 'lucide-react';

const COLORS = {
  MALICIOUS: '#f87171', // soft red
  CLEAN: '#34d399',     // soft green
  UNDETECTED: '#9ca3af', // gray
};

const FileScanner = () => {
  const [scanType, setScanType] = useState('upload'); // 'upload' or 'hash'
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let data;
      if (scanType === 'upload') {
        if (!file) {
          setError('Please select a file to upload.');
          setLoading(false);
          return;
        }
        data = await uploadFileForScan(file);
      } else {
        if (!hash.trim()) {
          setError('Please enter a valid file SHA-256 or MD5 hash.');
          setLoading(false);
          return;
        }
        data = await scanFileHash(hash.trim());
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during file analysis.');
    } finally {
      setLoading(false);
    }
  };

  const dataForPieChart = () => {
    if (!result || !result.positives) return [{ name: 'Clean / Undetected', value: 100, color: COLORS.CLEAN }];
    const malicious = result.positives;
    const clean = (result.total || 70) - malicious;
    return [
      { name: 'Malicious Detections', value: malicious, color: COLORS.MALICIOUS },
      { name: 'Clean Scans', value: clean, color: COLORS.CLEAN }
    ];
  };

  const dataForBarChart = () => {
    if (!result || !result.scans) return [];
    // Count categorization of results
    const counts = {};
    Object.values(result.scans).forEach(s => {
      const category = s.result || 'undetected';
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 8);
  };

  return (
    <div className="space-y-8">
      {/* Search selection tab */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => { setScanType('upload'); setResult(null); setError(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold border transition-all duration-300 ${
            scanType === 'upload'
              ? 'bg-blue-600/30 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <Upload size={18} />
          File Upload Scan
        </button>
        <button
          onClick={() => { setScanType('hash'); setResult(null); setError(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold border transition-all duration-300 ${
            scanType === 'hash'
              ? 'bg-blue-600/30 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <Key size={18} />
          File Hash Lookup
        </button>
      </div>

      {/* Main input wrapper */}
      <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="text-blue-500" />
          {scanType === 'upload' ? 'Upload Suspicious File' : 'Submit SHA-256/MD5 Hash'}
        </h2>

        <form onSubmit={handleScanSubmit} className="space-y-4">
          {scanType === 'upload' ? (
            <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto text-slate-500 mb-2 animate-pulse" size={32} />
              <p className="text-slate-300 font-medium">
                {file ? file.name : 'Click to select or drag file here'}
              </p>
              <p className="text-slate-500 text-xs mt-1">Maximum upload file size: 32MB</p>
            </div>
          ) : (
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="e.g. d2c71241a8df7c885795f0386379ec0b74d0a33c5011..."
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 focus:outline-none p-3 rounded-lg text-slate-200"
            />
          )}

          {error && (
            <div className="text-red-400 bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold p-3 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <FileText size={18} />}
            {loading ? 'Analyzing File...' : 'Start Malware Scan'}
          </button>
        </form>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">VirusTotal active sandbox scanning in progress...</p>
        </div>
      )}

      {/* Results Page */}
      {result && (
        <div id="file-scan-report" className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                {result.positives > 0 ? (
                  <ShieldAlert className="text-red-500" />
                ) : (
                  <ShieldCheck className="text-emerald-500" />
                )}
                File Integrity Report
              </h3>
              <p className="text-slate-400 text-sm mt-1 break-all">
                Filename: <span className="text-slate-300 font-mono">{result.filename || 'Unknown'}</span>
              </p>
              <p className="text-slate-500 text-xs mt-0.5 break-all">
                Hash: <span className="text-slate-400 font-mono">{result.hash || 'N/A'}</span>
              </p>
            </div>
            
            <button
              onClick={() => downloadPDFReport("file-scan-report", `ScanMe_File_Report_${result.filename || 'hash'}.pdf`)}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-bold transition-all text-sm border border-slate-700"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>

          {result.status === 'not_found' ? (
            <div className="text-center py-8">
              <ShieldAlert className="text-amber-500 mx-auto mb-2" size={32} />
              <p className="text-slate-300 font-bold">{result.message}</p>
              <button
                onClick={() => setScanType('upload')}
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg"
              >
                Upload File Directly
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-mono">Detections</p>
                    <p className="text-2xl font-bold text-red-500 mt-1">
                      {result.positives} <span className="text-slate-500 text-sm font-normal">/ {result.total || 70} engines</span>
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold font-mono bg-red-950/40 text-red-400 border border-red-900/50">
                    {result.positives > 0 ? 'SUSPICIOUS / MALICIOUS' : 'CLEAN'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/20 border border-slate-800/60 p-3 rounded-lg">
                    <p className="text-slate-500 text-xs">File Size</p>
                    <p className="text-slate-200 font-bold mt-1">{(result.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div className="bg-slate-900/20 border border-slate-800/60 p-3 rounded-lg">
                    <p className="text-slate-500 text-xs">Category Type</p>
                    <p className="text-slate-200 font-bold mt-1 break-words">{result.type || 'Binary Document'}</p>
                  </div>
                </div>

                <div className="h-[240px] w-full">
                  <p className="text-slate-400 text-sm font-bold mb-2">Verdict Distribution</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataForPieChart()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dataForPieChart().map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar charts details */}
              <div className="space-y-4">
                <p className="text-slate-400 text-sm font-bold">Engine Threat Verdict Categories</p>
                <div className="h-[200px] w-full bg-slate-900/20 border border-slate-800 p-2 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataForBarChart()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="max-h-[220px] overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800 bg-slate-900/10">
                  {result.scans && Object.entries(result.scans).slice(0, 15).map(([engine, details]) => (
                    <div key={engine} className="p-3 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium font-mono">{engine}</span>
                      <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                        details.detected ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                      }`}>
                        {details.result || (details.detected ? 'Detected' : 'Undetected')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileScanner;
