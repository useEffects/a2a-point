#!/bin/bash

APPS_DIR="../../apps"
RELEASES_DIR="../releases/tarballs"

mkdir -p "$RELEASES_DIR"

for app_dir in "$APPS_DIR"/*; do
    if [ -d "$app_dir" ]; then
        app_name=$(basename "$app_dir")
        app_name="a2apoint-$app_name"
        tarball="$RELEASES_DIR/$app_name.tar.gz"
        docker build -t "$app_name" "$app_dir"
        docker save -o "$tarball" "$app_name"
        echo "Docker image for $app_name saved to $tarball"
    fi
done
