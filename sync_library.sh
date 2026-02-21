#!/bin/bash
# Path inside the container for OpenResty
TARGET_DIR="/usr/local/openresty/nginx/html/books/"
MAC_IP="100.65.138.126"

echo "Checking connection to Mac..."
if ping -c 1 $MAC_IP &> /dev/null
then
    echo "Syncing books to Volume..."
    # -r: recursive, -np: no-parent, -nd: no-directories, -N: timestamping, -A: filters
    wget -r -np -nd -N -A "pdf,json" -P $TARGET_DIR http://$MAC_IP:8080/
    echo "Sync Complete."
else
    echo "Cannot reach Mac at $MAC_IP"
fi
