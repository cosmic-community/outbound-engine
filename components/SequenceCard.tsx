import Link from 'next/link'
import { EmailSequence } from '@/types'
import { Calendar, Mail, User, Target } from 'lucide-react'

interface SequenceCardProps {
  sequence: EmailSequence
}

export default function SequenceCard({ sequence }: SequenceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Link href={`/results/${sequence.slug}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-200 h-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {sequence.metadata.sequence_name || sequence.title}
          </h3>
          <div className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-md whitespace-nowrap">
            {sequence.metadata.tone || 'Professional'}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {sequence.metadata.prospect?.metadata?.full_name && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {sequence.metadata.prospect.metadata.full_name}
                {sequence.metadata.prospect.metadata.company_name && (
                  <span className="text-gray-500">
                    {' '}at {sequence.metadata.prospect.metadata.company_name}
                  </span>
                )}
              </span>
            </div>
          )}

          {sequence.metadata.goal && (
            <div className="flex items-center text-sm text-gray-600">
              <Target className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{sequence.metadata.goal}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>5 email sequence</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Created {formatDate(sequence.created_at)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="text-sm text-primary-600 font-medium hover:text-primary-700">
            View Sequence →
          </div>
        </div>
      </div>
    </Link>
  )
}