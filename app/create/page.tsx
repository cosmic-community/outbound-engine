'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SequenceForm from '@/components/SequenceForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import { EmailSequenceFormData, GeneratedSequence } from '@/types'
import { generateEmailSequence, createProspect, getActiveSenderProfile, saveEmailSequence } from '@/lib/cosmic'

export default function CreateSequencePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFormSubmit = async (formData: EmailSequenceFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Generate the email sequence using AI
      const generatedSequence = await generateEmailSequence(formData)
      
      // Create prospect record
      const prospect = await createProspect({
        full_name: formData.full_name,
        email_address: formData.email_address,
        job_title: formData.job_title,
        company_name: formData.company_name,
        company_industry: formData.industry
      })

      // Get active sender profile
      const senderProfile = await getActiveSenderProfile()

      // Save the sequence to Cosmic
      const savedSequence = await saveEmailSequence(
        generatedSequence,
        formData,
        prospect.id,
        senderProfile?.id
      )

      // Redirect to results page
      router.push(`/results/${savedSequence.slug}`)
    } catch (error) {
      console.error('Error creating sequence:', error)
      setError('Failed to generate email sequence. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Generating Your Email Sequence
          </h2>
          <p className="mt-2 text-gray-600">
            Our AI is crafting personalized emails for you...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Email Sequence
            </h1>
            <p className="text-lg text-gray-600">
              Fill out the details below and our AI will generate a personalized 5-step email sequence for you.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="card">
            <SequenceForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}