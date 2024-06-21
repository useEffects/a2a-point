#!/bin/bash

CERTBOT_DOMAIN=$CERTBOT_DOMAIN
CERTBOT_VALIDATION=$CERTBOT_VALIDATION
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
API_TOKEN=$API_TOKEN

RESPONSE=$(curl -s -X POST "https://api.vercel.com/v4/domains/${CERTBOT_DOMAIN}/records" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "name": "_acme-challenge",
        "type": "TXT",
        "value": "'"$CERTBOT_VALIDATION"'"
    }')

RECORD_ID=$(echo $RESPONSE | jq -r .id)

if [ -z "$RECORD_ID" ]; then
    echo "Failed to create DNS record"
    exit 1
fi

echo "Created DNS record with ID ${RECORD_ID}"

echo $RECORD_ID > /tmp/vercel_dns_record_id_$CERTBOT_DOMAIN

sleep 30
