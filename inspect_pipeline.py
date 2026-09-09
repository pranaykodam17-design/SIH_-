"""
Inspect the actual input/output pipeline for Satellite-SRM.
Analyze TIFF files, band data, dimensions, pixel ranges, and PNG generation.
"""

import os
import json
from pathlib import Path
import numpy as np
from PIL import Image

# Try to import rasterio for GeoTIFF analysis
try:
    import rasterio
    HAS_RASTERIO = True
except ImportError:
    HAS_RASTERIO = False
    print("⚠️  rasterio not available - will use PIL/numpy only")

def inspect_tiff(filepath, name=""):
    """Inspect a TIFF file for dimensions, bands, dtype, and pixel range."""
    print(f"\n{'='*60}")
    print(f"TIFF File: {name}")
    print(f"Path: {filepath}")
    print(f"{'='*60}")
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return None
    
    file_size_mb = os.path.getsize(filepath) / (1024*1024)
    print(f"File size: {file_size_mb:.2f} MB")
    
    # Try rasterio first
    if HAS_RASTERIO:
        try:
            with rasterio.open(filepath) as src:
                print(f"Driver: {src.driver}")
                print(f"Dimensions: {src.width} x {src.height}")
                print(f"Number of bands: {src.count}")
                print(f"Data type: {src.dtypes[0]}")
                print(f"CRS: {src.crs}")
                print(f"Transform: {src.transform}")
                
                data_summary = {}
                for i in range(1, min(src.count + 1, 5)):  # First 4 bands
                    band = src.read(i)
                    data_summary[f"Band_{i}"] = {
                        "dtype": str(band.dtype),
                        "min": float(np.min(band)),
                        "max": float(np.max(band)),
                        "mean": float(np.mean(band)),
                        "std": float(np.std(band)),
                        "shape": band.shape
                    }
                
                for band_name, stats in data_summary.items():
                    print(f"\n{band_name}:")
                    print(f"  Shape: {stats['shape']}")
                    print(f"  Data type: {stats['dtype']}")
                    print(f"  Pixel range: [{stats['min']:.1f}, {stats['max']:.1f}]")
                    print(f"  Mean: {stats['mean']:.1f}, Std: {stats['std']:.1f}")
                
                return data_summary
        except Exception as e:
            print(f"Rasterio error: {e}")
    
    # Fallback to PIL
    try:
        img = Image.open(filepath)
        print(f"\nPIL Analysis:")
        print(f"Format: {img.format}")
        print(f"Size: {img.size}")
        print(f"Mode: {img.mode}")
        
        # Try to get pixel data
        img_array = np.array(img)
        print(f"Array shape: {img_array.shape}")
        print(f"Array dtype: {img_array.dtype}")
        print(f"Pixel range: [{np.min(img_array)}, {np.max(img_array)}]")
        print(f"Mean: {np.mean(img_array):.1f}, Std: {np.std(img_array):.1f}")
        
        return img_array
    except Exception as e:
        print(f"PIL error: {e}")
    
    return None


def inspect_png(filepath, name=""):
    """Inspect a PNG file."""
    print(f"\n{'='*60}")
    print(f"PNG File: {name}")
    print(f"Path: {filepath}")
    print(f"{'='*60}")
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return None
    
    file_size_kb = os.path.getsize(filepath) / 1024
    print(f"File size: {file_size_kb:.1f} KB")
    
    img = Image.open(filepath)
    print(f"Format: {img.format}")
    print(f"Size (W x H): {img.size[0]} x {img.size[1]}")
    print(f"Mode: {img.mode}")
    
    img_array = np.array(img)
    print(f"Array shape: {img_array.shape}")
    print(f"Array dtype: {img_array.dtype}")
    print(f"Pixel value range: [{np.min(img_array)}, {np.max(img_array)}]")
    
    if len(img_array.shape) == 3:
        for i, channel in enumerate(['R', 'G', 'B']):
            if i < img_array.shape[2]:
                ch_data = img_array[:, :, i]
                print(f"  {channel} channel: min={np.min(ch_data)}, max={np.max(ch_data)}, mean={np.mean(ch_data):.1f}")
    
    return img_array


def check_uploads():
    """Check what's been uploaded to the backend."""
    upload_dir = Path("C:\\Users\\vemul\\OneDrive\\Desktop\\satellite_srm_complete_platform.1\\satellite-srm-backend\\data\\uploads")
    
    print(f"\n{'='*60}")
    print("UPLOADED FILES")
    print(f"{'='*60}")
    
    if upload_dir.exists():
        files = list(upload_dir.glob("*"))
        if files:
            for f in files[:10]:  # Show first 10
                size_mb = f.stat().st_size / (1024*1024)
                print(f"  {f.name}: {size_mb:.2f} MB")
        else:
            print("  (no files)")
    else:
        print(f"  Upload directory doesn't exist: {upload_dir}")


def main():
    print("\n" + "="*70)
    print(" SATELLITE-SRM IMAGE PIPELINE INSPECTION")
    print("="*70)
    
    # Paths
    sample_dir = Path("C:\\Users\\vemul\\OneDrive\\Desktop\\satellite_srm_complete_platform.1\\satellite-srm-frontend\\public\\sample-satellite")
    output_dir = Path("C:\\Users\\vemul\\OneDrive\\Desktop\\satellite_srm_complete_platform.1\\satellite-srm-backend\\data\\outputs")
    
    # Inspect sample GeoTIFF (SR output)
    sr_tif_path = sample_dir / "SR_product.tif"
    inspect_tiff(sr_tif_path, "Sample SR_product.tif (Expected Output)")
    
    # Inspect sample uncertainty map
    uncertainty_tif_path = sample_dir / "uncertainty_map.tif"
    inspect_tiff(uncertainty_tif_path, "Sample uncertainty_map.tif")
    
    # Inspect the PNG preview
    sr_png_path = sample_dir / "sr.png"
    sr_png_data = inspect_png(sr_png_path, "Sample sr.png (Preview)")
    
    # Check if it looks pixelated (low-res upscaled?)
    if sr_png_data is not None:
        print(f"\n⚠️  PIXELATION ANALYSIS:")
        print(f"  PNG dimensions: {sr_png_data.shape}")
        if len(sr_png_data.shape) >= 2:
            h, w = sr_png_data.shape[0], sr_png_data.shape[1]
            print(f"  If upscaled from ~512x512, pixelation expected: {512 < w < 2000 and h < 2000}")
    
    # Check metadata
    tif_meta_path = sample_dir / "SR_product.tif.meta.json"
    if tif_meta_path.exists():
        print(f"\n{'='*60}")
        print("SR_product.tif Metadata")
        print(f"{'='*60}")
        with open(tif_meta_path) as f:
            meta = json.load(f)
            for key, val in meta.items():
                print(f"  {key}: {val}")
    
    # Check generated outputs
    print(f"\n{'='*60}")
    print("GENERATED OUTPUTS")
    print(f"{'='*60}")
    
    if output_dir.exists():
        tif_files = list(output_dir.glob("*.tif"))
        if tif_files:
            print(f"Found {len(tif_files)} TIFF files")
            # Inspect the most recent job
            recent_tifs = sorted(tif_files, key=lambda x: x.stat().st_mtime, reverse=True)[:2]
            for tif in recent_tifs:
                if "SR_product_SRM-" in tif.name:
                    inspect_tiff(tif, f"Recent: {tif.name}")
    
    # Check uploads
    check_uploads()
    
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    print("""
Next steps:
1. Check if SR_product.tif is actually 512x512 or 1933x1038
2. Check if sr.png is same resolution as TIF or upscaled/downscaled
3. Check PNG encoding - does it preserve the image quality?
4. Verify band composition - are B04/B03/B02 (RGB) being used?
5. Check for normalization issues - pixel range might be off
6. Look for actual model processing vs. just using sample files
""")


if __name__ == "__main__":
    main()
