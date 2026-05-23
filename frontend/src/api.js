// api.js
// Define the base URL for the FastAPI backend as a constant.
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000";

/**
 * Retrieve user location using a public IP location API
 */
export const getUserLocation = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Location service unavailable");
    const data = await res.json();
    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      status: "success"
    };
  } catch (error) {
    console.warn("Could not retrieve geolocation data:", error.message);
    return {
      country: "Local Network",
      city: "Local Host",
      latitude: 0,
      longitude: 0,
      status: "fail",
      message: error.message
    };
  }
};

/**
 * Sends a URL to the FastAPI backend for VirusTotal scanning.
 */
export const scanUrl = async (url) => {
  const location = await getUserLocation();
  const backendUrl = `${BACKEND_BASE_URL}/scan-url`;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, location }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to scan URL.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in scanUrl API:", error);
    throw error;
  }
};

/**
 * Perform lookup on file hash to see if report already exists
 */
export const scanFileHash = async (fileHash, filename = "file") => {
  const location = await getUserLocation();
  const backendUrl = `${BACKEND_BASE_URL}/scan-file/hash`;

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: fileHash, filename, location })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "File hash scan failed.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in scanFileHash API:", error);
    throw error;
  }
};

/**
 * Upload raw file to VirusTotal for active scanning
 */
export const uploadFileForScan = async (fileObject) => {
  const location = await getUserLocation();
  const backendUrl = `${BACKEND_BASE_URL}/scan-file/upload`;

  const formData = new FormData();
  formData.append("file", fileObject);
  if (location.country) formData.append("location_country", location.country);
  if (location.city) formData.append("location_city", location.city);
  if (location.latitude) formData.append("location_lat", location.latitude);
  if (location.longitude) formData.append("location_lon", location.longitude);

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "File upload scanning failed.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in uploadFileForScan API:", error);
    throw error;
  }
};

/**
 * Search the CVE vulnerabilities database by ID or keyword
 */
export const lookupCVE = async (query) => {
  const loc = await getUserLocation();
  const params = new URLSearchParams({
    query,
    country: loc.country || "",
    city: loc.city || "",
    lat: String(loc.latitude || 0),
    lon: String(loc.longitude || 0)
  });
  const backendUrl = `${BACKEND_BASE_URL}/cve/lookup?${params.toString()}`;

  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "CVE lookup failed.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in lookupCVE API:", error);
    throw error;
  }
};

/**
 * Submit raw mail headers for SPF/DKIM validation and hop calculation
 */
export const analyzeEmailHeaders = async (headersText) => {
  const location = await getUserLocation();
  const backendUrl = `${BACKEND_BASE_URL}/analyze-email-headers`;

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headers: headersText, location })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Email header analysis failed.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in analyzeEmailHeaders API:", error);
    throw error;
  }
};

/**
 * Fetch scan history from the backend database logs
 */
export const getScanHistory = async (limit = 50) => {
  const backendUrl = `${BACKEND_BASE_URL}/history?limit=${limit}`;
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) throw new Error("Failed to fetch scan history");
    return await response.json();
  } catch (error) {
    console.error("Error in getScanHistory API:", error);
    return [];
  }
};

/**
 * Fetch aggregation metrics for the 3D dashboard globe and statistics panel
 */
export const getDashboardMetrics = async () => {
  const backendUrl = `${BACKEND_BASE_URL}/dashboard-metrics`;
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) throw new Error("Failed to fetch dashboard metrics");
    return await response.json();
  } catch (error) {
    console.error("Error in getDashboardMetrics API:", error);
    return {
      total_scans: 0,
      type_counts: { url: 0, file: 0, cve: 0, email: 0 },
      threats_detected: 0,
      location_markers: []
    };
  }
};
