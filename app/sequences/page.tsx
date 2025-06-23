import Link from 'next/link'
import { getEmailSequences } from '@/lib/cosmic'
import SequenceCard from '@/components/SequenceCard'
import { Plus } from 'lucide-react'

export default async function SequencesPage() {
  const sequences = await getEmailSequences()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Sequences
            </h1>
            <p className="text-lg text-gray-600">
              View and manage your generated email sequences
            </p>
          </div>
          <Link 
            href="/create"
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Sequence
          </Link>
        </div>

        {sequences.length === 0 ? (
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No sequences yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first AI-generated email sequence to get started.
              </p>
              <Link 
                href="/create"
                className="btn btn-primary"
              >
                Create Your First Sequence
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sequences.map((sequence) => (
              <SequenceCard 
                key={sequence.id} 
                sequence={sequence} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Email Sequences - Outbound Engine',
  description: 'View and manage your AI-generated email sequences'
}