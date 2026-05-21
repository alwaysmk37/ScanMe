from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
import time
from dotenv import load_dotenv

# --- Load environment variables safely ---
load_dotenv()  # Loads .env file if it exists

# Load VirusTotal API key
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

if not VIRUSTOTAL_API_KEY:
    print("⚠️  WARNING: VIRUSTOTAL_API_KEY not found in environment variables.")
else:
    print(f"✅ Loaded VirusTotal API key (first 8 chars): {VIRUSTOTAL_API_KEY[:8]}********")

# --- Initialize FastAPI ---
app = FastAPI(
    title="URL Scanner Backend",
    description="Backend service for scanning URLs using VirusTotal API.",
)

origins = [
    "http://localhost:5173",  # Vite local frontend
    "https://scan-me-steel.vercel.app/"  # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request Model ---
class URLScanRequest(BaseModel):
    url: str


# --- Main API Endpoint ---
@app.post("/scan-url")
async def scan_url(request_data: URLScanRequest):
    """
    Scan a URL using the VirusTotal API and return formatted results.
    """
    url_to_scan = request_data.url
    vt_api_url = "https://www.virustotal.com/api/v3/urls"

    # Validate API key
    if not VIRUSTOTAL_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="VirusTotal API key not configured on the backend."
        )

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    payload = {"url": url_to_scan}

    try:
        # Step 1: Submit the URL for scanning
        submit_response = requests.post(vt_api_url, headers=headers, data=payload)
        submit_response.raise_for_status()
        analysis_data = submit_response.json()

        if "data" not in analysis_data or "id" not in analysis_data["data"]:
            raise HTTPException(
                status_code=500,
                detail="VirusTotal API did not return a valid analysis ID."
            )

        analysis_id = analysis_data["data"]["id"]
        report_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"

        # Step 2: Poll for report completion with retries
        max_retries = 12  # Try for up to 60 seconds (12 * 5 seconds)
        retry_count = 0
        report_data = None

        while retry_count < max_retries:
            time.sleep(5)  # Wait 5 seconds between attempts
            report_response = requests.get(report_url, headers=headers)
            report_response.raise_for_status()
            report_data = report_response.json()

            if "data" not in report_data or "attributes" not in report_data["data"]:
                raise HTTPException(
                    status_code=500,
                    detail="VirusTotal report missing expected fields."
                )

            attributes = report_data["data"]["attributes"]
            status = attributes.get("status", "unknown")

            # Check if analysis is complete
            if status == "completed":
                print(f"✅ Analysis completed after {retry_count + 1} attempts")
                break

            retry_count += 1
            print(f"⏳ Analysis in progress (attempt {retry_count}/{max_retries}), status: {status}")

        if retry_count >= max_retries:
            raise HTTPException(
                status_code=504,
                detail="VirusTotal analysis took too long to complete. Please try again."
            )

        attributes = report_data["data"]["attributes"]
        results = attributes.get("results", {})

        formatted_scans = {
            name: {
                "detected": info.get("category") == "malicious",
                "result": info.get("result"),
                "engine": info.get("engine_name"),
                "update": info.get("engine_update"),
            }
            for name, info in results.items()
        }

        # If no scan results available, it means the URL is likely clean
        if not formatted_scans:
            print(f"⚠️  No threat detections found for URL: {url_to_scan}")

        final_response = {
            "url": url_to_scan,
            "scans": formatted_scans,
            "positives": attributes.get("stats", {}).get("malicious", 0),
            "total": sum(attributes.get("stats", {}).values()),
            "scan_date": (
                time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(attributes["date"]))
                if attributes.get("date")
                else None
            ),
        }

        return final_response

    except requests.exceptions.HTTPError as http_err:
        print(f"❌ HTTP error: {http_err.response.text}")
        raise HTTPException(
            status_code=http_err.response.status_code,
            detail=f"VirusTotal API error: {http_err.response.text}"
        )

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Connection error: Could not reach VirusTotal API."
        )

    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="VirusTotal API request timed out."
        )

    except Exception as e:
        print(f"💥 Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected backend error: {str(e)}"
        )
