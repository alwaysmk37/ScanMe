import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { downloadPDFReport } from '../utils/ReportGenerator';
import { ShieldCheck, ShieldAlert, FileText, ArrowLeft, Download, RefreshCw } from 'lucide-react';

const COLORS = {
  MALICIOUS: '#f87171', // soft red
  CLEAN: '#34d399',     // soft green
  UNDETECTED: '#64748b', // gray
};

const ScanDetailsPage = ({ scanResults, loading, onNewScan }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress < 95) {
            return prevProgress + 1;
          }
          return prevProgress;
        });
      }, 40);
    } else {
      setProgress(100);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const dataForPieChart = () => {
    if (!scanResults || !scanResults.scans) {
      return [];
    }
    const maliciousCount = scanResults.positives || 0;
    const cleanCount = Object.values(scanResults.scans).filter(
      (s) => (s.result === 'clean' || s.result === 'unrated') && !s.detected
    ).length;
    const undetectedCount = Math.max((scanResults.total || 70) - maliciousCount - cleanCount, 0);

    return [
      { name: 'Malicious Detections', value: maliciousCount, color: COLORS.MALICIOUS },
      { name: 'Clean Vertices', value: cleanCount, color: COLORS.CLEAN },
      { name: 'Undetected / Safe', value: undetectedCount, color: COLORS.UNDETECTED },
    ].filter(item => item.value > 0);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center bg-slate-950/85 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-xl mx-auto shadow-2xl space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xl font-bold text-slate-100">Scanning URL Security Indexes...</p>
          <div className="w-full bg-slate-900 rounded-full h-3 relative overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
            ></div>
          </div>
          <span className="text-xs font-mono text-slate-500">{progress}% compiled</span>
        </div>
      ) : !scanResults ? (
        <div className="bg-slate-950/60 border border-slate-800 p-8 rounded-2xl text-center shadow-xl space-y-4 max-w-xl mx-auto">
          <p className="text-slate-400">No active URL reports found.</p>
          <button
            onClick={onNewScan}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg"
          >
            Start Scan
          </button>
        </div>
      ) : (
        <div id="url-scan-report" className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                {scanResults.positives > 0 ? (
                  <ShieldAlert className="text-red-400" />
                ) : (
                  <ShieldCheck className="text-emerald-400" />
                )}
                URL Verification Report
              </h3>
              <p className="text-xs text-blue-400 font-mono break-all mt-1">{scanResults.url}</p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={onNewScan}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-lg font-bold text-xs border border-slate-700"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={() => downloadPDFReport("url-scan-report", `ScanMe_URL_Report_${scanResults.url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-lg font-bold text-xs border border-slate-700"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>

          {scanResults.error ? (
            <div className="text-center bg-red-950/30 border border-red-900/40 text-red-400 px-4 py-3 rounded-lg text-sm">
              <strong className="font-bold">Scan Error: </strong>
              <span>{scanResults.error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-mono">Detections</p>
                    <p className="text-3xl font-extrabold text-red-500 mt-1">
                      {scanResults.positives} <span className="text-slate-500 text-xs font-normal">/ {scanResults.total || 70} engines</span>
                    </p>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-full text-xs font-bold font-mono ${
                    scanResults.positives > 0 ? 'bg-red-950/40 text-red-400 border border-red-900/50' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
                  }`}>
                    {scanResults.positives > 0 ? 'DANGEROUS TARGET' : 'CLEAN'}
                  </div>
                </div>

                <div className="h-[260px] w-full">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">Threat Breakdown</p>
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

              {/* Individual scanners */}
              <div className="space-y-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">Individual Security Engine Verdicts</p>
                <div className="max-h-[320px] overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800 bg-slate-900/10">
                  {scanResults.scans && Object.entries(scanResults.scans).map(([scannerName, scanDetails]) => (
                    <div key={scannerName} className="p-3 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium font-mono">{scannerName}</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                        scanDetails.detected ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                      }`}>
                        {scanDetails.result || (scanDetails.detected ? 'Detected' : 'Undetected')}
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

export default ScanDetailsPage;
