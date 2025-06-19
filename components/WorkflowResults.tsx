'use client'

import { useState } from 'react'
import { EmailWorkflow, EmailStep } from '@/types'
import { Copy, Check, RotateCcw, Download } from 'lucide-react'

interface WorkflowResultsProps {
  workflow: EmailWorkflow;
}

export default function WorkflowResults({ workflow }: WorkflowResultsProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(id));
      
      // Remove the copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleCopyAll = async () => {
    if (!workflowSteps) return;

    const allEmailsText = workflowSteps.map((step, index) => 
      `EMAIL ${step.step}: ${step.subject}\n\n${step.body}\n\nTiming: ${step.timing}\n\n${'='.repeat(50)}\n\n`
    ).join('');

    await handleCopy(allEmailsText, 'all-emails');
  };

  const workflowSteps = workflow.metadata?.generated_workflow?.steps;
  const workflowSummary = workflow.metadata?.generated_workflow?.summary;

  if (!workflowSteps) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No workflow steps found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Workflow Info */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{workflow.title}</h2>
              <p className="text-muted-foreground">
                {workflowSummary || `${workflowSteps.length}-step email sequence`}
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={handleCopyAll}
                className="btn-outline"
                disabled={copiedItems.has('all-emails')}
              >
                {copiedItems.has('all-emails') ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied All!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Copy All Emails
                  </>
                )}
              </button>
              <button
                onClick={() => window.location.href = '/generate'}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Generate New
              </button>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Industry:</span>
              <p className="font-medium">{workflow.metadata?.industry?.value}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Goal:</span>
              <p className="font-medium">{workflow.metadata?.goal?.value}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tone:</span>
              <p className="font-medium">{workflow.metadata?.tone?.value}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Steps:</span>
              <p className="font-medium">{workflowSteps.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Steps */}
      <div className="space-y-6">
        {workflowSteps.map((step: EmailStep, index: number) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="flex items-start justify-between mb-4">
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
                    onClick={() => handleCopy(step.subject, `subject-${step.step}`)}
                    className="text-muted-foreground hover:text-primary p-1"
                    title="Copy subject"
                  >
                    {copiedItems.has(`subject-${step.step}`) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy(`Subject: ${step.subject}\n\n${step.body}`, `email-${step.step}`)}
                    className="btn-outline btn-sm"
                  >
                    {copiedItems.has(`email-${step.step}`) ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Subject Line */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground">Subject Line:</label>
                <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{step.subject}</p>
                </div>
              </div>

              {/* Email Body */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground">Email Body:</label>
                <div className="mt-1 p-4 bg-muted/50 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{step.body}</pre>
                </div>
              </div>

              {/* Notes */}
              {step.notes && (
                <div className="p-3 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                  <p className="text-sm">
                    <span className="font-medium">Strategy Note:</span> {step.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <div className="space-y-2 text-muted-foreground">
            <p>✅ Your email sequence is ready to use</p>
            <p>✅ Copy individual emails or the entire sequence</p>
            <p>✅ Customize the content to match your brand voice</p>
            <p>✅ Set up your email automation tool with the suggested timing</p>
            <p>✅ Track your results and optimize based on performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}