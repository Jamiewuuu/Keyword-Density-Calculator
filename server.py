#!/usr/bin/env python3
"""
Simple HTTP Server for What an AI Website and Tools
-----------------------------------------------
Starts a local server to run the What an AI website and Keyword Density Calculator.
Usage: python server.py [port]
Port defaults to 8080 if not specified.
"""

import http.server
import socketserver
import sys
import webbrowser
import os
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    print("=" * 60)
    print("What an AI - Local Server")
    print("=" * 60)
    print(f"Starting server on port {PORT}...")
    print(f"Root directory: {DIRECTORY}")
    print("\nAccess your tools at:")
    print(f"  Main Website: http://localhost:{PORT}/")
    print(f"  Keyword Density Calculator: http://localhost:{PORT}/keyword-density.html")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            # Open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/')
            except:
                pass  # Ignore if browser can't open

            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"\n❌ Error: Port {PORT} is already in use.")
            print(f"   Try a different port: python server.py {PORT + 1}")
        else:
            print(f"\n❌ Error: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
