#!/bin/bash

# Ensure Python 3.9 is available
if ! command -v python3.9 &>/dev/null; then
    echo "Error: Python 3.9.9 is not installed or not available."
    exit 1
fi

# Create virtual environment
python3.9 -m venv venv

# Activate virtual environment
source venv/bin/activate || { echo "Error: Failed to activate virtual environment."; exit 1; }

# Install dependencies
pip install -r requirements.txt || { echo "Error: Failed to install dependencies."; exit 1; }
