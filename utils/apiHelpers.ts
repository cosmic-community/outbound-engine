interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: string
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export async function apiRequest<T>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { method = 'GET', headers = {}, body } = options

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    console.log(`Making ${method} request to: ${endpoint}`)
    
    const response = await fetch(endpoint, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`API Error (${response.status}):`, errorData)
      
      return {
        success: false,
        error: errorData.error || `Request failed with status ${response.status}`,
        details: errorData.details
      }
    }

    const data = await response.json()
    console.log(`API Success:`, data)
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('API Request Error:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function generateSequenceAPI(formData: any) {
  return apiRequest('/api/sequences/generate', {
    method: 'POST',
    body: formData
  })
}

export async function saveSequenceAPI(sequenceData: any) {
  return apiRequest('/api/sequences/save', {
    method: 'POST',
    body: sequenceData
  })
}

export function handleApiError(error: string | undefined): string {
  if (!error) return 'An unexpected error occurred'
  
  // Common error message mappings
  const errorMappings: Record<string, string> = {
    'Failed to generate email sequence': 'Unable to generate your email sequence. Please try again.',
    'Failed to create prospect': 'Unable to save prospect information. Please check your details.',
    'Failed to save email sequence': 'Unable to save your sequence. Please try again.',
    'Invalid email address format': 'Please enter a valid email address.',
    'Missing required fields': 'Please fill in all required fields.',
  }

  // Check for exact matches first
  if (errorMappings[error]) {
    return errorMappings[error]
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMappings)) {
    if (error.includes(key)) {
      return value
    }
  }

  // Return original error if no mapping found
  return error
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') || 
           error.message.includes('NetworkError')
  }
  return false
}

export function retryApiRequest<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  return new Promise(async (resolve) => {
    let attempts = 0
    
    const attemptRequest = async (): Promise<void> => {
      attempts++
      
      try {
        const result = await requestFn()
        
        if (result.success) {
          resolve(result)
          return
        }
        
        // If it's not a network error or we've exhausted retries, return the error
        if (!isNetworkError(new Error(result.error)) || attempts >= maxRetries) {
          resolve(result)
          return
        }
        
        // Wait before retrying
        setTimeout(attemptRequest, delay * attempts)
      } catch (error) {
        if (attempts >= maxRetries) {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Max retries exceeded'
          })
          return
        }
        
        // Wait before retrying
        setTimeout(attemptRequest, delay * attempts)
      }
    }
    
    attemptRequest()
  })
}