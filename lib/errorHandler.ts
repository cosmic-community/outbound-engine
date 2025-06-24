import { NextResponse } from 'next/server'

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export class ApiErrorHandler {
  static handle(error: unknown): NextResponse {
    console.error('API Error:', error)

    // Handle known API errors
    if (error instanceof ApiError) {
      return NextResponse.json(
        { 
          error: error.message, 
          code: error.code,
          details: error.details 
        },
        { status: error.status }
      )
    }

    // Handle Cosmic SDK errors
    if (this.isCosmicError(error)) {
      return this.handleCosmicError(error)
    }

    // Handle validation errors
    if (this.isValidationError(error)) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }

    // Handle network errors
    if (this.isNetworkError(error)) {
      return NextResponse.json(
        { error: 'Network error occurred', details: 'Please check your connection and try again' },
        { status: 503 }
      )
    }

    // Handle generic errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'An error occurred', details: error.message },
        { status: 500 }
      )
    }

    // Fallback for unknown errors
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }

  private static isCosmicError(error: unknown): error is { status: number; message: string } {
    return typeof error === 'object' && 
           error !== null && 
           'status' in error && 
           'message' in error
  }

  private static handleCosmicError(error: { status: number; message: string }): NextResponse {
    switch (error.status) {
      case 400:
        return NextResponse.json(
          { error: 'Invalid request', details: error.message },
          { status: 400 }
        )
      case 401:
        return NextResponse.json(
          { error: 'Authentication failed', details: 'Please check your API credentials' },
          { status: 401 }
        )
      case 403:
        return NextResponse.json(
          { error: 'Access denied', details: 'Insufficient permissions' },
          { status: 403 }
        )
      case 404:
        return NextResponse.json(
          { error: 'Resource not found', details: error.message },
          { status: 404 }
        )
      case 429:
        return NextResponse.json(
          { error: 'Rate limit exceeded', details: 'Please try again later' },
          { status: 429 }
        )
      default:
        return NextResponse.json(
          { error: 'External service error', details: error.message },
          { status: error.status }
        )
    }
  }

  private static isValidationError(error: unknown): error is Error {
    return error instanceof Error && (
      error.message.includes('validation') ||
      error.message.includes('required') ||
      error.message.includes('invalid')
    )
  }

  private static isNetworkError(error: unknown): error is Error {
    return error instanceof Error && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timeout')
    )
  }
}

export function createApiError(message: string, status: number, code?: string, details?: any): ApiError {
  return {
    message,
    status,
    code,
    details
  }
}

export function handleAsyncRoute(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return ApiErrorHandler.handle(error)
    }
  }
}

// Common error messages
export const ErrorMessages = {
  VALIDATION_FAILED: 'Validation failed',
  MISSING_FIELDS: 'Missing required fields',
  INVALID_EMAIL: 'Invalid email address format',
  GENERATION_FAILED: 'Failed to generate email sequence',
  SAVE_FAILED: 'Failed to save data',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  RATE_LIMITED: 'Rate limit exceeded',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unexpected error occurred'
} as const

// Error logging utilities
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const contextInfo = context ? ` [${context}]` : ''
  
  console.error(`${timestamp}${contextInfo}: ${errorMessage}`)
  
  if (error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack)
  }
}

export function logApiCall(method: string, endpoint: string, duration?: number): void {
  const timestamp = new Date().toISOString()
  const durationInfo = duration ? ` (${duration}ms)` : ''
  
  console.log(`${timestamp}: ${method} ${endpoint}${durationInfo}`)
}