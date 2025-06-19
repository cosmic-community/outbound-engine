'use client'

import { useState } from 'react'
import { UserProfile, INDUSTRY_OPTIONS, IndustryKey } from '@/types'
import { validateEmail } from '@/lib/utils'
import { User, Building, Mail, Briefcase, Globe, Phone } from 'lucide-react'

interface UserProfileFormProps {
  initialData?: Partial<UserProfile>;
  onSubmit: (data: UserProfile) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function UserProfileForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: UserProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>({
    full_name: initialData?.full_name || '',
    email_address: initialData?.email_address || '',
    company_name: initialData?.company_name || '',
    job_title: initialData?.job_title || '',
    company_bio: initialData?.company_bio || '',
    industry: initialData?.industry || 'tech',
    phone: initialData?.phone || '',
    website: initialData?.website || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof UserProfile]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email_address.trim()) {
      newErrors.email_address = 'Email address is required';
    } else if (!validateEmail(formData.email_address)) {
      newErrors.email_address = 'Please enter a valid email address';
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Your Information
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
              disabled={isSubmitting}
              required
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

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
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.email_address && (
              <p className="text-red-500 text-sm mt-1">{errors.email_address}</p>
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
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
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
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.job_title && (
              <p className="text-red-500 text-sm mt-1">{errors.job_title}</p>
            )}
          </div>
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
            disabled={isSubmitting}
            required
          >
            {Object.entries(INDUSTRY_OPTIONS).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                disabled={isSubmitting}
              />
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
                disabled={isSubmitting}
              />
            </div>
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website}</p>
            )}
          </div>
        </div>

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
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Optional: This information helps create more personalized email content.
          </p>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}