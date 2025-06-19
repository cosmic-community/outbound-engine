export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateApiKey(apiKey: string): boolean {
  // Basic OpenAI API key validation
  return apiKey.startsWith('sk-') && apiKey.length >= 20;
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - accepts various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

// Form validation schema
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  custom?: (value: string) => boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateForm(data: Record<string, string>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field] || '';

    if (rules.required && !validateRequired(value)) {
      errors[field] = `${field.replace('_', ' ')} is required`;
      continue;
    }

    if (rules.minLength && !validateMinLength(value, rules.minLength)) {
      errors[field] = `${field.replace('_', ' ')} must be at least ${rules.minLength} characters`;
      continue;
    }

    if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
      errors[field] = `${field.replace('_', ' ')} must be less than ${rules.maxLength} characters`;
      continue;
    }

    if (rules.email && value && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
      continue;
    }

    if (rules.url && value && !validateUrl(value)) {
      errors[field] = 'Please enter a valid URL';
      continue;
    }

    if (rules.phone && value && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number';
      continue;
    }

    if (rules.custom && value && !rules.custom(value)) {
      errors[field] = `Invalid ${field.replace('_', ' ')}`;
      continue;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Common validation schemas
export const USER_PROFILE_SCHEMA: ValidationSchema = {
  full_name: { required: true, minLength: 2, maxLength: 100 },
  email_address: { required: true, email: true },
  company_name: { required: true, minLength: 2, maxLength: 100 },
  job_title: { required: true, minLength: 2, maxLength: 100 },
  website: { url: true },
  phone: { phone: true },
  company_bio: { maxLength: 1000 }
};

export const PROSPECT_SCHEMA: ValidationSchema = {
  full_name: { required: true, minLength: 2, maxLength: 100 },
  email_address: { required: true, email: true },
  company_name: { required: true, minLength: 2, maxLength: 100 },
  job_title: { required: true, minLength: 2, maxLength: 100 },
  linkedin_url: { url: true },
  notes: { maxLength: 500 }
};

export const API_KEY_SCHEMA: ValidationSchema = {
  apiKey: { 
    required: true, 
    custom: validateApiKey 
  }
};