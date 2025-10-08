# CitiWatch Frontend Deployment Guide

## Overview
This guide describes how to deploy the CitiWatch frontend to Vercel while connecting to your hosted backend API at `http://citiwatch.runasp.net`.

## Architecture
- **Frontend**: Next.js application hosted on Vercel (HTTPS)
- **Backend**: ASP.NET API hosted at `http://citiwatch.runasp.net` (HTTP)
- **Proxy**: Next.js API routes act as a proxy to avoid mixed content issues

## Environment Configuration

### Development
The project uses your hosted backend directly:
```
NEXT_PUBLIC_API_URL=http://citiwatch.runasp.net/api
```

### Production (Vercel)
The project uses a proxy to avoid mixed content issues:
```
NEXT_PUBLIC_API_URL=/api/proxy
```

## Deployment Steps

### 1. Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import your CitiWatch repository

### 2. Configure Environment Variables
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `/api/proxy`
   - **Environment**: Production

### 3. Deploy
1. Vercel will automatically deploy when you push to your main branch
2. The build process will use the proxy configuration
3. All API calls will be routed through `/api/proxy/*` to your backend

## How the Proxy Works

### Problem
- Frontend: HTTPS (Vercel)
- Backend: HTTP (your server)
- Browsers block mixed content (HTTPS → HTTP requests)

### Solution
The proxy route at `/api/proxy/[...path]/route.ts`:
1. Receives HTTPS requests from the frontend
2. Makes HTTP requests to your backend server
3. Returns responses back to the frontend
4. All communication appears as HTTPS to the browser

### Example API Flow
```
Frontend Request: https://your-app.vercel.app/api/proxy/User/Login
↓
Proxy Route: /api/proxy/[...path]/route.ts
↓
Backend Request: http://citiwatch.runasp.net/api/User/Login
↓
Response flows back through the proxy
```

## File Changes Made

### Configuration Files
- **`.env.local`**: Development environment (direct backend connection)
- **`.env.production`**: Production environment (proxy connection)
- **`vercel.json`**: Vercel deployment configuration
- **`next.config.ts`**: Updated with proxy rewrites

### API Integration
- **`src/lib/api-client.ts`**: Updated to use environment-specific API URLs
- **`src/app/api/proxy/[...path]/route.ts`**: New proxy route for production

### Removed Mock Data
- Deleted `/src/app/api/User/` directory
- Deleted `/src/app/api/Complaint/` directory  
- Deleted `/src/app/api/Category/` directory
- Updated mock implementations in admin pages

## Testing

### Development
```bash
npm run dev
```
Tests direct connection to `http://citiwatch.runasp.net/api`

### Production Build
```bash
npm run build
npm start
```
Tests proxy functionality locally

## Troubleshooting

### CORS Issues
The proxy automatically handles CORS headers. If you encounter issues:
1. Check that your backend accepts requests from any origin
2. Verify the proxy route is working: `/api/proxy/User/Login`

### API Connection Issues
1. Verify your backend is accessible at `http://citiwatch.runasp.net/api`
2. Check browser network tab for failed requests
3. Look at Vercel function logs for proxy errors

### Build Issues
1. Ensure all TypeScript errors are resolved
2. Check that all imports are correct after removing mock files
3. Verify environment variables are set correctly

## Next Steps

1. **Security**: Consider implementing rate limiting on the proxy
2. **Monitoring**: Set up logging for API requests and errors
3. **Caching**: Add appropriate cache headers for static API responses
4. **HTTPS Backend**: Consider upgrading your backend to HTTPS in the future

## Support

For deployment issues:
- Check Vercel dashboard logs
- Review browser console for client-side errors
- Monitor your backend server logs for API issues