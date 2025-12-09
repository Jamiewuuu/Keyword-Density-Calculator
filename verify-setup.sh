#!/bin/bash

################################################################################
# What an AI - Setup Verification Script
# ---------------------------------------
# This script checks if your system is ready to run the tools locally.
################################################################################

echo "=========================================="
echo "What an AI - Setup Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python 3 found: $PYTHON_VERSION"
    PYTHON_AVAILABLE=true
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_AVAILABLE=true
else
    print_error "Python not found"
    PYTHON_AVAILABLE=false
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
    NODE_AVAILABLE=true
else
    print_error "Node.js not found"
    NODE_AVAILABLE=false
fi

# Check files
echo ""
echo "Checking files..."
echo ""

if [ -f "index.html" ]; then
    print_success "index.html exists"
else
    print_error "index.html not found"
fi

if [ -f "keyword-density.html" ]; then
    print_success "keyword-density.html exists"
else
    print_error "keyword-density.html not found"
fi

if [ -f "data.json" ]; then
    print_success "data.json exists"
else
    print_error "data.json not found"
fi

if [ -f "server.py" ]; then
    print_success "server.py exists"
else
    print_error "server.py not found"
fi

if [ -f "server.sh" ]; then
    print_success "server.sh exists"
else
    print_error "server.sh not found"
fi

# Summary
echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""

if [ "$PYTHON_AVAILABLE" = true ] || [ "$NODE_AVAILABLE" = true ]; then
    print_success "Your system is ready!"
    echo ""
    echo "You can start the server with:"
    echo ""
    if [ "$PYTHON_AVAILABLE" = true ]; then
        echo "  ./server.sh"
        echo "  or: python3 server.py"
    elif [ "$NODE_AVAILABLE" = true ]; then
        echo "  node server.js"
    fi
    echo ""
    echo "Or just open keyword-density.html directly!"
else
    print_error "No server runtime found"
    echo ""
    echo "Please install Python 3 or Node.js:"
    echo "  - Python: https://python.org"
    echo "  - Node.js: https://nodejs.org"
fi

echo ""
echo "For detailed instructions, see:"
echo "  - START-HERE.md (quick start)"
echo "  - RUN-LOCAL.md (detailed guide)"
echo ""
