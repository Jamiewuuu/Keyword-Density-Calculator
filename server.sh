#!/bin/bash

################################################################################
# What an AI - Local Development Server Launcher
# -----------------------------------------------
# This script automatically detects and launches the best available local server.
# Simply double-click or run: ./server.sh
#
# You can also specify a port: ./server.sh 3000
################################################################################

set -e

PORT="${1:-8080}"
DIRECTORY="$(dirname "$0")"

echo "========================================"
echo "What an AI - Local Server Launcher"
echo "========================================"
echo ""
echo "Checking for available server options..."
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to start Python server
start_python_server() {
    echo "✓ Python detected, starting Python server..."
    echo ""
    cd "$DIRECTORY"
    python3 server.py "$PORT" || python server.py "$PORT"
}

# Function to start Node.js server
start_node_server() {
    echo "✓ Node.js detected, starting Node.js server..."
    echo ""
    cd "$DIRECTORY"
    node server.js "$PORT"
}

# Try Python first (recommended)
if command_exists python3 || command_exists python; then
    start_python_server

# Fallback to Node.js
elif command_exists node; then
    start_node_server

# No server runtime available
else
    echo "❌ Error: Neither Python nor Node.js found on your system."
    echo ""
    echo "Please install one of the following:"
    echo ""
    echo "Option 1 - Python (Recommended):"
    echo "  Mac: Install Xcode command line tools or Homebrew Python"
    echo "  Linux: sudo apt-get install python3"
    echo "  Windows: Download from https://python.org"
    echo ""
    echo "Option 2 - Node.js:"
    echo "  Download from https://nodejs.org"
    echo ""
    echo "Then run this script again."
    exit 1
fi
