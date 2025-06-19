'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserProfile, INDUSTRY_OPTIONS, IndustryKey } from '@/types'
import { validateEmail } from '@/lib/utils'
import { User, Building, Mail, Briefcase, Globe, Phone, FileText } from 'lucide-react'

export default function CompanyProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  // In a real app, this would come from the database/auth
  const [formData, setFormData] = useState({
    full_name: 'Your Name',
    email_address: 'your.email@company.com',
    company_name: 'Your Company',
    job_title: 'Your Title',
    phone: '+1 (555) 123-4567',
    website: 'https://yourcompany.com',
    industry: 'tech' as IndustryKey,
    company_bio: 'We help businesses optimize their outreach and improve their sales processes with AI-powered solutions.',
    email_signature: `Best regards,\nYour Name\nYour Title\nYour Company\nyour.email@company.com\n+1 (555) 123-4567`,
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    use_gmail_api: false,
    gmail_client_id: '',
    gmail_client_secret: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.email_address.trim()) {
      newErrors.email_address = 'Email address is required'
    } else if (!validateEmail(formData.email_address)) {
      newErrors.email_address = 'Please enter a valid email address'
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required'
    }

    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required'
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // In a real app, this would save to your database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      router.push('/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className={`input ${errors.full_name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="John Doe"
              disabled={isLoading}
              required
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="job_title" className="block text-sm font-medium mb-2">
              Job Title *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                className={`input pl-10 ${errors.job_title ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Sales Director"
                disabled={isLoading}
                required
              />
            </div>
            {errors.job_title && (
              <p className="text-red-500 text-sm mt-1">{errors.job_title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className={`input pl-10 ${errors.company_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Acme Corporation"
                disabled={isLoading}
                required
              />
            </div>
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium mb-2">
              Industry *
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="select"
              disabled={isLoading}
              required
            >
              {Object.entries(INDUSTRY_OPTIONS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Mail className="w-5 h-5 mr-2 text-primary" />
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email_address" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                id="email_address"
                name="email_address"
                value={formData.email_address}
                onChange={handleInputChange}
                className={`input pl-10 ${errors.email_address ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="john@example.com"
                disabled={isLoading}
                required
              />
            </div>
            {errors.email_address && (
              <p className="text-red-500 text-sm mt-1">{errors.email_address}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input pl-10"
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-2">
            Company Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={`input pl-10 ${errors.website ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="https://www.example.com"
              disabled={isLoading}
            />
          </div>
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Company Bio */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          Company Information
        </h3>

        <div>
          <label htmlFor="company_bio" className="block text-sm font-medium mb-2">
            Company Bio
          </label>
          <textarea
            id="company_bio"
            name="company_bio"
            value={formData.company_bio}
            onChange={handleInputChange}
            rows={4}
            className="textarea"
            placeholder="Brief description of your company and what you do. This will help AI create more relevant emails."
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This information helps create more personalized email content.
          </p>
        </div>

        <div>
          <label htmlFor="email_signature" className="block text-sm font-medium mb-2">
            Email Signature
          </label>
          <textarea
            id="email_signature"
            name="email_signature"
            value={formData.email_signature}
            onChange={handleInputChange}
            rows={6}
            className="textarea"
            placeholder="Best regards,&#10;Your Name&#10;Your Title&#10;Your Company"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This signature will be automatically added to your outbound emails.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}