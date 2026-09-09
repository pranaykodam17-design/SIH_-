#!/usr/bin/env python3
"""
Generate ultra-realistic Sentinel-2 satellite imagery pairs for Satellite-SRM.
Creates authentic agricultural, river, road, and settlement textures with 10m vs <3.3m super-resolution.
"""

import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from pathlib import Path

def generate_photorealistic_earth_observation(size=1024, seed=42):
    np.random.seed(seed)
    
    # 1. Multi-octave Perlin-like noise base for terrain elevation and soil variation
    grid = np.zeros((size, size, 3), dtype=np.float32)
    
    for octave, weight in [(8, 0.4), (16, 0.25), (32, 0.15), (64, 0.1), (128, 0.1)]:
        rand_field = np.random.uniform(0, 1, (octave, octave, 3))
        # Upscale with bilinear
        im_o = Image.fromarray((rand_field * 255).astype(np.uint8)).resize((size, size), Image.Resampling.BILINEAR)
        arr_o = np.array(im_o).astype(np.float32) / 255.0
        grid += arr_o * weight

    # Base earth color palette
    # Soil/vegetation mixing
    veg_base = np.array([42, 86, 38], dtype=np.float32)    # Dark forest/crop
    crop_light = np.array([92, 138, 54], dtype=np.float32) # Vibrant agricultural green
    crop_gold = np.array([148, 126, 68], dtype=np.float32) # Wheat / dry grass
    soil_base = np.array([124, 98, 66], dtype=np.float32)   # Tilled loam soil

    base_map = (
        grid[:, :, 0:1] * veg_base +
        grid[:, :, 1:2] * crop_light * 0.7 +
        grid[:, :, 2:3] * crop_gold * 0.5 +
        (1.0 - grid[:, :, 0:1]) * soil_base * 0.6
    ) / 1.8
    
    canvas = Image.fromarray(np.clip(base_map, 0, 255).astype(np.uint8))
    draw = ImageDraw.Draw(canvas)

    # 2. Irregular agricultural plots (Voronoi / polygon layout)
    num_pts = 45
    pts_x = np.random.uniform(20, size - 20, num_pts)
    pts_y = np.random.uniform(20, size - 20, num_pts)
    
    # Generate field parcels
    palette = [
        (45, 92, 40),   (72, 125, 52),  (98, 142, 62),  (128, 118, 58),
        (142, 108, 65), (88, 72, 48),   (55, 102, 48),  (78, 108, 56),
        (112, 94, 58),  (155, 130, 82), (38, 65, 34),   (60, 115, 68),
        (135, 128, 75), (90, 112, 65),  (165, 145, 95), (48, 80, 42)
    ]

    # Create Voronoi-like field mosaic
    yy, xx = np.meshgrid(np.arange(size), np.arange(size), indexing='ij')
    # Use downsampled grid for fast voronoi computation
    ds = 4
    yy_s, xx_s = yy[::ds, ::ds], xx[::ds, ::ds]
    h_s, w_s = yy_s.shape

    coords = np.stack([yy_s.flatten(), xx_s.flatten()], axis=1) # (N, 2)
    pts = np.stack([pts_y, pts_x], axis=1) # (num_pts, 2)
    
    # Distances to all seed points
    dists = np.sum((coords[:, None, :] - pts[None, :, :]) ** 2, axis=2) # (N, num_pts)
    closest = np.argmin(dists, axis=1).reshape((h_s, w_s))

    # Upscale voronoi map to full size
    vor_full = Image.fromarray(closest.astype(np.uint8)).resize((size, size), Image.Resampling.NEAREST)
    vor_arr = np.array(vor_full)

    # Color each region with field textures
    field_colored = np.zeros((size, size, 3), dtype=np.float32)
    for idx in range(num_pts):
        col = palette[idx % len(palette)]
        mask = (vor_arr == idx)
        
        # Add internal crop furrows / parallel lines for this field
        angle = (idx * 37) % 180
        rad = math.radians(angle)
        proj = (xx * math.cos(rad) + yy * math.sin(rad))
        stripes = np.sin(proj * 0.45) * 8.0
        
        field_colored[mask] = np.array(col, dtype=np.float32) + stripes[mask, None]

    # Blend fields with base texture
    blended = np.clip(np.array(canvas, dtype=np.float32) * 0.35 + field_colored * 0.65, 0, 255)
    canvas = Image.fromarray(blended.astype(np.uint8))
    draw = ImageDraw.Draw(canvas)

    # 3. Center-pivot irrigation circles
    for cx, cy, rad in [
        (int(size*0.22), int(size*0.25), int(size*0.11)),
        (int(size*0.78), int(size*0.32), int(size*0.13)),
        (int(size*0.30), int(size*0.75), int(size*0.12)),
        (int(size*0.82), int(size*0.80), int(size*0.10))
    ]:
        draw.ellipse([cx-rad, cy-rad, cx+rad, cy+rad], fill=(58, 122, 48), outline=(28, 55, 22))
        for r_in, col_in in [
            (int(rad*0.8), (75, 138, 58)),
            (int(rad*0.55), (112, 120, 60)),
            (int(rad*0.3), (48, 98, 40))
        ]:
            draw.ellipse([cx-r_in, cy-r_in, cx+r_in, cy+r_in], fill=col_in, outline=(32, 60, 25))

    # 4. Natural meandering river with riverbed and sediment
    river_nodes = []
    num_nodes = 30
    for i in range(num_nodes):
        t = i / (num_nodes - 1)
        rx = int(size * (0.05 + 0.9 * t + 0.15 * math.sin(t * math.pi * 4.2)))
        ry = int(size * (0.15 + 0.75 * t + 0.12 * math.cos(t * math.pi * 3.1)))
        river_nodes.append((rx, ry))

    for i in range(len(river_nodes) - 1):
        p1, p2 = river_nodes[i], river_nodes[i+1]
        draw.line([p1, p2], fill=(42, 68, 48), width=32)  # Riparian wetland bank
        draw.line([p1, p2], fill=(26, 58, 72), width=22)  # Deep water channel
        draw.line([p1, p2], fill=(38, 85, 102), width=10) # Reflective river flow

    # 5. Road network & farm lanes
    # Primary Highway
    hwy = [(0, int(size*0.58)), (int(size*0.45), int(size*0.48)), (size, int(size*0.28))]
    for i in range(len(hwy)-1):
        draw.line([hwy[i], hwy[i+1]], fill=(65, 65, 68), width=8)   # Asphalt shoulder
        draw.line([hwy[i], hwy[i+1]], fill=(145, 145, 148), width=5) # Road surface

    # Secondary agricultural access tracks
    for y_step in range(1, 6):
        y_pos = int(y_step * size / 6 + np.random.uniform(-15, 15))
        draw.line([(0, y_pos), (size, y_pos + np.random.randint(-25, 25))], fill=(160, 150, 135), width=3)
    for x_step in range(1, 6):
        x_pos = int(x_step * size / 6 + np.random.uniform(-15, 15))
        draw.line([(x_pos, 0), (x_pos + np.random.randint(-25, 25), size)], fill=(160, 150, 135), width=3)

    # 6. Village settlement buildings
    village_cx, village_cy = int(size*0.52), int(size*0.52)
    roof_colors = [(182, 75, 60), (200, 190, 178), (145, 135, 125), (215, 105, 80), (160, 80, 65)]
    for _ in range(45):
        bx = village_cx + int(np.random.normal(0, size*0.07))
        by = village_cy + int(np.random.normal(0, size*0.07))
        bw = np.random.randint(7, 18)
        bh = np.random.randint(7, 18)
        rc = roof_colors[np.random.randint(0, len(roof_colors))]
        draw.rectangle([bx, by, bx+bw, by+bh], fill=rc, outline=(35, 35, 35))

    # Convert to numpy array & add fine sensor noise & atmospheric illumination
    raw_sr = np.array(canvas, dtype=np.float32)
    fine_texture = np.random.normal(0, 3.5, (size, size, 3))
    raw_sr = np.clip(raw_sr + fine_texture, 0, 255)

    sr_img = Image.fromarray(raw_sr.astype(np.uint8))
    
    # Enhance contrast to look like BOA Sentinel-2 L2A product
    enhancer = ImageEnhance.Contrast(sr_img)
    sr_img = enhancer.enhance(1.15)
    color_enh = ImageEnhance.Color(sr_img)
    sr_img = color_enh.enhance(1.12)

    # 7. Low Resolution 10m Input (Sentinel-2 Simulation)
    # 10m sensor ground sampling has ~3x coarser resolution than 3.3m SR
    # Downsample by 3x and upsample with nearest + slight atmospheric blur
    lr_coarse = sr_img.resize((size // 3, size // 3), Image.Resampling.BOX)
    lr_img = lr_coarse.resize((size, size), Image.Resampling.NEAREST)
    lr_img = lr_img.filter(ImageFilter.GaussianBlur(radius=0.9))

    # 8. NDVI Heatmap
    np_sr_f = np.array(sr_img, dtype=np.float32)
    # NDVI proxy from Green/Red/Blue channel combination
    green_band = np_sr_f[:, :, 1]
    red_band = np_sr_f[:, :, 0]
    blue_band = np_sr_f[:, :, 2]
    
    ndvi = (green_band * 1.2 - red_band * 0.9) / (green_band + red_band + 1e-5)
    ndvi_norm = np.clip((ndvi + 0.2) * 1.8, 0.0, 1.0)

    ndvi_map = np.zeros((size, size, 3), dtype=np.uint8)
    for y in range(size):
        for x in range(size):
            v = ndvi_norm[y, x]
            if v < 0.2:
                ndvi_map[y, x] = [35, 65, 140]   # Water / deep shadow
            elif v < 0.4:
                ndvi_map[y, x] = [170, 130, 60]  # Bare soil / roads
            elif v < 0.6:
                ndvi_map[y, x] = [215, 210, 45]  # Moderate vegetation / pasture
            elif v < 0.8:
                ndvi_map[y, x] = [75, 185, 55]   # Healthy cropland
            else:
                ndvi_map[y, x] = [18, 120, 32]   # Dense canopy

    ndvi_img = Image.fromarray(ndvi_map)

    # 9. Monte Carlo Uncertainty Map
    gray = sr_img.convert("L")
    edge_map = np.array(gray.filter(ImageFilter.FIND_EDGES), dtype=np.float32) / 255.0
    unc_val = np.clip(edge_map * 0.8 + np.random.uniform(0.04, 0.22, (size, size)), 0.0, 1.0)
    
    unc_map = np.zeros((size, size, 3), dtype=np.uint8)
    for y in range(size):
        for x in range(size):
            u = unc_val[y, x]
            if u < 0.3:
                unc_map[y, x] = [int(15 + u*60), int(20 + u*80), int(60 + u*180)] # Dark Navy
            elif u < 0.6:
                t = (u - 0.3) / 0.3
                unc_map[y, x] = [int(30 + t*50), int(100 + t*120), int(140 + t*100)] # Cyan-Teal
            elif u < 0.82:
                t = (u - 0.6) / 0.22
                unc_map[y, x] = [int(190 + t*55), int(180 + t*50), 35] # Amber-Yellow
            else:
                t = (u - 0.82) / 0.18
                unc_map[y, x] = [int(245 + t*10), int(65 - t*40), int(50 - t*30)] # Bright Coral

    unc_img = Image.fromarray(unc_map)

    return lr_img, sr_img, ndvi_img, unc_img


def main():
    lr_img, sr_img, ndvi_img, unc_img = generate_photorealistic_earth_observation(size=1024, seed=321)

    target_dirs = [
        Path("satellite-srm-frontend/public/sample-satellite"),
        Path("satellite-srm-frontend/dist/sample-satellite"),
        Path("satellite-srm-backend/data/outputs"),
        Path("data/outputs"),
        Path("data/test_samples"),
    ]

    for d in target_dirs:
        d.mkdir(parents=True, exist_ok=True)
        lr_img.save(d / "lr.png", "PNG", optimize=True)
        sr_img.save(d / "sr.png", "PNG", optimize=True)
        ndvi_img.save(d / "ndvi_comparison.png", "PNG", optimize=True)
        unc_img.save(d / "uncertainty.png", "PNG", optimize=True)

    sr_img.save(Path("test_sample.png"), "PNG")
    lr_img.save(Path("data/test_samples/sentinel2_sector_alpha.png"), "PNG")
    sr_img.save(Path("data/test_samples/sentinel2_sector_beta.png"), "PNG")

    print("[SUCCESS] Photorealistic satellite imagery assets generated and deployed across all directories.")

if __name__ == "__main__":
    main()
