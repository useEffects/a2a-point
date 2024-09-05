#!/bin/bash

# Navigate to the extensions directory
cd extensions || { echo "Directory 'extensions' not found."; exit 1; }

# Loop through all direct children in the extensions directory
for dir in */; do
  if [ -d "$dir" ]; then
    echo "Installing node_modules in $dir"
    cd "$dir" || { echo "Failed to enter directory $dir"; exit 1; }
    npm install
    cd ..
  fi
done
