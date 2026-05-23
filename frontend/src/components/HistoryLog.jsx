import React, { useState, useEffect } from 'react';
import { getScanHistory } from '../api';
import { Clock, Shield, Globe, Search, RefreshCw, FileText } from 'lucide-react';

const HistoryLog = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getScanHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const q = item.query ? item.query.toLowerCase() : '';
    const t = item.type ? item.type.toLowerCase() : '';
    const loc = item.location && item.location.city ? item.location.city.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return q.includes(search) || t.includes(search) || loc.includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Filters and search block */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3.5 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Filter by keyword, type, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 focus:outline-none pl-10 pr-4 py-2.5 rounded-lg text-slate-200 text-sm"
          />
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-lg text-sm transition-all border border-slate-700"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          Reload logs
        </button>
      </div>

      {/* Database logs table */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-mono uppercase tracking-wider">
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Analyzer Engine</th>
                <th className="p-4">Query Target / Subject</th>
                <th className="p-4">User Geolocation</th>
                <th className="p-4 text-center">Threat Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Fetching logs...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No matching scanner database logs found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => {
                  const isThreat = 
                    (item.type === 'url' && item.results?.positives > 0) || 
                    (item.type === 'file' && item.results?.positives > 0) || 
                    (item.type === 'email' && item.results?.risk_level === 'High');

                  return (
                    <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                      <td className="p-4 font-mono text-[10px] text-slate-500">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-[9px] ${
                          item.type === 'url' ? 'bg-blue-950 text-blue-400 border border-blue-900/30' :
                          item.type === 'file' ? 'bg-purple-950 text-purple-400 border border-purple-900/30' :
                          item.type === 'cve' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono break-all max-w-[240px]">
                        {item.query}
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        {item.location && item.location.status === 'success' ? (
                          <span className="flex items-center gap-1">
                            <Globe size={12} className="text-slate-500" />
                            {item.location.city}, {item.location.country}
                          </span>
                        ) : (
                          <span className="text-slate-600">Local Host</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                          isThreat ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                        }`}>
                          {isThreat ? 'DETECTED' : 'CLEAN'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryLog;
