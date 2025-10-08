/**
 * Frontend Validation Utility
 * Matches backend validation rules exactly as per API guidelines
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationHelper {
  
  /**
   * Validate user registration data
   */
  static validateUserRegistration(data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): ValidationResult {
    const errors: string[] = [];

    // Full Name validation
    if (!data.fullName || !data.fullName.trim()) {
      errors.push('Full name is required');
    } else if (data.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    } else if (data.fullName.trim().length > 100) {
      errors.push('Full name cannot exceed 100 characters');
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.fullName.trim())) {
      errors.push('Full name can only contain letters, spaces, hyphens, and apostrophes');
    }

    // Email validation
    if (!data.email || !data.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    } else if (data.email.length > 254) {
      errors.push('Email cannot exceed 254 characters');
    }

    // Password validation
    if (!data.password) {
      errors.push('Password is required');
    } else {
      const passwordErrors = this.validatePassword(data.password);
      errors.push(...passwordErrors);
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      errors.push('Password confirmation is required');
    } else if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user update data
   */
  static validateUserUpdate(data: {
    fullName: string;
    email: string;
  }): ValidationResult {
    const errors: string[] = [];

    // Full Name validation
    if (!data.fullName || !data.fullName.trim()) {
      errors.push('Full name is required');
    } else if (data.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    } else if (data.fullName.trim().length > 100) {
      errors.push('Full name cannot exceed 100 characters');
    }

    // Email validation
    if (!data.email || !data.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate complaint submission data
   */
  static validateComplaint(data: {
    title: string;
    description: string;
    categoryId: string;
    location?: string;
  }): ValidationResult {
    const errors: string[] = [];

    // Title validation
    if (!data.title || !data.title.trim()) {
      errors.push('Title is required');
    } else if (data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    } else if (data.title.trim().length > 200) {
      errors.push('Title cannot exceed 200 characters');
    }

    // Description validation
    if (!data.description || !data.description.trim()) {
      errors.push('Description is required');
    } else if (data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    } else if (data.description.trim().length > 2000) {
      errors.push('Description cannot exceed 2000 characters');
    }

    // Category validation
    if (!data.categoryId || !data.categoryId.trim()) {
      errors.push('Category is required');
    } else if (!this.isValidGuid(data.categoryId)) {
      errors.push('Invalid category selected');
    }

    // Location validation (optional)
    if (data.location && data.location.trim().length > 500) {
      errors.push('Location cannot exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate category data
   */
  static validateCategory(data: {
    name: string;
    description: string;
  }): ValidationResult {
    const errors: string[] = [];

    // Name validation
    if (!data.name || !data.name.trim()) {
      errors.push('Category name is required');
    } else if (data.name.trim().length < 2) {
      errors.push('Category name must be at least 2 characters long');
    } else if (data.name.trim().length > 100) {
      errors.push('Category name cannot exceed 100 characters');
    }

    // Description validation
    if (!data.description || !data.description.trim()) {
      errors.push('Category description is required');
    } else if (data.description.trim().length < 10) {
      errors.push('Category description must be at least 10 characters long');
    } else if (data.description.trim().length > 500) {
      errors.push('Category description cannot exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate status data
   */
  static validateStatus(data: {
    name: string;
    description: string;
  }): ValidationResult {
    const errors: string[] = [];

    // Name validation
    if (!data.name || !data.name.trim()) {
      errors.push('Status name is required');
    } else if (data.name.trim().length < 2) {
      errors.push('Status name must be at least 2 characters long');
    } else if (data.name.trim().length > 50) {
      errors.push('Status name cannot exceed 50 characters');
    }

    // Description validation
    if (!data.description || !data.description.trim()) {
      errors.push('Status description is required');
    } else if (data.description.trim().length < 10) {
      errors.push('Status description must be at least 10 characters long');
    } else if (data.description.trim().length > 300) {
      errors.push('Status description cannot exceed 300 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate login data
   */
  static validateLogin(data: {
    email: string;
    password: string;
  }): ValidationResult {
    const errors: string[] = [];

    // Email validation
    if (!data.email || !data.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!data.password) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File): ValidationResult {
    const errors: string[] = [];

    // File type validation
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png', 
      'image/gif',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Please select a valid image file (JPEG, JPG, PNG, GIF, WebP)');
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB');
    }

    // File name validation
    if (file.name.length > 255) {
      errors.push('File name is too long (max 255 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password strength
   */
  private static validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 100) {
      errors.push('Password cannot exceed 100 characters');
    }

    // Optional: Add more password strength requirements
    // if (!/(?=.*[a-z])/.test(password)) {
    //   errors.push('Password must contain at least one lowercase letter');
    // }

    // if (!/(?=.*[A-Z])/.test(password)) {
    //   errors.push('Password must contain at least one uppercase letter');
    // }

    // if (!/(?=.*\d)/.test(password)) {
    //   errors.push('Password must contain at least one number');
    // }

    return errors;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  /**
   * Validate GUID format
   */
  private static isValidGuid(guid: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[<>]/g, ''); // Remove potential HTML tags
  }

  /**
   * Format error messages for display
   */
  static formatErrors(errors: string[]): string {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0];
    
    return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
  }

  /**
   * Check if string contains only allowed characters for names
   */
  static isValidName(name: string): boolean {
    return /^[a-zA-Z\s'-]+$/.test(name);
  }

  /**
   * Validate phone number (optional field)
   */
  static validatePhoneNumber(phone: string): boolean {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}