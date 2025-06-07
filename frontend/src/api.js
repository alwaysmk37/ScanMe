// api.js

// Define the base URL for the FastAPI backend as a constant.
// IMPORTANT: Adjust this URL if your FastAPI server runs on a different address/port.
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

/**
 * Sends a URL to the FastAPI backend for VirusTotal scanning.
 * @param {string} url - The URL to be scanned.
 * @returns {Promise<Object>} A promise that resolves with the scan results or rejects with an error.
 */
export const scanUrl = async (url) => {
  // Construct the full backend API endpoint using the base URL.
  const backendUrl = `${BACKEND_BASE_URL}/scan-url`;

  try {
    // Perform a POST request to the backend with the URL in the request body.
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }), // Send the URL as a JSON object.
    });

    // Check if the HTTP response status is not OK (i.e., 4xx or 5xx).
    if (!response.ok) {
      // Parse the error data from the response to get more details.
      const errorData = await response.json();
      // Throw an error with the detailed message from the backend, or a generic one if not available.
      throw new Error(errorData.detail || `Failed to scan URL via backend (Status: ${response.status}).`);
    }

    // If the response is OK, parse the JSON data from the response body.
    const data = await response.json();
    // Return the parsed data (scan results).
    return data;
  } catch (error) {
    // Catch any network errors or errors thrown from the `if (!response.ok)` block.
    console.error("Error in scanUrl API call:", error);
    // Re-throw a new error with a user-friendly message, preserving the original error message if possible.
    throw new Error(error.message || "An unknown error occurred during the API call.");
  }
};

// The summarizeScanResults function has been removed as the Gemini API feature is being removed.
