// API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdOn: string;
    lastModifiedOn: string;
  };
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdOn: string;
  lastModifiedOn: string;
}

export interface ApiResponse<T> {
  isSuccessful: boolean;
  message: string;
  data: T;
}