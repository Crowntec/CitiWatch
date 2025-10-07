# Frontend Deployment Configuration

## Backend Integration Setup

The frontend is now configured to use the hosted backend at: `http://citiwatch.runasp.net/api`

## Environment Configuration

### Local Development
- **File**: `.env.local`
- **API URL**: `http://citiwatch.runasp.net/api`
- To use local backend instead, change to: `http://localhost:5182/api`

### Production (Vercel)
- **File**: `.env.production`
- **API URL**: `http://citiwatch.runasp.net/api`

## Vercel Deployment Steps

### 1. Environment Variables Setup
In your Vercel dashboard, add the following environment variable:
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `http://citiwatch.runasp.net/api`
- **Environment**: Production, Preview, Development

### 2. Automatic Deployment
Once connected to your GitHub repository, Vercel will:
- Automatically deploy on every push to `main` branch
- Use the environment variables configured in the dashboard
- Build using the `npm run build` command

### 3. Manual Deployment (Alternative)
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy from the citiwatch directory
cd citiwatch
vercel --prod
```

## Backend CORS Configuration Required

Your ASP.NET backend at `http://citiwatch.runasp.net` needs to allow CORS for your Vercel domain.

Add this to your `Program.cs` in the backend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.WithOrigins(
            "https://your-vercel-app.vercel.app", // Replace with your actual Vercel URL
            "http://localhost:3000" // For local development
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// After building the app
app.UseCors("AllowVercel");
```

## Testing the Integration

1. **Local Testing**: Run `npm run dev` and verify API calls work
2. **Production Testing**: Deploy to Vercel and test all functionality
3. **API Endpoints**: Verify all services (User, Complaint, Category, Status) work correctly

## File Structure
```
citiwatch/
├── .env.local          # Local development configuration
├── .env.production     # Production configuration  
├── .env.example        # Template for environment variables
└── src/lib/api-client.ts # API client (automatically uses env vars)
```

## Notes
- The API client automatically uses `process.env.NEXT_PUBLIC_API_URL`
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- `.env.local` is ignored by git (for security)
- `.env.production` is used by Next.js in production builds