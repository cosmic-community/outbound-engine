'use client'

import { useState } from 'react'
import { EmailStep } from '@/types'
import { Edit3, Save, X, Copy, Check } from 'lucide-react'

interface EmailSequenceEditorProps {
  steps: EmailStep[]
  onSave: (steps: EmailStep[]) => void
  isEditing?: boolean
}

export default function EmailSequenceEditor({ 
  steps: initialSteps, 
  onSave,
  isEditing = false 
}: EmailSequenceEditorProps) {
  const [steps, setSteps] = useState<EmailStep[]>(initialSteps)
  const [editingStep, setEditingStep] = useState<number | null>(isEditing ? 0 : null)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const updateStep = (stepIndex: number, field: keyof EmailStep, value: string) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, [field]: value } : step
    ))
  }

  const saveStep = (stepIndex: number) => {
    setEditingStep(null)
    onSave(steps)
  }

  const cancelEdit = (stepIndex: number) => {
    // Revert changes
    setSteps(initialSteps)
    setEditingStep(null)
  }

  const copyStep = async (step: EmailStep, stepIndex: number) => {
    const emailContent = `Subject: ${step.subject}\n\n${step.body}`
    try {
      await navigator.clipboard.writeText(emailContent)
      setCopiedStep(stepIndex)
      setTimeout(() => setCopiedStep(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="card">
          <div className="card-content p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-semibold">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold">Email {step.step}</h3>
                  <p className="text-sm text-muted-foreground">{step.timing}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyStep(step, index)}
                  className="text-muted-foreground hover:text-primary p-1"
                  title="Copy email"
                >
                  {copiedStep === index ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                {editingStep === index ? (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => saveStep(index)}
                      className="btn-outline btn-sm"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={() => cancelEdit(index)}
                      className="btn-outline btn-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingStep(index)}
                    className="btn-outline btn-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {editingStep === index ? (
              <div className="space-y-4">
                {/* Edit Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject Line:</label>
                  <input
                    type="text"
                    value={step.subject}
                    onChange={(e) => updateStep(index, 'subject', e.target.value)}
                    className="input"
                    placeholder="Enter email subject"
                  />
                </div>

                {/* Edit Body */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Body:</label>
                  <textarea
                    value={step.body}
                    onChange={(e) => updateStep(index, 'body', e.target.value)}
                    rows={12}
                    className="textarea"
                    placeholder="Enter email content"
                  />
                </div>

                {/* Edit Timing */}
                <div>
                  <label className="block text-sm font-medium mb-2">Timing:</label>
                  <input
                    type="text"
                    value={step.timing}
                    onChange={(e) => updateStep(index, 'timing', e.target.value)}
                    className="input"
                    placeholder="e.g., Send 3 days after previous email"
                  />
                </div>

                {/* Edit Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Strategy Notes:</label>
                  <textarea
                    value={step.notes}
                    onChange={(e) => updateStep(index, 'notes', e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Strategy notes for this email"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display Subject */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Subject Line:
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">{step.subject}</p>
                  </div>
                </div>

                {/* Display Body */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email Body:
                  </label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{step.body}</pre>
                  </div>
                </div>

                {/* Display Notes */}
                {step.notes && (
                  <div className="p-3 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                    <p className="text-sm">
                      <span className="font-medium">Strategy Note:</span> {step.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}