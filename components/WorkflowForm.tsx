'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkflowFormData, INDUSTRY_OPTIONS, GOAL_OPTIONS, TONE_OPTIONS, IndustryKey, GoalKey, ToneKey } from '@/types'
import { Loader2 } from 'lucide-react'

export default function WorkflowForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkflowFormData>({
    full_name: '',
    email_address: '',
    company_name: '',
    job_title: '',
    industry: 'tech',
    goal: 'book-demo',
    tone: 'professional'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate workflow');
      }

      // Redirect to results page
      router.push(`/results/${result.workflow.slug}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        
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
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="email_address" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email_address"
              name="email_address"
              value={formData.email_address}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="job_title" className="block text-sm font-medium mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
        </div>
      </div>

      {/* Campaign Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Campaign Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label htmlFor="goal" className="block text-sm font-medium mb-2">
              Campaign Goal *
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="select"
              required
            >
              {Object.entries(GOAL_OPTIONS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium mb-2">
              Email Tone *
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleInputChange}
              className="select"
              required
            >
              {Object.entries(TONE_OPTIONS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Your Sequence...
          </>
        ) : (
          'Generate My Email Sequence'
        )}
      </button>

      <p className="text-sm text-muted-foreground text-center">
        This will create a personalized 5-step email workflow tailored to your specifications.
      </p>
    </form>
  );
}