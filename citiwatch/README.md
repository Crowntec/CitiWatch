# CitiWatch Frontend 🏙️

A modern Next.js frontend application for the CitiWatch citizen reporting system. Built with TypeScript, Tailwind CSS, and designed to work with the .NET 9 backend API.

## 📋 Overview

This is the frontend component of CitiWatch, a web application that allows citizens to report municipal issues such as potholes, broken streetlights, graffiti, and other civic concerns. The frontend provides an intuitive interface for users to submit complaints with photo evidence and track their status.

## 🚀 Features

- **Landing Page**: Attractive homepage with feature highlights
- **User Authentication**: Login and registration system
- **User Dashboard**: Personal dashboard for citizens to view their complaints
- **Complaint Submission**: Easy-to-use form for reporting issues with photo upload
- **Admin Dashboard**: Administrative interface for managing complaints, users, and categories
- **Category Management**: Admin interface for managing complaint categories
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **TypeScript**: Type-safe development with full TypeScript support

## 🛠️ Technology Stack

- **Next.js 15.5.2**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting and quality assurance
- **Turbopack**: Fast build tool for development

## 📦 Project Structure

```
src/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   └── page.tsx
│   ├── categories/               # Category management
│   │   └── page.tsx
│   ├── dashboard/                # User dashboard
│   │   ├── submit/               # Submit complaint page
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── login/                    # Login page
│   │   └── page.tsx
│   ├── register/                 # Registration page
│   │   └── page.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── .github/
│   └── copilot-instructions.md  # Copilot workspace instructions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- CitiWatch .NET backend API running

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd citiwatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`

## 📚 Available Pages

### Public Pages
- **Landing Page** (`/`): Homepage with feature overview
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration

### User Pages (Authentication Required)
- **Dashboard** (`/dashboard`): Personal complaint overview
- **Submit Complaint** (`/dashboard/submit`): Report new issues

### Admin Pages (Admin Role Required)
- **Admin Dashboard** (`/admin`): Administrative overview
- **Category Management** (`/categories`): Manage complaint categories

## 🔐 Authentication & Authorization

The application implements role-based access control:

- **Public Access**: Landing page, login, and registration
- **User Role**: Access to personal dashboard and complaint submission
- **Admin Role**: Full access to admin features and user management

JWT tokens are stored in localStorage and used for API authentication.

## 🎨 UI Components & Design

The application uses Tailwind CSS for styling with a consistent design system:

- **Color Scheme**: Indigo primary with supporting colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Responsive grid system that works on all devices
- **Forms**: Consistent form styling with validation feedback
- **Navigation**: Clear navigation with role-based menu items

## 📱 Responsive Design

The application is fully responsive and works across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔗 API Integration

The frontend is designed to integrate with the CitiWatch .NET backend:

- **Base URL**: Configurable API endpoint
- **Authentication**: JWT Bearer token system
- **File Upload**: Multipart form data for image uploads
- **Error Handling**: Comprehensive error handling and user feedback

### API Endpoints Used
- `POST /api/User/Login` - User authentication
- `POST /api/User/Create` - User registration
- `GET /api/User/GetAll` - Admin: Get all users
- `GET /api/Complaint/GetAll` - Admin: Get all complaints
- `GET /api/Complaint/GetAllUserComplaints` - User: Get own complaints
- `POST /api/Complaint/Submit` - Submit new complaint
- `GET /api/Category/GetAll` - Get categories
- `POST /api/Category/Create` - Admin: Create category
- `PUT /api/Category/Update/{id}` - Admin: Update category
- `PUT /api/Category/Delete/{id}` - Admin: Delete category

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (optional)

## 📁 File Upload

The application supports image uploads with:
- **Supported formats**: JPG, JPEG, PNG, GIF
- **Maximum file size**: 10MB
- **Client-side validation**: File type and size checking
- **Progress feedback**: Upload status indicators

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific settings:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5182/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:5182

# Other configuration options
NEXT_PUBLIC_APP_NAME=CitiWatch
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

The application can be deployed to:
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **Traditional hosting**: Any hosting service supporting Node.js

## 🤝 Contributing

1. Create a feature branch
2. Make your changes following the existing code style
3. Test thoroughly
4. Submit a pull request

## 📝 Notes

- All API calls are currently configured as TODO items and need to be updated with actual API endpoints
- The application includes mock data structures that match the backend API specification
- Location services are integrated for automatic geolocation in complaint submission
- The admin dashboard requires proper role checking implementation
- File uploads need to be connected to the actual Cloudinary service

## 🔧 Future Enhancements

- Real-time updates for complaint status
- Push notifications
- Advanced filtering and search
- Data visualization charts
- Email notifications
- Multi-language support

## 📄 License

This project is part of the CitiWatch system and follows the same license terms.

---

*Built with ❤️ using Next.js and Tailwind CSS*
