'use client'

import { useState } from 'react'
import { ProspectData, INDUSTRY_OPTIONS, IndustryKey } from '@/types'
import { validateEmail } from '@/lib/utils'
import { Target, Building, Mail, Briefcase, ExternalLink, FileText } from 'lucide-react'

interface ProspectFormProps {
  initialData?: Partial<ProspectData>;
  onSubmit: (data: ProspectData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function ProspectForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: ProspectFormProps) {
  const [formData, setFormData] = useState<ProspectData>({
    full_name: initialData?.full_name || '',
    email_address: initialData?.email_address || '',
    company_name: initialData?.company_name || '',
    job_title: initialData?.job_title || '',
    industry: initialData?.industry || 'tech',
    linkedin_url: initialData?.linkedin_url || '',
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProspectData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ProspectData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProspectData, string>> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Prospect full name is required';
    }

    if (!formData.email_address.trim()) {
      newErrors.email_address = 'Prospect email address is required';
    } else if (!validateEmail(formData.email_address)) {
      newErrors.email_address = 'Please enter a valid email address';
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Prospect company name is required';
    }

    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Prospect job title is required';
    }

    if (formData.linkedin_url && !formData.linkedin_url.includes('linkedin.com')) {
      newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
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
          <Target className="w-5 h-5 mr-2 text-primary" />
          Prospect Information
        </h3>
        <p className="text-muted-foreground">
          Enter details about the person you want to reach out to.
        </p>
        
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
              placeholder="Sarah Johnson"
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
                placeholder="sarah@techcorp.com"
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
                placeholder="TechCorp Solutions"
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
                placeholder="VP of Sales"
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

        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium mb-2">
            LinkedIn Profile (Optional)
          </label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
              className={`input pl-10 ${errors.linkedin_url ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="https://linkedin.com/in/sarahjohnson"
              disabled={isSubmitting}
            />
          </div>
          {errors.linkedin_url && (
            <p className="text-red-500 text-sm mt-1">{errors.linkedin_url}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Additional Notes (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="textarea pl-10"
              placeholder="Any additional context about this prospect or their company that might help personalize the outreach..."
              disabled={isSubmitting}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Optional: Any context that could help create more personalized emails.
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
          {isSubmitting ? 'Saving...' : 'Save Prospect'}
        </button>
      </div>
    </form>
  );
}