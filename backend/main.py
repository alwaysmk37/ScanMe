# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests # Used for making HTTP requests to external APIs like VirusTotal
import json # Standard library, useful for JSON operations
import os # Used for environment variables (good practice for API keys)
import time # Used for time.sleep() to introduce delays in API polling

# Initialize FastAPI app
app = FastAPI(
    title="URL Scanner Backend",
    description="Backend service for scanning URLs using VirusTotal API."
)

# Configure CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for incoming URL requests
class URLScanRequest(BaseModel):
    url: str

# --- API Keys Configuration ---
# !!! IMPORTANT: Replace with your actual VirusTotal API key.
# It's highly recommended to load this from environment variables (e.g., using `os.getenv`).
VIRUSTOTAL_API_KEY = "d2c71241a8df7c885795f0386379ec0b74d0a33c5011d63d0c5c28d6a5f6e5cb" # <<< Replace with your VirusTotal API key!

# Note: The visual header for the URL scanner application is designed and rendered
# in the React frontend (specifically in src/components/Header.jsx), and is not
# managed by this FastAPI backend. This backend focuses solely on API logic.

@app.post("/scan-url")
async def scan_url(request_data: URLScanRequest):
    """
    Endpoint to scan a URL using the VirusTotal API.
    """
    url_to_scan = request_data.url
    vt_api_url = "https://www.virustotal.com/api/v3/urls"

    if not VIRUSTOTAL_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="VirusTotal API key is not configured on the backend. Please set the VIRUSTOTAL_API_KEY."
        )

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "url": url_to_scan
    }

    try:
        # Step 1: Submit the URL for analysis
        submit_response = requests.post(
            vt_api_url,
            headers=headers,
            data=payload
        )
        submit_response.raise_for_status()
        analysis_data = submit_response.json()

        if "data" not in analysis_data or "id" not in analysis_data["data"]:
            raise HTTPException(
                status_code=500,
                detail="VirusTotal API did not return an analysis ID upon submission."
            )

        analysis_id = analysis_data["data"]["id"]
        report_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"

        # Poll for the report (simplified: just one attempt after a short delay)
        time.sleep(5)

        report_response = requests.get(report_url, headers={"x-apikey": VIRUSTOTAL_API_KEY})
        report_response.raise_for_status()
        report_data = report_response.json()

        if "data" not in report_data or "attributes" not in report_data["data"]:
            raise HTTPException(
                status_code=500,
                detail="VirusTotal API did not return analysis attributes in the report."
            )

        attributes = report_data["data"]["attributes"]
        results = attributes.get("results", {})
        
        formatted_scans = {}
        for scanner_name, scan_info in results.items():
            formatted_scans[scanner_name] = {
                "detected": scan_info.get("category") == "malicious",
                "result": scan_info.get("result"),
                "engine": scan_info.get("engine_name"),
                "malicious": scan_info.get("category") == "malicious",
                "update": scan_info.get("engine_update"),
            }

        final_response = {
            "url": url_to_scan,
            "scans": formatted_scans,
            "positives": attributes.get("stats", {}).get("malicious", 0),
            "total": sum(attributes.get("stats", {}).values()),
            "scan_date": None
        }
        if attributes.get("date"):
            final_response["scan_date"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(attributes["date"]))

        return final_response

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err} - {http_err.response.text}")
        raise HTTPException(
            status_code=http_err.response.status_code,
            detail=f"VirusTotal API error: {http_err.response.text}"
        )
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Connection error occurred: {conn_err}")
        raise HTTPException(
            status_code=503,
            detail="Could not connect to VirusTotal API. Please check your internet connection or API key."
        )
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error occurred: {timeout_err}")
        raise HTTPException(
            status_code=504,
            detail="VirusTotal API request timed out."
        )
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {e}"
        )
    