#!/bin/bash
echo "Creating .env file..."
cat > .env << EOF
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3000
SKIP_PREFLIGHT_CHECK=true
EOF
echo ".env file created successfully!"
