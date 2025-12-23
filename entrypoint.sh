#!/bin/sh
set -e

# If VAULT_ADDR and VAULT_TOKEN are set, try to fetch secrets
if [ -n "$VAULT_ADDR" ] && [ -n "$VAULT_TOKEN" ] && [ -n "$VAULT_SECRET_PATH" ]; then
    echo "Fetching secrets from Vault: $VAULT_ADDR (Path: $VAULT_SECRET_PATH)"
    
    RESPONSE=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$VAULT_SECRET_PATH")
    
    # Check if curl was successful and response is not empty
    if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
        # Check if the response contains data (KV v2 format usually has data.data)
        DATA=$(echo "$RESPONSE" | jq -r '.data.data // .data')
        
        if [ "$DATA" != "null" ]; then
            echo "Successfully fetched secrets from Vault."
            
            # Export each key-value pair as an environment variable
            # We use jq to format them for exporting
            eval "$(echo "$DATA" | jq -r 'to_entries | .[] | "export \(.key | gsub("\\."; "_"))=\"\(.value)\""')"
            
            # Specifically ensure api.key is available as API_KEY if it exists
            API_KEY_VAL=$(echo "$DATA" | jq -r '."api.key" // .api_key // empty')
            if [ -n "$API_KEY_VAL" ]; then
                export API_KEY="$API_KEY_VAL"
                echo "Exported API_KEY from Vault secret."
            fi
        else
            echo "Warning: Vault response did not contain data. Check your secret path and permissions."
            echo "Response: $RESPONSE"
        fi
    else
        echo "Error: Failed to fetch secrets from Vault. Check connectivity and credentials."
    fi
fi

# Set default BACKEND_URL if not provided
export BACKEND_URL="${BACKEND_URL:-http://host.docker.internal:8080}"
echo "Using BACKEND_URL: $BACKEND_URL"

# Execute the CMD from Dockerfile
exec "$@"
