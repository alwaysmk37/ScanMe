import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from './Header'; // Removed .jsx extension
import Footer from './Footer'; // Removed .jsx extension

// Define a color palette for the chart
const COLORS = {
  MALICIOUS: '#ef4444', // Red
  CLEAN: '#22c55e',     // Green
  UNDETECTED: '#6b7280', // Gray
};

const ScanDetailsPage = ({ scanResults, loading, onNewScan }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0); // Reset progress when loading starts
      // Simulate progress from 0 to 95% over the 5-second backend wait time
      interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress < 95) {
            return prevProgress + 1; // Increment slowly
          }
          return prevProgress;
        });
      }, 50); // Update every 50ms (50 * 95 = 4750ms ~ 4.75s)
    } else {
      // If not loading, quickly complete progress to 100%
      setProgress(100);
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Clean up interval on component unmount or loading change
  }, [loading]);

  // Helper function to process scan data for charts
  const dataForPieChart = () => {
    if (!scanResults || !scanResults.scans) {
      return [];
    }
    const maliciousCount = scanResults.positives;
    const cleanCount = Object.values(scanResults.scans).filter(
      (s) => s.result === 'clean' && !s.detected
    ).length;
    const undetectedCount = scanResults.total - maliciousCount - cleanCount;

    return [
      { name: 'Malicious', value: maliciousCount, color: COLORS.MALICIOUS },
      { name: 'Clean', value: cleanCount, color: COLORS.CLEAN },
      { name: 'Undetected/Other', value: undetectedCount, color: COLORS.UNDETECTED },
    ].filter(item => item.value > 0); // Only show segments with values greater than 0
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Header />

      <main className="pt-24 container mx-auto p-4">
        {loading ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mb-8">
            <div className="animate-pulse rounded-full h-16 w-16 bg-blue-200 mx-auto mb-4 flex items-center justify-center text-blue-800 text-sm font-bold">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-4">Scanning URL, please wait...</p>
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {progress}%
              </span>
            </div>
          </div>
        ) : !scanResults ? (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8 text-center text-gray-500">
            <p className="p-8">No scan results to display. Please perform a scan.</p>
            <button
              onClick={onNewScan}
              className="mt-4 bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg font-inter"
            >
              Perform New Scan
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
              Detailed Scan Report for: <span className="text-blue-700 break-all">{scanResults.url}</span>
            </h2>

            {scanResults.error ? (
              <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
                <strong className="font-bold">Scan Error: </strong>
                <span className="block sm:inline">{scanResults.error}</span>
              </div>
            ) : (
              <div className="text-center mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xl text-gray-700 mb-2">
                  Total Positives: <span className="font-bold text-red-600">{scanResults.positives}</span> / {scanResults.total}
                </p>
                {scanResults.scan_date && (
                  <p className="text-md text-gray-600">Last Scanned: {new Date(scanResults.scan_date).toLocaleString()}</p>
                )}
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Detection Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataForPieChart()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {dataForPieChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Individual Scanner Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(scanResults.scans).map(([scannerName, scanDetails]) => (
                  <div key={scannerName} className="border border-gray-200 p-4 rounded-md bg-gray-50 shadow-sm">
                    <h4 className="font-bold text-lg mb-2 text-blue-700">{scannerName}</h4>
                    <div className="space-y-1 text-sm">
                      {scanDetails.detected !== undefined && (
                        <p className="font-semibold">Detected: <span className={scanDetails.detected ? "text-red-600" : "text-green-600"}>{scanDetails.detected ? 'Yes' : 'No'}</span></p>
                      )}
                      {scanDetails.result && (
                        <p>Result: <span className="font-semibold">{scanDetails.result}</span></p>
                      )}
                      {scanDetails.malicious !== undefined && (
                        <p className="font-semibold">Malicious: <span className={scanDetails.malicious ? "text-red-600" : "text-green-600"}>{scanDetails.malicious ? 'Yes' : 'No'}</span></p>
                      )}
                      {scanDetails.engine && (
                        <p>Engine: {scanDetails.engine}</p>
                      )}
                      {scanDetails.update && (
                        <p>Last Update: {scanDetails.update}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                onClick={onNewScan}
                className="bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg font-inter"
              >
                Perform Another Scan
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ScanDetailsPage;
