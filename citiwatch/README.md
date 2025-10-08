# CitiWatch - Citizen Complaint Management System

A Next.js application for managing citizen complaints with real-time tracking and administrative oversight.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd citiwatch

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 🏗️ Architecture

### Backend Integration
- **API Backend**: `http://citiwatch.runasp.net/api`
- **Proxy Setup**: Configured to handle HTTPS/HTTP mixed content issues
- **No Mock Data**: All mock API routes have been removed

### API Proxy
The application uses a proxy system to avoid CORS and mixed content issues:
- Development: Direct API calls to `http://citiwatch.runasp.net/api`
- Production: Proxy calls through `/api/proxy/*` routes

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (proxy only)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── ...
├── components/            # Reusable React components
├── services/              # API service classes
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── lib/                   # Shared libraries
```

## 🔧 Environment Variables

### Required Variables
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://citiwatch.runasp.net/api

# Admin creation key
ADMIN_CREATION_KEY=CitiWatch-Admin-2024
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to GitHub**: Link your repository to Vercel
2. **Environment Variables**: Set the required variables in Vercel dashboard
3. **Deploy**: Automatic deployment on push to main branch

The proxy configuration automatically handles:
- HTTPS/HTTP mixed content issues
- CORS policy compliance
- Seamless backend integration

### Environment Variables for Production
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: `http://citiwatch.runasp.net/api`
- `ADMIN_CREATION_KEY`: `CitiWatch-Admin-2024`

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Authentication

The application supports:
- User registration and login
- Admin user creation (with admin key)
- JWT token-based authentication
- Secure token storage

## 📱 Features

- **Complaint Management**: Submit, track, and manage citizen complaints
- **Admin Dashboard**: Administrative oversight and complaint resolution
- **Category System**: Organize complaints by type
- **Location Tracking**: GPS coordinates for complaint locations
- **Status Updates**: Real-time complaint status tracking
- **User Management**: Admin user administration

## 🌐 API Integration

All API calls are routed through the backend at `citiwatch.runasp.net`:
- User authentication
- Complaint CRUD operations
- Category management
- Admin functions

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions, please contact the development team.