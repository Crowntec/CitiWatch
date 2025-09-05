# CitiWatch 🏙️

A citizen reporting application built with .NET 9 that allows users to report civic issues and complaints with photo uploads.

## 📋 Overview

CitiWatch is a web API application designed to help citizens report municipal issues such as potholes, broken streetlights, graffiti, and other civic concerns. The application supports photo uploads via Cloudinary integration and provides a comprehensive complaint management system.

## 🚀 Features

- **User Management**: Registration, authentication, and role-based access
- **Complaint Reporting**: Submit complaints with photo evidence
- **File Upload**: Cloudinary integration for secure image storage
- **Status Tracking**: Track complaint status from submission to resolution
- **Category Management**: Organize complaints by categories
- **JWT Authentication**: Secure API endpoints with token-based authentication
- **RESTful API**: Clean and documented API endpoints

## 🛠️ Technology Stack

- **.NET 9.0**: Latest .NET framework
- **Entity Framework Core**: ORM for database operations
- **SQL Server**: Primary database
- **JWT Bearer**: Authentication and authorization
- **Cloudinary**: Cloud-based image management
- **BCrypt**: Password hashing
- **Swagger/OpenAPI**: API documentation

## 📦 Dependencies

```xml
<PackageReference Include="CloudinaryDotNet" Version="1.27.7" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.4" />
<PackageReference Include="FastGuid" Version="1.4.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.4" />
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.4" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.4" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.4" />
```

## 🏗️ Project Structure

```
CitiWatch/
├── Application/
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Helper/               # Utility classes
│   ├── Interfaces/           # Service interfaces
│   └── Services/             # Business logic services
├── Domain/
│   ├── Entities/             # Entity models
│   └── Enums/                # Enumeration types
├── Infrastructure/
│   ├── Config/               # Configuration classes
│   ├── Context/              # Database context
│   └── Services/             # Infrastructure services
├── Host/
│   └── Controllers/          # API controllers
└── Properties/
    └── launchSettings.json   # Launch configuration
```

## ⚙️ Configuration

### 1. Database Connection

Update `appsettings.json` with your SQL Server connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CitiWatchDB;Trusted_Connection=true;"
  }
}
```

### 2. JWT Settings

Configure JWT authentication:

```json
{
  "JwtSettings": {
    "Key": "your-super-secret-key-here-at-least-32-characters",
    "Issuer": "CitiWatch",
    "Audience": "CitiWatch-Users",
    "ExpiryInHours": 24
  }
}
```

### 3. Cloudinary Settings

Set up Cloudinary for image uploads:

```json
{
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret",
    "MaxFileSizeMB": 10
  }
}
```

## 🚀 Getting Started

### Prerequisites

- .NET 9.0 SDK
- SQL Server (LocalDB or Full)
- Visual Studio 2022 or VS Code
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heir04/CitiWatch.git
   cd CitiWatch
   ```

2. **Restore packages**
   ```bash
   dotnet restore
   ```

3. **Update configuration**
   - Copy `appsettings.json` to `appsettings.Development.json`
   - Update connection strings and API keys

4. **Run database migrations**
   ```bash
   dotnet ef database update
   ```

5. **Run the application**
   ```bash
   dotnet run
   ```

6. **Access the API**
   - API: `https://localhost:7xxx`
   - Swagger UI: `https://localhost:7xxx/swagger`

## 📚 API Endpoints

### Authentication
- `POST /api/User/Login` - User login
- `POST /api/User/Create` - User registration

### User Management
- `GET /api/User/GetAll` - Get all users (Admin)
- `PUT /api/User/Update/{id}` - Update user profile

### Complaints
- `GET /api/Complaint/GetAll` - Get all complaints
- `GET /api/Complaint/GetById/{id}` - Get specific complaint
- `POST /api/Complaint/Submit` - Submit new complaint (with file upload)
- `PUT /api/Complaint/UpdateStatus/{id}` - Update complaint status

### Categories
- `GET /api/Category/GetAll` - Get all categories
- `POST /api/Category/Create` - Create new category
- `PUT /api/Category/Update/{id}` - Update category

### Status
- `GET /api/Status/GetAll` - Get all statuses
- `POST /api/Status/Create` - Create new status

## 🔐 Authentication

The API uses JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Usage Examples

### Submit a Complaint

```bash
curl -X POST "https://localhost:7xxx/api/Complaint/Submit" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: multipart/form-data" \
  -F "Title=Pothole on Main Street" \
  -F "Description=Large pothole causing vehicle damage" \
  -F "CategoryId=<category-guid>" \
  -F "Latitude=40.7128" \
  -F "Longitude=-74.0060" \
  -F "formFile=@photo.jpg"
```

### User Login

```bash
curl -X POST "https://localhost:7xxx/api/User/Login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 🧪 Development

### Running Tests
```bash
dotnet test
```

### Database Migrations
```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Code Formatting
```bash
dotnet format
```

## 📁 File Upload

The application supports image uploads with the following specifications:
- **Supported formats**: JPG, JPEG, PNG, GIF
- **Maximum file size**: 10MB (configurable)
- **Storage**: Cloudinary cloud storage
- **Folder structure**: `/complaints/`

## 🔧 Environment Variables

For production deployment, consider using environment variables:

```bash
CONNECTIONSTRINGS__DEFAULTCONNECTION="your-connection-string"
JWTSETTINGS__KEY="your-jwt-key"
CLOUDINARY__CLOUDNAME="your-cloud-name"
CLOUDINARY__APIKEY="your-api-key"
CLOUDINARY__APISECRET="your-api-secret"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **heir04** - *Initial work* - [GitHub](https://github.com/heir04)

## 🙏 Acknowledgments

- .NET Team for the excellent framework
- Cloudinary for image management services
- Entity Framework team for the ORM
- Community contributors

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

