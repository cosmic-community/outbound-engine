'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EmailSequence, EmailStep } from '@/types'
import { Copy, Check, RefreshCw, Download, Mail } from 'lucide-react'

interface SequenceResultsProps {
  sequence: EmailSequence
  emailSteps: EmailStep[]
}

export default function SequenceResults({ sequence, emailSteps }: SequenceResultsProps) {
  const [copiedSteps, setCopiedSteps] = useState<Set<string>>(new Set())

  const sortedSteps = emailSteps.sort((a, b) => a.metadata.step_number - b.metadata.step_number)

  const copyToClipboard = async (text: string, stepId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSteps(prev => new Set([...Array.from(prev), stepId]))
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedSteps(prev => {
          const newSet = new Set(Array.from(prev))
          newSet.delete(stepId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const copyFullSequence = async () => {
    const fullSequence = sortedSteps.map(step => 
      `EMAIL ${step.metadata.step_number}:\n\nSubject: ${step.metadata.subject_line}\n\n${step.metadata.email_body.replace(/<[^>]*>/g, '')}\n\n${'='.repeat(50)}\n`
    ).join('\n')

    await copyToClipboard(fullSequence, 'full-sequence')
  }

  const exportAsText = () => {
    const fullSequence = sortedSteps.map(step => 
      `EMAIL ${step.metadata.step_number}:\n\nSubject: ${step.metadata.subject_line}\n\n${step.metadata.email_body.replace(/<[^>]*>/g, '')}\n\nTiming: Day ${((step.metadata.step_number - 1) * 3) + 1}\n\n${'='.repeat(50)}\n`
    ).join('\n')

    const blob = new Blob([fullSequence], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sequence.metadata.sequence_name.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Sequence Header */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {sequence.metadata.sequence_name}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Prospect: {sequence.metadata.prospect?.metadata?.full_name || 'Unknown'}</span>
              <span>Tone: {sequence.metadata.tone}</span>
              <span>Goal: {sequence.metadata.goal}</span>
              <span>Steps: {emailSteps.length}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={copyFullSequence}
              className="btn btn-outline"
            >
              {copiedSteps.has('full-sequence') ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </>
              )}
            </button>
            <button
              onClick={exportAsText}
              className="btn btn-outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Email Steps */}
      <div className="space-y-6">
        {sortedSteps.length === 0 ? (
          <div className="card text-center py-8">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No email steps found
            </h3>
            <p className="text-gray-600 mb-4">
              This sequence doesn't have any email steps yet.
            </p>
            <Link href="/create" className="btn btn-primary">
              Create New Sequence
            </Link>
          </div>
        ) : (
          sortedSteps.map((step) => (
            <div key={step.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {step.metadata.step_number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Email {step.metadata.step_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Day {((step.metadata.step_number - 1) * 3) + 1} - 
                      {step.metadata.step_number === 1 ? ' Send immediately' : ' Follow-up email'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(
                    `Subject: ${step.metadata.subject_line}\n\n${step.metadata.email_body.replace(/<[^>]*>/g, '')}`,
                    step.id
                  )}
                  className="btn btn-outline btn-sm"
                >
                  {copiedSteps.has(step.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {/* Subject Line */}
                <div>
                  <label className="label text-xs uppercase tracking-wider text-gray-500">
                    Subject Line
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-medium text-gray-900">
                      {step.metadata.subject_line}
                    </p>
                  </div>
                </div>

                {/* Email Body */}
                <div>
                  <label className="label text-xs uppercase tracking-wider text-gray-500">
                    Email Body
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: step.metadata.email_body }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Link href="/create" className="btn btn-primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Create New Sequence
        </Link>
        <Link href="/sequences" className="btn btn-outline">
          View All Sequences
        </Link>
      </div>
    </div>
  )
}