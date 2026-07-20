#!/usr/bin/env python3
"""Static file server that dynamically regenerates the gallery index on every request."""

import json
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

# Change to the directory containing this script so paths work regardless of CWD
os.chdir(Path(__file__).resolve().parent)

GALLERY_DIR = Path('assets/gallery')
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp'}


def build_gallery_index():
    if not GALLERY_DIR.exists():
        return {'images': []}
    images = sorted(
        p.name for p in GALLERY_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )
    return {'images': images}


class LabHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/assets/data/gallery-index.json':
            self.send_gallery_index()
            return
        super().do_GET()

    def send_gallery_index(self):
        body = json.dumps(build_gallery_index(), ensure_ascii=False, indent=2).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = HTTPServer(('0.0.0.0', port), LabHTTPRequestHandler)
    print(f'Serving lab-website at http://localhost:{port}')
    print('Gallery index is rebuilt automatically on each page load.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down server.')
        server.shutdown()
