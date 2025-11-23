import json
import os
import requests
from urllib.parse import urlparse

# Configuration
DATA_FILE = 'data/itineraries.json'
IMAGE_DIR = 'static/images/itineraries'

# Ensure image directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)

def download_image(url, filename):
    """Downloads an image and saves it to the specified path."""
    try:
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        filepath = os.path.join(IMAGE_DIR, filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print(f"Downloaded: {url} -> {filepath}")
        return f"/{filepath}" # Return web-accessible path
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0

    for key, itinerary in data.items():
        # 1. Download Main Image
        if 'image' in itinerary and itinerary['image'].startswith('http'):
            ext = os.path.splitext(urlparse(itinerary['image']).path)[1]
            if not ext: ext = '.jpg' # Default extension
            filename = f"{key}_main{ext}"
            local_path = download_image(itinerary['image'], filename)
            if local_path:
                itinerary['image'] = local_path
                updated_count += 1

        # 2. Download Daily Images
        if 'days' in itinerary:
            for i, day in enumerate(itinerary['days']):
                if 'images' in day:
                    new_images = []
                    for j, img_url in enumerate(day['images']):
                        if img_url.startswith('http'):
                            ext = os.path.splitext(urlparse(img_url).path)[1]
                            if not ext: ext = '.jpg'
                            filename = f"{key}_day{day['day']}_{j}{ext}"
                            local_path = download_image(img_url, filename)
                            if local_path:
                                new_images.append(local_path)
                                updated_count += 1
                            else:
                                new_images.append(img_url) # Keep original if failed
                        else:
                            new_images.append(img_url)
                    day['images'] = new_images

    # Save updated JSON
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Update complete. {updated_count} images processed.")

if __name__ == "__main__":
    main()
