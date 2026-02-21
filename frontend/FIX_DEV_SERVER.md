# Fix for React Dev Server Error

If you encounter the `allowedHosts[0]` error, follow these steps:

## Solution 1: Create .env file (Recommended)

Create a `.env` file in the `frontend` directory with:

```
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3000
SKIP_PREFLIGHT_CHECK=true
```

## Solution 2: Update package.json script (Windows)

Change the start script in `package.json` to:

```json
"start": "set DANGEROUSLY_DISABLE_HOST_CHECK=true && react-scripts start"
```

## Solution 3: Update package.json script (Mac/Linux)

Change the start script in `package.json` to:

```json
"start": "DANGEROUSLY_DISABLE_HOST_CHECK=true react-scripts start"
```

## After making changes:

1. Stop the dev server (Ctrl+C)
2. Delete `node_modules` and `package-lock.json` (optional)
3. Run `npm install` again
4. Run `npm start`

The error should be resolved!
