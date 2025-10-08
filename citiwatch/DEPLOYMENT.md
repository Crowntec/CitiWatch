# CitiWatch Deployment Guide

## Backend API Configuration

This project has been updated to use the hosted backend API at `http://citiwatch.runasp.net/api` instead of mock data.

## Proxy Configuration

To solve the HTTPS/HTTP mixed content issue when deploying to Vercel (HTTPS) while using an HTTP backend, the project includes:

1. **Next.js Proxy** - Configured in `next.config.ts` to proxy `/api/proxy/*` routes to the backend
2. **API Proxy Route** - `/src/app/api/proxy/[...path]/route.ts` handles all HTTP methods and forwards them to the backend

## Environment Variables

### Local Development (.env.local)
```
NEXT_PUBLIC_API_URL=http://citiwatch.runasp.net/api
ADMIN_CREATION_KEY=CitiWatch-Admin-2024
```

### Vercel Deployment

Set these environment variables in your Vercel dashboard:

1. `NEXT_PUBLIC_API_URL` = `http://citiwatch.runasp.net/api`
2. `ADMIN_CREATION_KEY` = `CitiWatch-Admin-2024`

## API Routes Removed

The following mock API routes have been removed:
- `/api/User/Login`
- `/api/User/Create` 
- `/api/User/GetAll`
- `/api/Category/GetAll`
- `/api/Complaint/GetAll`
- `/api/Complaint/GetAllUserComplaints`
- `/api/Complaint/Submit`

## API Routes Kept

- `/api/User/CreateAdmin` - Still exists but now forwards to the real backend API

## How the Proxy Works

1. **Client-side requests** go to `/api/proxy/[endpoint]`
2. **Next.js proxy** forwards them to `http://citiwatch.runasp.net/api/[endpoint]`
3. **Backend responds** through the proxy back to the client
4. **HTTPS/HTTP mixing** is avoided since the frontend only makes HTTPS calls to itself

## API Client Configuration

The `ApiClient` class in `/src/lib/api-client.ts` automatically:
- Uses the proxy (`/api/proxy`) when running on HTTPS (production)
- Uses direct backend calls when running on HTTP (development)

## Deployment Steps

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables** in Vercel dashboard
4. **Deploy**

The deployment will automatically:
- Use the proxy for all API calls
- Avoid mixed content issues
- Route all requests through HTTPS

## Testing

After deployment, test these key functions:
1. User registration
2. User login
3. Admin creation
4. Complaint submission
5. Category loading

All should now use the real backend API instead of mock data.