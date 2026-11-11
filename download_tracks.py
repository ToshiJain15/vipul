import os
import json
import urllib.request
import urllib.parse

SONGS = [
    {"id": 1, "filename": "tere_hawaale.m4a", "query": "Tere Hawaale Arijit Singh"},
    {"id": 2, "filename": "jab_koi_baat.m4a", "query": "Jab Koi Baat Bigad Jaye Kumar Sanu"},
    {"id": 3, "filename": "kesariya.m4a", "query": "Kesariya Arijit Singh"},
    {"id": 4, "filename": "neele_neele_ambar.m4a", "query": "Neele Neele Ambar Par Kishore Kumar"},
    {"id": 5, "filename": "tujh_mein_rab.m4a", "query": "Tujh Mein Rab Dikhta Hai Roop Kumar"},
    {"id": 6, "filename": "raabta.m4a", "query": "Raabta Arijit Singh"},
    {"id": 7, "filename": "titli.m4a", "query": "Titli Chennai Express"},
    {"id": 8, "filename": "bahara.m4a", "query": "Bahara I Hate Luv Storys"},
    {"id": 9, "filename": "soch_na_sake.m4a", "query": "Soch Na Sake Arijit Singh"},
    {"id": 10, "filename": "tere_sang_yaara.m4a", "query": "Tere Sang Yaara Atif Aslam"},
    {"id": 11, "filename": "raataan_lambiyan.m4a", "query": "Raataan Lambiyan Jubin Nautiyal"},
]

out_dir = os.path.join("static", "audio")
os.makedirs(out_dir, exist_ok=True)

headers = {"User-Agent": "Mozilla/5.0"}

downloaded = []

for song in SONGS:
    query = song["query"]
    target_path = os.path.join(out_dir, song["filename"])
    url = f"https://itunes.apple.com/search?term={urllib.parse.quote(query)}&media=music&limit=3&country=IN"
    
    print(f"Searching for {query}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode())
            results = data.get("results", [])
            if not results:
                # Try global search without country=IN
                url_global = f"https://itunes.apple.com/search?term={urllib.parse.quote(query)}&media=music&limit=3"
                req_g = urllib.request.Request(url_global, headers=headers)
                with urllib.request.urlopen(req_g, timeout=10) as res_g:
                    data = json.loads(res_g.read().decode())
                    results = data.get("results", [])
            
            if results:
                best = results[0]
                preview_url = best.get("previewUrl")
                track_name = best.get("trackName")
                artist = best.get("artistName")
                print(f"  -> Found: '{track_name}' by {artist}")
                print(f"  -> Downloading from {preview_url} ...")
                
                req_audio = urllib.request.Request(preview_url, headers=headers)
                with urllib.request.urlopen(req_audio, timeout=15) as ares:
                    audio_bytes = ares.read()
                    with open(target_path, "wb") as f:
                        f.write(audio_bytes)
                print(f"  ✓ Saved to {target_path} ({len(audio_bytes)} bytes)")
                downloaded.append({"id": song["id"], "file": song["filename"], "track": track_name, "artist": artist})
            else:
                print(f"  ✗ No results found for {query}")
    except Exception as e:
        print(f"  ✗ Error: {e}")

print("\n--- Summary ---")
print(f"Successfully downloaded {len(downloaded)} of {len(SONGS)} tracks.")

