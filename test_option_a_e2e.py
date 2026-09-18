import requests
import json
import time
import os
import sys
from PIL import Image
import io

BASE_URL = 'http://127.0.0.1:8000'

def main():
    print('=== 1. Testing Backend Health ===')
    h = requests.get(f'{BASE_URL}/health').json()
    print('Health status:', h.get('status'), 'Bands supported:', h.get('bands_supported'))
    assert h.get('status') == 'healthy'

    print('\n=== 2. Testing 4-Band Validation (Valid) ===')
    with open('data/test_samples/S2_B02.tif', 'rb') as f2, \
         open('data/test_samples/S2_B03.tif', 'rb') as f3, \
         open('data/test_samples/S2_B04.tif', 'rb') as f4, \
         open('data/test_samples/S2_B08.tif', 'rb') as f8:
        files = {
            'b02': ('S2_B02.tif', f2, 'image/tiff'),
            'b03': ('S2_B03.tif', f3, 'image/tiff'),
            'b04': ('S2_B04.tif', f4, 'image/tiff'),
            'b08': ('S2_B08.tif', f8, 'image/tiff'),
        }
        res = requests.post(f'{BASE_URL}/api/v1/validate-bands', files=files)
        assert res.status_code == 200, f'Expected 200, got {res.status_code}'
        data = res.json()
        assert data['valid'] is True
        print('Validation passed! Bands verified:', list(data['metadata'].keys()))
        print('Common dimensions:', data['metadata']['common']['width'], 'x', data['metadata']['common']['height'])
        print('Common CRS:', data['metadata']['common']['crs'])

    print('\n=== 3. Testing 4-Band Validation Rejection (Missing B08) ===')
    with open('data/test_samples/S2_B02.tif', 'rb') as f2, \
         open('data/test_samples/S2_B03.tif', 'rb') as f3, \
         open('data/test_samples/S2_B04.tif', 'rb') as f4:
        files_missing = {
            'b02': ('S2_B02.tif', f2, 'image/tiff'),
            'b03': ('S2_B03.tif', f3, 'image/tiff'),
            'b04': ('S2_B04.tif', f4, 'image/tiff'),
        }
        res = requests.post(f'{BASE_URL}/api/v1/validate-bands', files=files_missing)
        assert res.status_code == 422, f'Expected 422, got {res.status_code}'
        print('Missing band rejected correctly (422):', res.json()['detail'])

    print('\n=== 4. Testing Real 4-Band Super-Resolution Inference ===')
    with open('data/test_samples/S2_B02.tif', 'rb') as f2, \
         open('data/test_samples/S2_B03.tif', 'rb') as f3, \
         open('data/test_samples/S2_B04.tif', 'rb') as f4, \
         open('data/test_samples/S2_B08.tif', 'rb') as f8:
        files_sr = {
            'b02': ('S2_B02.tif', f2, 'image/tiff'),
            'b03': ('S2_B03.tif', f3, 'image/tiff'),
            'b04': ('S2_B04.tif', f4, 'image/tiff'),
            'b08': ('S2_B08.tif', f8, 'image/tiff'),
        }
        sr_res = requests.post(
            f'{BASE_URL}/api/v1/super-resolution',
            files=files_sr,
            data={'model': 'SwinIR-SRM', 'enable_uncertainty': 'true', 'scale_factor': 3.0}
        )
        assert sr_res.status_code == 200, f'Expected 200, got {sr_res.status_code}'
        job_id = sr_res.json()['job_id']
        print(f'Job created: {job_id}')

    # Poll job
    job = None
    for i in range(25):
        time.sleep(1)
        job = requests.get(f'{BASE_URL}/api/v1/jobs/{job_id}').json()
        prog = job.get("overallProgress")
        stg = job.get("currentStageId")
        stat = job.get("status")
        print(f'[{i+1}s] Progress: {prog}% | Stage: {stg} | Status: {stat}')
        if stat in ['completed', 'failed']:
            break

    assert job.get('status') == 'completed', f'Job failed: {job.get("error")}'
    print('Job completed successfully!')

    print('\n=== 5. Verifying Generated Products and Band Integrity ===')
    outputs = job['outputs']
    for k, url in outputs.items():
        r = requests.get(f'{BASE_URL}{url}')
        print(f'Output {k}: HTTP {r.status_code} ({len(r.content)} bytes)')
        assert r.status_code == 200, f'Failed downloading {k}'

    # Verify 4-band GeoTIFF
    sr_tif_url = outputs['srGeoTiffUrl']
    sr_tif_data = requests.get(f'{BASE_URL}{sr_tif_url}').content
    img = Image.open(io.BytesIO(sr_tif_data))
    print('\nDownloaded SR GeoTIFF specs:')
    print('Mode:', img.mode)
    print('Bands count:', len(img.getbands()), 'Bands:', img.getbands())
    print('Resolution:', img.size)
    assert len(img.getbands()) == 4, 'SR GeoTIFF must be 4 bands'

    print('\n=== ALL END-TO-END TESTS PASSED SUCCESSFULLY! ===')

if __name__ == '__main__':
    main()
