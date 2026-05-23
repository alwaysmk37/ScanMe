import React, { useState } from 'react';
import { scanUrl } from '../api.js';
import ScanDetailsPage from './ScanDetailsPage';
import { Shield, Globe, Search, RefreshCw } from 'lucide-react';

const UrlInputForm = ({ onScanSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onScanSubmit(url.trim());
    }
  };

  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-2xl mx-auto shadow-2xl space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-100 flex items-center justify-center gap-2">
          <Globe className="text-blue-500 animate-[spin_10s_linear_infinite]" size={28} />
          Scan a URL
        </h2>
        <p className="text-slate-400 text-xs">Analyze URL safety index across multiple web threat indicators.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scan (e.g. https://example.com)"
          className="p-3 bg-slate-900/60 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg text-slate-200 text-sm font-inter"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold p-3 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
          {loading ? 'Analyzing Target URL...' : 'Inspect URL'}
        </button>
      </form>
    </div>
  );
};

const Scanner = () => {
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  const handleScanSubmit = async (url) => {
    setLoading(true);
    setScanResults(null);
    setShowDetailsPage(true);

    try {
      const data = await scanUrl(url);
      setScanResults(data);
    } catch (error) {
      console.error("Error scanning URL:", error);
      setScanResults({ url: url, error: error.message || "Failed to analyze URL." });
    } finally {
      setLoading(false);
    }
  };

  const handleNewScan = () => {
    setScanResults(null);
    setLoading(false);
    setShowDetailsPage(false);
  };

  return (
    <>
      {showDetailsPage ? (
        <ScanDetailsPage
          scanResults={scanResults}
          loading={loading}
          onNewScan={handleNewScan}
        />
      ) : (
        <UrlInputForm onScanSubmit={handleScanSubmit} loading={loading} />
      )}
    </>
  );
};

export default Scanner;
