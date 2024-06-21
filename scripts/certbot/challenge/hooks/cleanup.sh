#!/bin/bash

CERTBOT_DOMAIN=$CERTBOT_DOMAIN
CERTBOT_VALIDATION=$CERTBOT_VALIDATION
API_TOKEN=$API_TOKEN

RECORD_ID=$(cat /tmp/vercel_dns_record_id_$CERTBOT_DOMAIN)

if [ -n "$RECORD_ID" ]; then
    curl -s -X DELETE "https://api.vercel.com/v4/domains/${CERTBOT_DOMAIN}/records/${RECORD_ID}" \
        -H "Authorization: Bearer $API_TOKEN"
    echo "Cleaned up DNS record with ID ${RECORD_ID}"

    rm /tmp/record_id_$CERTBOT_DOMAIN
else
    echo "No record ID found for cleanup"
fi
