'use client'

import { useState } from 'react'
import { EmailSequenceFormData, EmailTone, EmailGoal } from '@/types'

interface SequenceFormProps {
  onSubmit: (data: EmailSequenceFormData) => void
}

export default function SequenceForm({ onSubmit }: SequenceFormProps) {
  const [formData, setFormData] = useState<EmailSequenceFormData>({
    full_name: '',
    email_address: '',
    company_name: '',
    job_title: '',
    industry: '',
    goal: 'book_demo',
    tone: 'friendly'
  })

  const [errors, setErrors] = useState<Partial<EmailSequenceFormData>>({})

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Marketing',
    'Consulting',
    'Legal',
    'Non-profit',
    'Other'
  ]

  const goals: { value: EmailGoal; label: string }[] = [
    { value: 'book_demo', label: 'Book a Demo' },
    { value: 'introduce_product', label: 'Introduce Product' },
    { value: 'close_deal', label: 'Close Deal' },
    { value: 'network', label: 'Network' },
    { value: 'follow_up', label: 'Follow Up' }
  ]

  const tones: { value: EmailTone; label: string }[] = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Professional' },
    { value: 'direct', label: 'Direct' },
    { value: 'funny', label: 'Funny' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<EmailSequenceFormData> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.email_address.trim()) {
      newErrors.email_address = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email_address)) {
      newErrors.email_address = 'Please enter a valid email address'
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required'
    }

    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required'
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof EmailSequenceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="label">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            className={`input ${errors.full_name ? 'border-red-300' : ''}`}
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            placeholder="John Smith"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email_address" className="label">
            Email Address *
          </label>
          <input
            type="email"
            id="email_address"
            className={`input ${errors.email_address ? 'border-red-300' : ''}`}
            value={formData.email_address}
            onChange={(e) => handleChange('email_address', e.target.value)}
            placeholder="john@company.com"
          />
          {errors.email_address && (
            <p className="mt-1 text-sm text-red-600">{errors.email_address}</p>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company_name" className="label">
            Company Name *
          </label>
          <input
            type="text"
            id="company_name"
            className={`input ${errors.company_name ? 'border-red-300' : ''}`}
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            placeholder="Acme Corp"
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="job_title" className="label">
            Job Title *
          </label>
          <input
            type="text"
            id="job_title"
            className={`input ${errors.job_title ? 'border-red-300' : ''}`}
            value={formData.job_title}
            onChange={(e) => handleChange('job_title', e.target.value)}
            placeholder="Sales Director"
          />
          {errors.job_title && (
            <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>
          )}
        </div>
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="label">
          Industry *
        </label>
        <select
          id="industry"
          className={`input ${errors.industry ? 'border-red-300' : ''}`}
          value={formData.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
        >
          <option value="">Select an industry</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
        )}
      </div>

      {/* Campaign Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="goal" className="label">
            Campaign Goal *
          </label>
          <select
            id="goal"
            className="input"
            value={formData.goal}
            onChange={(e) => handleChange('goal', e.target.value as EmailGoal)}
          >
            {goals.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tone" className="label">
            Email Tone *
          </label>
          <select
            id="tone"
            className="input"
            value={formData.tone}
            onChange={(e) => handleChange('tone', e.target.value as EmailTone)}
          >
            {tones.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          className="btn btn-primary w-full text-lg py-3"
        >
          Generate My Email Sequence
        </button>
      </div>
    </form>
  )
}