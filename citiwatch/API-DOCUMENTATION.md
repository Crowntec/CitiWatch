# CitiWatch API Documentation 🚀

**Frontend Developer Reference**

This document provides detailed API specifications for integrating with the CitiWatch backend.

## 📋 Base Information

- **Base URL**: `http://localhost:5182/api` (Development)
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json` (unless specified otherwise)
- **Authorization Header**: `Authorization: Bearer <token>`

## 🔑 Role-Based Access Control

The API implements role-based authorization with the following roles:

- **User Role** (Role = 0): Standard users who can submit complaints and view their own data
- **Admin Role** (Role = 1): Administrators who can manage all data and user accounts

### Access Levels:
- **Public**: No authentication required
- **Any Authenticated User**: Requires valid JWT token (any role)
- **User Role Only**: Requires JWT token with User role
- **Admin Role Only**: Requires JWT token with Admin role

---

## 🔐 Authentication Endpoints

### 1. User Login

**POST** `/User/Login`

**Authorization**: None Required (Public Endpoint)

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Invalid credentials",
  "status": false,
  "data": null
}
```

---

### 2. User Registration

**POST** `/User/Create`

**Authorization**: None Required (Public Endpoint)

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": 0
}
```

**Field Validation**:
- `fullName`: 2-100 characters (required)
- `email`: Valid email format (required)
- `password`: 6-100 characters (required)
- `role`: 0 = User, 1 = Admin

**Success Response** (200 OK):
```json
{
  "message": "User created successfully",
  "status": true,
  "data": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "role": 0
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Email already exists",
  "status": false,
  "data": null
}
```

---

## 👥 User Management Endpoints

### 3. Get All Users

**GET** `/User/GetAll`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": 0,
      "createdOn": "2025-08-28T10:30:00Z",
      "lastModifiedOn": "2025-08-28T10:30:00Z"
    }
  ]
}
```

---

### 4. Update User

**PUT** `/User/Update/{id}`

**Authorization**: Required (JWT Token) - **Any Authenticated User**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: User GUID (required)

**Request Body**:
```json
{
  "fullName": "John Updated Doe",
  "email": "john.updated@example.com"
}
```

**Field Validation**:
- `fullName`: 2-100 characters (optional)
- `email`: Valid email format (optional)

**Success Response** (200 OK):
```json
{
  "message": "User updated successfully",
  "status": true,
  "data": {
    "fullName": "John Updated Doe",
    "email": "john.updated@example.com"
  }
}
```

---

### 4.1. Delete User

**POST** `/User/Delete/{id}`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: User GUID (required)

**Success Response** (200 OK):
```json
{
  "message": "User deleted successfully",
  "status": true,
  "data": null
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "User not found",
  "status": false,
  "data": null
}
```

---

## 📝 Complaint Endpoints

### 5. Get All Complaints

**GET** `/Complaint/GetAll`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing vehicle damage near intersection",
      "categoryName": "Road Issues",
      "statusName": "Submitted",
      "latitude": "40.7128",
      "longitude": "-74.0060",
      "mediaUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/complaints/photo.jpg",
      "createdOn": "2025-08-28T10:30:00Z",
      "lastModifiedOn": "2025-08-28T10:30:00Z"
    }
  ]
}
```

**Error Response** (200 OK - No Data):
```json
{
  "message": "No complaints found",
  "status": false,
  "data": null
}
```

---

### 5.1. Get User's Own Complaints

**GET** `/Complaint/GetAllUserComplaints`

**Authorization**: Required (JWT Token) - **User Role Only**

**Content-Type**: `application/json`

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing vehicle damage near intersection",
      "categoryName": "Road Issues",
      "statusName": "Submitted",
      "latitude": "40.7128",
      "longitude": "-74.0060",
      "mediaUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/complaints/photo.jpg",
      "createdOn": "2025-08-28T10:30:00Z",
      "lastModifiedOn": "2025-08-28T10:30:00Z"
    }
  ]
}
```

**Error Response** (200 OK - No Data):
```json
{
  "message": "No complaints found",
  "status": false,
  "data": null
}
```

---

### 6. Get Complaint by ID

**GET** `/Complaint/GetById/{id}`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: Complaint GUID (required)

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing vehicle damage near intersection",
    "categoryName": "Road Issues",
    "statusName": "Submitted",
    "latitude": "40.7128",
    "longitude": "-74.0060",
    "mediaUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/complaints/photo.jpg",
    "createdOn": "2025-08-28T10:30:00Z",
    "lastModifiedOn": "2025-08-28T10:30:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Not found!",
  "status": false,
  "data": null
}
```

---

### 7. Submit New Complaint

**POST** `/Complaint/Submit`

**Authorization**: Required (JWT Token) - **User Role Only**

**Content-Type**: `multipart/form-data`

**Form Data**:
```
title: "Pothole on Main Street"
description: "Large pothole causing vehicle damage near intersection"
categoryId: "123e4567-e89b-12d3-a456-426614174000"
latitude: "40.7128"
longitude: "-74.0060"
formFile: [File Upload - JPG/JPEG/PNG/GIF, Max 10MB]
```

**Field Validation**:
- `title`: 5-200 characters (required)
- `description`: 10-2000 characters (required)
- `categoryId`: Valid GUID (required)
- `latitude`: String (optional)
- `longitude`: String (optional)
- `formFile`: Image file (optional, max 10MB)

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": {
    "title": "Pothole on Main Street",
    "description": "Large pothole causing vehicle damage near intersection",
    "categoryId": "123e4567-e89b-12d3-a456-426614174000",
    "latitude": "40.7128",
    "longitude": "-74.0060"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "File upload error: Invalid file type",
  "status": false,
  "data": null
}
```

---

### 8. Update Complaint Status

**PUT** `/Complaint/UpdateStatus/{id}`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: Complaint GUID (required)

**Request Body**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": null
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Complaint not found",
  "status": false,
  "data": null
}
```

---

## 📂 Category Endpoints

### 9. Get All Categories

**GET** `/Category/GetAll`

**Authorization**: Required (JWT Token) - **Any Authenticated User**

**Content-Type**: `application/json`

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Road Issues",
      "createdOn": "2025-08-28T10:30:00Z",
      "lastModifiedOn": "2025-08-28T10:30:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Street Lighting",
      "createdOn": "2025-08-28T10:30:00Z",
      "lastModifiedOn": "2025-08-28T10:30:00Z"
    }
  ]
}
```

---

### 10. Create Category

**POST** `/Category/Create`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "Park Maintenance"
}
```

**Field Validation**:
- `name`: 2-100 characters (required)

**Success Response** (200 OK):
```json
{
  "message": "Category created successfully",
  "status": true,
  "data": {
    "name": "Park Maintenance"
  }
}
```

---

### 11. Update Category

**PUT** `/Category/Update/{id}`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: Category GUID (required)

**Request Body**:
```json
{
  "name": "Updated Category Name"
}
```

**Field Validation**:
- `name`: 2-100 characters (optional)

**Success Response** (200 OK):
```json
{
  "message": "Category updated successfully",
  "status": true,
  "data": {
    "name": "Updated Category Name"
  }
}
```

---

### 11.1. Delete Category

**PUT** `/Category/Delete/{id}`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: Category GUID (required)

**Success Response** (200 OK):
```json
{
  "message": "Category deleted successfully",
  "status": true,
  "data": null
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Category not found",
  "status": false,
  "data": null
}
```

---

### 11.2. Get Category by ID

**GET** `/Category/Get/{id}`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**URL Parameters**:
- `id`: Category GUID (required)

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Road Issues",
    "createdOn": "2025-08-28T10:30:00Z",
    "lastModifiedOn": "2025-08-28T10:30:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Category not found",
  "status": false,
  "data": null
}
```

---

## 📊 Status Endpoints

### 12. Get All Statuses

**GET** `/Status/GetAll`

**Authorization**: Required (JWT Token) - **Admin Role Only**

**Content-Type**: `application/json`

**Success Response** (200 OK):
```json
{
  "message": "Success",
  "status": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Submitted"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "In Progress"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "name": "Resolved"
    }
  ]
}
```

---

## 🔧 Error Handling

### Standard Error Response Format
All error responses follow this structure:

```json
{
  "message": "Error description",
  "status": false,
  "data": null
}
```

### Common HTTP Status Codes
- **200 OK**: Success
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## 🔐 Authentication Flow

1. **Login**: POST to `/User/Login` with credentials
2. **Receive Token**: Get JWT token from response
3. **Use Token**: Include in Authorization header for protected endpoints
4. **Token Format**: `Authorization: Bearer <token>`

---

## 📁 File Upload Specifications

### Supported File Types
- JPG/JPEG
- PNG
- GIF

### File Size Limits
- Maximum: 10MB per file
- Configurable via backend settings

### Upload Process
1. Use `multipart/form-data` content type
2. Include file in `formFile` field
3. Combine with other form fields
4. File is automatically uploaded to Cloudinary
5. Returns secure URL in response

---

## 🌐 Frontend Integration Examples

### JavaScript/Fetch Example

#### Login
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/User/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};
```

#### Get Complaints with Auth
```javascript
const getComplaints = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/Complaint/GetAll', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

#### Submit Complaint with File
```javascript
const submitComplaint = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/Complaint/Submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for FormData
    },
    body: formData // FormData object with file and other fields
  });
  
  return await response.json();
};
```

---

## 📝 Notes for Frontend Developers

1. **Always check `status` field** in responses to determine success/failure
2. **Handle token expiration** - implement refresh logic or redirect to login
3. **File uploads require `FormData`** - don't set Content-Type header manually
4. **Validate data client-side** using the same rules as backend validation
5. **Store JWT token securely** - consider httpOnly cookies for production
6. **Handle loading states** for better UX during API calls
7. **Implement error boundaries** to catch and display API errors gracefully
8. **Role-based access control** - Check user role before showing UI elements for restricted endpoints
9. **Users can only access their own data** - User role endpoints filter data automatically
10. **Admin role required** - Many management endpoints require admin privileges

### Role-Based UI Considerations:
- **User Role**: Show complaint submission, view own complaints, view categories
- **Admin Role**: Show user management, all complaints, category management, status management
- **Both Roles**: Can update their own profile information

---

**Happy Coding! 🚀**

*For questions or issues, please contact the backend team or check the main repository documentation.*