// app/results/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getEmailSequence, getEmailSteps } from '@/lib/cosmic'
import SequenceResults from '@/components/SequenceResults'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ResultsPage({ params }: PageProps) {
  // IMPORTANT: In Next.js 15+, params are now Promises and MUST be awaited
  const { slug } = await params

  const sequence = await getEmailSequence(slug)
  
  if (!sequence) {
    notFound()
  }

  const emailSteps = await getEmailSteps(sequence.id)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Email Sequence is Ready!
            </h1>
            <p className="text-lg text-gray-600">
              Here's your personalized {emailSteps.length}-step email sequence. You can copy, edit, or export each step.
            </p>
          </div>

          <SequenceResults 
            sequence={sequence} 
            emailSteps={emailSteps} 
          />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const sequence = await getEmailSequence(slug)
  
  if (!sequence) {
    return {
      title: 'Sequence Not Found - Outbound Engine'
    }
  }

  return {
    title: `${sequence.metadata.sequence_name} - Outbound Engine`,
    description: `Generated email sequence for ${sequence.metadata.prospect?.metadata?.full_name || 'prospect'} with ${sequence.metadata.tone} tone targeting ${sequence.metadata.goal}.`
  }
}