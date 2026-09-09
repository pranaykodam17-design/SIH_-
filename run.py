#!/usr/bin/env python3
"""
Satellite-SRM Unified Application Runner
Combines the React 18 / Vite frontend and FastAPI backend into a single unified service.
"""

import os
import sys
import argparse
import subprocess
import webbrowser
import threading
import time
from pathlib import Path

# Safe stdout handling for Windows terminals
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT_DIR / "satellite-srm-frontend"
BACKEND_DIR = ROOT_DIR / "satellite-srm-backend"
FRONTEND_DIST = FRONTEND_DIR / "dist"


def build_frontend(force: bool = False):
    """Ensure frontend dist bundle is built."""
    if not FRONTEND_DIST.exists() or not (FRONTEND_DIST / "index.html").exists() or force:
        print("[Satellite-SRM] Building React frontend bundle...")
        npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
        try:
            subprocess.run([npm_cmd, "run", "build"], cwd=str(FRONTEND_DIR), check=True)
            print("[Satellite-SRM] Frontend build succeeded!")
        except Exception as err:
            print(f"[Satellite-SRM] Warning: npm build failed ({err}). Attempting to continue...")
    else:
        print("[Satellite-SRM] Frontend build verified (dist/ ready).")


def open_browser_delayed(url: str, delay: float = 1.5):
    """Open web browser after server starts."""
    time.sleep(delay)
    print(f"[Satellite-SRM] Opening browser at {url}")
    webbrowser.open(url)


def main():
    parser = argparse.ArgumentParser(description="Launch Satellite-SRM Combined Platform")
    parser.add_argument("--host", default="0.0.0.0", help="Host interface to bind to (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    parser.add_argument("--reload", action="store_true", help="Enable uvicorn hot reloading for development")
    parser.add_argument("--rebuild-frontend", action="store_true", help="Force rebuild frontend before launching")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open browser")

    args = parser.parse_args()

    # Verify or build frontend
    build_frontend(force=args.rebuild_frontend)

    # Add backend directory to sys.path so server can be imported
    sys.path.insert(0, str(BACKEND_DIR))
    os.chdir(str(BACKEND_DIR))

    url = f"http://{'localhost' if args.host == '0.0.0.0' else args.host}:{args.port}"
    print("\n" + "=" * 65)
    print(" [SATELLITE-SRM] COMBINED PRODUCTION PLATFORM ACTIVE")
    print(f" Web Console & UI:       {url}")
    print(f" Interactive API Docs:   {url}/docs")
    print(f" System Health Check:    {url}/health")
    print("=" * 65 + "\n")

    if not args.no_browser and not args.reload:
        threading.Thread(target=open_browser_delayed, args=(url,), daemon=True).start()

    import uvicorn
    uvicorn.run("server:app", host=args.host, port=args.port, reload=args.reload)


if __name__ == "__main__":
    main()
