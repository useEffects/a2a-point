#!/bin/bash

DOMAIN="example.com"
VERCEL_PROJECT_ID="your-vercel-project-id"
API_TOKEN=$VERCEL_API_TOKEN

if [ -z "$API_TOKEN" ]; then
    echo "VERCEL_API_TOKEN environment variable is not set"
    exit 1
fi

export VERCEL_PROJECT_ID
export API_TOKEN

certbot certonly --manual --preferred-challenges=dns \
    --manual-auth-hook ./auth-hook.sh \
    --manual-cleanup-hook ./cleanup-hook.sh \
    -d $DOMAIN
