import sys
from pathlib import Path

backend_dir = Path("./satellite-srm-backend").resolve()
sys.path.insert(0, str(backend_dir))

import server
from fastapi.testclient import TestClient

def run_tests():
    client = TestClient(server.app)

    # 1. Health check
    res = client.get("/health")
    print(f"[1] GET /health -> status {res.status_code}: {res.json()['status']}")
    assert res.status_code == 200

    # 2. Root SPA index.html
    res = client.get("/")
    print(f"[2] GET / -> status {res.status_code}, length: {len(res.text)} bytes")
    assert res.status_code == 200
    assert "root" in res.text

    # 3. SPA Client-side route fallback
    res = client.get("/enhance")
    print(f"[3] GET /enhance -> status {res.status_code}, length: {len(res.text)} bytes")
    assert res.status_code == 200
    assert "root" in res.text

    res = client.get("/compare")
    print(f"[4] GET /compare -> status {res.status_code}, length: {len(res.text)} bytes")
    assert res.status_code == 200

    # 4. Jobs endpoint
    res = client.get("/api/v1/jobs")
    print(f"[5] GET /api/v1/jobs -> status {res.status_code}, jobs: {len(res.json())}")
    assert res.status_code == 200

    # 5. Output assets (True Color, Real Bands, False Color)
    for band_file in ["sr.png", "b02.png", "b03.png", "b04.png", "b08.png", "false_color.png"]:
        res = client.get(f"/api/v1/outputs/{band_file}")
        print(f"[6] GET /api/v1/outputs/{band_file} -> status {res.status_code}, size: {len(res.content)} bytes")
        assert res.status_code == 200
        assert len(res.content) > 1000

    # 6. Test Super-Resolution Upload API
    tif_file = Path("./test_image.tif")
    if tif_file.exists():
        with open(tif_file, "rb") as f:
            res = client.post(
                "/api/v1/super-resolution",
                files={"file": ("test_image.tif", f, "image/tiff")},
                data={"model": "SwinIR-SRM", "enable_uncertainty": "true", "scale_factor": 3.0}
            )
            print(f"[7] POST /api/v1/super-resolution -> status {res.status_code}, response: {res.json()}")
            assert res.status_code == 200
            assert "job_id" in res.json()

    print("\n>>> ALL UNIFIED PLATFORM TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    run_tests()
