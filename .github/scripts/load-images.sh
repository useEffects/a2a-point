#!/bin/bash

RELEASES_DIR="../releases/tarballs"

for tarball in "$RELEASES_DIR"/*.tar.gz; do
    docker load -i "$tarball"
done
