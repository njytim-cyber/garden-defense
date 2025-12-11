"""
Script to remove white backgrounds from PNG images
Makes all tower and enemy assets truly transparent
"""

from PIL import Image
import os
from pathlib import Path

def remove_white_background(input_path, output_path, threshold=180):
    """Remove white/gray/checkerboard background from PNG"""
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        # Common checkerboard pattern colors
        CHECKERBOARD_COLORS = [
            (204, 204, 204),  # Light gray checkerboard
            (192, 192, 192),  # Silver
            (238, 238, 238),  # Very light gray
            (221, 221, 221),  # Light gray 2
            (255, 255, 255),  # Pure white
            (250, 250, 250),  # Near white
            (245, 245, 245),  # Near white 2
            (240, 240, 240),  # Light gray 3
        ]
        
        newData = []
        for item in datas:
            r, g, b, a = item
            
            # Already transparent
            if a < 10:
                newData.append(item)
                continue
                
            # Check exact checkerboard colors (with small tolerance)
            is_checkerboard = False
            for check_color in CHECKERBOARD_COLORS:
                if (abs(r - check_color[0]) < 10 and 
                    abs(g - check_color[1]) < 10 and 
                    abs(b - check_color[2]) < 10):
                    is_checkerboard = True
                    break
            
            if is_checkerboard:
                newData.append((255, 255, 255, 0))
                continue
            
            # Any light gray (R, G, B all similar and > threshold)
            if r > threshold and g > threshold and b > threshold:
                if abs(r - g) < 20 and abs(g - b) < 20:
                    newData.append((255, 255, 255, 0))
                    continue
            
            # Keep original
            newData.append(item)
        
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"✅ {os.path.basename(input_path)}")
        return True
    except Exception as e:
        print(f"❌ {os.path.basename(input_path)}: {e}")
        return False

def process_directory(dir_path):
    """Process all PNG files in a directory"""
    if not os.path.exists(dir_path):
        print(f"⚠️  Directory not found: {dir_path}")
        return
    
    png_files = list(Path(dir_path).glob("*.png"))
    print(f"\n📁 {os.path.basename(dir_path)}: {len(png_files)} files")
    
    for png_file in png_files:
        remove_white_background(str(png_file), str(png_file))

def main():
    print("🎨 Removing white backgrounds from PNG assets...\n")
    
    script_dir = Path(__file__).parent
    base_dir = script_dir.parent
    
    towers_dir = base_dir / "assets" / "towers"
    enemies_dir = base_dir / "assets" / "enemies"
    waypoints_dir = base_dir / "assets" / "waypoints"
    
    process_directory(towers_dir)
    process_directory(enemies_dir)
    process_directory(waypoints_dir)
    process_directory(base_dir / "assets" / "ui")
    
    print("\n✨ Done! Refresh your browser to see transparent backgrounds.")

if __name__ == "__main__":
    main()
