@echo off
echo Creating .env file...
echo DANGEROUSLY_DISABLE_HOST_CHECK=true > .env
echo WDS_SOCKET_HOST=localhost >> .env
echo WDS_SOCKET_PORT=3000 >> .env
echo SKIP_PREFLIGHT_CHECK=true >> .env
echo .env file created successfully!
