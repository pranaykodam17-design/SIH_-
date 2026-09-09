import requests
import json
import time

# Test upload
print("Testing file upload...")
with open('test_image.tif', 'rb') as f:
    files = {
        'file': ('test_image.tif', f, 'image/tiff')
    }
    data = {
        'model': 'SwinIR-SRM',
        'enable_uncertainty': 'true',
        'scale_factor': '3'
    }
    
    response = requests.post(
        'http://localhost:8000/api/v1/super-resolution',
        files=files,
        data=data
    )
    
    print("Status Code:", response.status_code)
    result = response.json()
    print(json.dumps(result, indent=2))
    
    if 'job_id' in result:
        job_id = result['job_id']
        print(f"\n✓ Got job_id: {job_id}")
        
        # Poll job status
        print("\nPolling job status...")
        for i in range(20):
            time.sleep(1)
            status_response = requests.get(f'http://localhost:8000/api/v1/jobs/{job_id}')
            job_status = status_response.json()
            
            progress = job_status.get('overallProgress', 0)
            status = job_status.get('status', 'unknown')
            message = job_status.get('message', '')
            
            print(f"  [{i+1}] Status: {status} | Progress: {progress}% | {message[:60]}")
            
            if status in ['completed', 'failed']:
                print(f"\n✓ Job completed with status: {status}")
                
                if status == 'completed':
                    print("\nOutput URLs:")
                    outputs = job_status.get('outputs', {})
                    for key, url in outputs.items():
                        print(f"  - {key}: {url}")
                    
                    # Test download
                    print("\nTesting output download...")
                    sr_url = outputs.get('srGeoTiffUrl')
                    if sr_url:
                        # Construct full URL
                        full_url = 'http://localhost:8000' + sr_url if sr_url.startswith('/') else sr_url
                        download_resp = requests.get(full_url)
                        print(f"  - Downloaded {sr_url}: {download_resp.status_code}")
                
                break
    else:
        print("ERROR: No job_id in response!")
