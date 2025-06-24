import { EmailSequenceFormData, EmailTone, EmailGoal } from '@/types'

export interface ValidationResult {
  isValid: boolean
  errors: Partial<Record<keyof EmailSequenceFormData, string>>
}

export function validateEmailSequenceForm(data: EmailSequenceFormData): ValidationResult {
  const errors: Partial<Record<keyof EmailSequenceFormData, string>> = {}

  // Validate full name
  if (!data.full_name || data.full_name.trim().length === 0) {
    errors.full_name = 'Full name is required'
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters'
  } else if (data.full_name.trim().length > 100) {
    errors.full_name = 'Full name must be less than 100 characters'
  }

  // Validate email address
  if (!data.email_address || data.email_address.trim().length === 0) {
    errors.email_address = 'Email address is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email_address.trim())) {
      errors.email_address = 'Please enter a valid email address'
    }
  }

  // Validate company name
  if (!data.company_name || data.company_name.trim().length === 0) {
    errors.company_name = 'Company name is required'
  } else if (data.company_name.trim().length < 2) {
    errors.company_name = 'Company name must be at least 2 characters'
  } else if (data.company_name.trim().length > 100) {
    errors.company_name = 'Company name must be less than 100 characters'
  }

  // Validate job title
  if (!data.job_title || data.job_title.trim().length === 0) {
    errors.job_title = 'Job title is required'
  } else if (data.job_title.trim().length < 2) {
    errors.job_title = 'Job title must be at least 2 characters'
  } else if (data.job_title.trim().length > 100) {
    errors.job_title = 'Job title must be less than 100 characters'
  }

  // Validate industry
  if (!data.industry || data.industry.trim().length === 0) {
    errors.industry = 'Industry is required'
  }

  // Validate tone
  const validTones: EmailTone[] = ['friendly', 'direct', 'formal', 'funny']
  if (!validTones.includes(data.tone)) {
    errors.tone = 'Please select a valid tone'
  }

  // Validate goal
  const validGoals: EmailGoal[] = ['book_demo', 'introduce_product', 'close_deal', 'network', 'follow_up']
  if (!validGoals.includes(data.goal)) {
    errors.goal = 'Please select a valid goal'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function sanitizeFormData(data: EmailSequenceFormData): EmailSequenceFormData {
  return {
    full_name: data.full_name.trim(),
    email_address: data.email_address.trim().toLowerCase(),
    company_name: data.company_name.trim(),
    job_title: data.job_title.trim(),
    industry: data.industry.trim(),
    tone: data.tone,
    goal: data.goal
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`
  }
  return null
}

export function validateLength(value: string, fieldName: string, min: number, max: number): string | null {
  const trimmedValue = value.trim()
  if (trimmedValue.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  if (trimmedValue.length > max) {
    return `${fieldName} must be less than ${max} characters`
  }
  return null
}