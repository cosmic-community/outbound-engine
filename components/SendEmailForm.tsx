'use client'

import { useState } from 'react'
import { EmailWorkflow } from '@/types'
import { Send, Clock, Mail, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'

interface SendEmailFormProps {
  workflows: EmailWorkflow[]
}

export default function SendEmailForm({ workflows }: SendEmailFormProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')
  const [sendingMode, setSendingMode] = useState<'immediate' | 'scheduled'>('immediate')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [intervalDays, setIntervalDays] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow)
  const workflowSteps = selectedWorkflowData?.metadata?.generated_workflow?.steps || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkflow) return

    setIsLoading(true)
    try {
      // In a real app, this would integrate with email services
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId: selectedWorkflow,
          sendingMode,
          scheduleDate,
          scheduleTime,
          intervalDays
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error sending emails:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScheduledDates = () => {
    if (!scheduleDate || workflowSteps.length === 0) return []
    
    const startDate = new Date(scheduleDate + ' ' + scheduleTime)
    return workflowSteps.map((step, index) => {
      const date = new Date(startDate)
      date.setDate(date.getDate() + (index * intervalDays))
      return date
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Email campaign scheduled successfully!
        </div>
      )}

      {/* Workflow Selection */}
      <div className="card">
        <div className="card-content p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-primary" />
            Select Email Sequence
          </h2>
          
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="border rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="workflow"
                    value={workflow.id}
                    checked={selectedWorkflow === workflow.id}
                    onChange={(e) => setSelectedWorkflow(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{workflow.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workflow.metadata?.goal?.value} • {workflow.metadata?.industry?.value} • 
                      {workflow.metadata?.generated_workflow?.steps?.length || 0} emails
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(workflow.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedWorkflow && (
        <>
          {/* Sending Options */}
          <div className="card">
            <div className="card-content p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Sending Schedule
              </h2>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sendingMode"
                      value="immediate"
                      checked={sendingMode === 'immediate'}
                      onChange={(e) => setSendingMode(e.target.value as 'immediate' | 'scheduled')}
                    />
                    <span>Send Immediately</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sendingMode"
                      value="scheduled"
                      checked={sendingMode === 'scheduled'}
                      onChange={(e) => setSendingMode(e.target.value as 'immediate' | 'scheduled')}
                    />
                    <span>Schedule for Later</span>
                  </label>
                </div>

                {sendingMode === 'scheduled' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <label htmlFor="scheduleDate" className="block text-sm font-medium mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="scheduleDate"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="input"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="scheduleTime" className="block text-sm font-medium mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="scheduleTime"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="intervalDays" className="block text-sm font-medium mb-2">
                        Days Between Emails
                      </label>
                      <select
                        id="intervalDays"
                        value={intervalDays}
                        onChange={(e) => setIntervalDays(Number(e.target.value))}
                        className="select"
                      >
                        <option value={1}>1 day</option>
                        <option value={2}>2 days</option>
                        <option value={3}>3 days</option>
                        <option value={5}>5 days</option>
                        <option value={7}>1 week</option>
                        <option value={14}>2 weeks</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Schedule */}
          {sendingMode === 'scheduled' && scheduleDate && scheduleTime && (
            <div className="card">
              <div className="card-content p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Sending Schedule Preview
                </h3>
                <div className="space-y-3">
                  {getScheduledDates().map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <span className="font-medium">Email {index + 1}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {workflowSteps[index]?.subject}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="card border-orange-200 bg-orange-50">
            <div className="card-content p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-orange-800">
                  <h3 className="font-semibold mb-2">Demo Mode</h3>
                  <p className="text-sm">
                    This is a demonstration interface. To actually send emails, you need to integrate 
                    with an email service provider (Gmail API, Outlook, SMTP server, etc.).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !selectedWorkflow}
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  {sendingMode === 'immediate' ? 'Sending...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {sendingMode === 'immediate' ? 'Send Now' : 'Schedule Campaign'}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  )
}