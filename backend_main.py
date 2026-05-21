"""
CORTEX-PRIME Backend - Main API Server
Mobile-first API bridge between frontend and Python automation
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title="CORTEX-PRIME API",
    version="1.0.0",
    description="Personal OS Backend - AI Automation & Knowledge Management"
)

# CORS for mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"name": "CORTEX-PRIME API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
