import React, { useState } from 'react';
import { scanUrl } from '../api.js'; // Retaining .js extension
import ScanDetailsPage from './ScanDetailsPage'; // Removed .jsx extension

// UrlInputForm Component: Handles URL input and scan submission.
const UrlInputForm = ({ onScanSubmit }) => {
  const [url, setUrl] = useState('');

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onScanSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Scan a URL</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          value={url}
          onChange={handleChange}
          placeholder="Enter URL to scan (e.g., https://example.com)"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg font-inter"
        >
          Scan URL
        </button>
      </form>
    </div>
  );
};

// Scanner Component: Manages the URL scanning logic and state, and renders the input form or detailed results.
const Scanner = () => {
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false); // State to indicate VirusTotal scan loading status.
  const [showDetailsPage, setShowDetailsPage] = useState(false); // New state to control page view

  // Function to perform the actual VirusTotal API call via the FastAPI backend.
  const handleScanSubmit = async (url) => {
    setLoading(true);
    setScanResults(null); // Clear previous results immediately
    setShowDetailsPage(true); // Switch to the details page immediately

    try {
      const data = await scanUrl(url);
      setScanResults(data);
    } catch (error) {
      console.error("Error scanning URL:", error);
      // Even on error, show the details page with the error message
      setScanResults({ url: url, error: error.message || "Failed to connect to scanner API. Please try again." });
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  };

  // Function to reset to the new scan form
  const handleNewScan = () => {
    setScanResults(null);
    setLoading(false);
    setShowDetailsPage(false); // Go back to the input form
  };

  return (
    <>
      {showDetailsPage ? (
        // Always render the ScanDetailsPage if showDetailsPage is true.
        // The ScanDetailsPage component will handle showing its own loading state
        // or the results/error based on the 'loading' and 'scanResults' props.
        <ScanDetailsPage
          scanResults={scanResults}
          loading={loading} // Pass loading state to the details page
          onNewScan={handleNewScan}
        />
      ) : (
        // Render the input form if showDetailsPage is false.
        <UrlInputForm onScanSubmit={handleScanSubmit} />
      )}
    </>
  );
};

export default Scanner;
