'use client'

import { useState } from 'react'
import { validateApiKey } from '@/lib/utils'
import { Key, Eye, EyeOff, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

interface ApiKeyFormProps {
  initialApiKey?: string;
  onSubmit: (apiKey: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function ApiKeyForm({ 
  initialApiKey = '', 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    setError(null);
    
    if (value.trim()) {
      const valid = validateApiKey(value);
      setIsValid(valid);
      if (!valid && value.length > 10) {
        setError('API key should start with "sk-" and be at least 20 characters long');
      }
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('OpenAI API key is required');
      return;
    }
    
    if (!validateApiKey(apiKey)) {
      setError('Please enter a valid OpenAI API key');
      return;
    }
    
    onSubmit(apiKey.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">OpenAI API Key</h3>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">Why do we need your API key?</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Your API key is used to generate personalized email sequences</li>
                <li>• It's sent securely to OpenAI and never stored on our servers</li>
                <li>• You maintain full control and ownership of your API usage</li>
              </ul>
              <p className="mt-2">
                Don't have an API key? 
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-1 font-medium underline hover:no-underline"
                >
                  Get one here
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
            API Key *
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              id="apiKey"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="sk-..."
              className={`input pr-20 font-mono text-sm ${
                error ? 'border-red-500 focus:ring-red-500' : 
                isValid ? 'border-green-500 focus:ring-green-500' : ''
              }`}
              disabled={isSubmitting}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {isValid && (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              )}
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          {isValid && (
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Valid API key format
            </p>
          )}
        </div>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Security & Privacy</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✅ Your API key is transmitted securely via HTTPS</li>
            <li>✅ Never stored in our database or logs</li>
            <li>✅ Only used for your current session</li>
            <li>✅ You can revoke access anytime from OpenAI's dashboard</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary ml-auto"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Validating...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}