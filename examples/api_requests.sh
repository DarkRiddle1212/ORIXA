#!/bin/bash

# ==============================================================================
# Orixa OS v1 API Integration Command-Line Reference
# ==============================================================================

# Configure target API URL
API_URL="http://localhost:8000"

echo "=== 1. Core Load-Balancer Health Heartbeat ==="
curl -X GET "${API_URL}/health" \
  -H "Accept: application/json" \
  -H "X-Correlation-ID: shell-health-check-$(date +%s)"
echo -e "\n"

echo "=== 2. Identity Provider Token Exchange ==="
JWT_RESPONSE=$(curl -X POST "${API_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "operator@acme-aero.com",
    "password": "supersecretpassword123"
  }')
echo "${JWT_RESPONSE}"
echo -e "\n"

# Extract bearer token
BEARER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_orixa_enterprise"

echo "=== 3. Retrieve Sandboxed Organizations ==="
curl -X GET "${API_URL}/api/v1/organizations" \
  -H "Authorization: Bearer ${BEARER_TOKEN}" \
  -H "Accept: application/json"
echo -e "\n"

echo "=== 4. List Operational Analysis Projects ==="
curl -X GET "${API_URL}/api/v1/projects" \
  -H "Authorization: Bearer ${BEARER_TOKEN}" \
  -H "Accept: application/json"
echo -e "\n"
