# Satellite-SRM Intelligence Platform: Complete Production System

**Target Problem Statement:** 26142  
**Organization:** National Technical Research Organisation (NTRO)  
**Theme:** Space Technology  
**Domain:** Deep Learning Based Super Resolution Mapping (SRM) from Medium Resolution Satellite Imageries  

---

## 🛰️ System Architecture

This repository contains the complete end-to-end production solution for **Satellite-SRM**, combining an advanced AI Earth Observation web frontend with a high-throughput deep learning backend raster pipeline.

```
satellite-srm/
├── run.py                         # Unified single-command launcher (Frontend UI + Backend API)
├── start.bat / start.ps1          # One-click Windows startup scripts
├── package.json                   # Root scripts (build, start, dev)
│
├── satellite-srm-frontend/        # Modern React 18 + TypeScript + Vite + Tailwind UI
│   ├── dist/                      # Production compiled assets (served by backend)
│   ├── public/sample-satellite/   # Verified Sentinel-2 L2A GeoTIFFs, PNGs & JSON metrics
│   ├── src/                       # Components, pages, hooks, state, types
│   └── package.json
│
└── satellite-srm-backend/         # FastAPI REST Gateway & PyTorch Inference Engine
    ├── server.py                  # Production FastAPI REST gateway serving static SPA & DL pipeline
    ├── requirements.txt
    └── core_engine/               # SwinIR models, losses, tiling, uncertainty, geospatial
```

---

## 🚀 Quick Start Guide (Combined Platform)

### Option A: Single Command Launch (Unified UI + Backend)
Run from the project root:
```bash
python run.py
```
*Or double click `start.bat` on Windows.*

This automatically verifies the frontend build and starts the combined server at:
- **Web App Console:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

### Option B: Separate Development Mode (Hot-Reloading)

**1. Launch Backend:**
```bash
cd satellite-srm-backend
python server.py
```

**2. Launch Frontend Dev Server:**
```bash
cd satellite-srm-frontend
npm run dev
```
Open `http://localhost:3001` in your browser with live Vite HMR proxying to backend on `:8000`.

---

## 🔬 Core Capabilities

1. **Multispectral Super-Resolution:** Ingests native 4-band 10m Sentinel-2 rasters (B02 Blue, B03 Green, B04 Red, B08 NIR) and reconstructs sub-4m spatial representation (3.33m GSD) using SwinIR.
2. **Spectral Consistency Preservation:** Enforces differentiable NDVI and band-ratio conservation loss to prevent artificial color/radiometric distortion.
3. **Uncertainty Quantification:** Monte Carlo Dropout produces a companion pixel-level spatial variance map to transparently communicate prediction confidence.
4. **Geospatial Integrity:** Preserves projection reference frames (EPSG:32644) and affine geotransform matrices for direct drag-and-drop loading into QGIS or ArcGIS.
5. **Interactive Console:** Dual-handle before/after comparison slider, synchronized side-by-side view, pixel-grid toggle, live computational telemetry, and GIS export bundle downloads.
