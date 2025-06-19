'use client'

import { useState } from 'react'
import { ProspectData } from '@/types'
import ProspectForm from '@/components/ProspectForm'
import { Target, Plus } from 'lucide-react'

export default function ProspectPage() {
  const [prospects, setProspects] = useState<ProspectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: ProspectData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call - in real implementation, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProspects(prev => [...prev, { ...data }]);
      setMessage({ type: 'success', text: 'Prospect saved successfully!' });
      setShowForm(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save prospect. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold">Prospect Manager</h1>
              </div>
              <p className="text-muted-foreground">
                Save and manage prospects for your outbound campaigns
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </button>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <span>{message.text}</span>
            </div>
          )}

          {/* Add Prospect Form */}
          {showForm && (
            <div className="card mb-8">
              <div className="card-content">
                <ProspectForm
                  onSubmit={handleSubmit}
                  onCancel={() => setShowForm(false)}
                  isSubmitting={isLoading}
                />
              </div>
            </div>
          )}

          {/* Prospects List */}
          {prospects.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Prospects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prospects.map((prospect, index) => (
                  <div key={index} className="card">
                    <div className="card-content">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{prospect.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{prospect.job_title}</p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {prospect.industry.charAt(0).toUpperCase() + prospect.industry.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><strong>Company:</strong> {prospect.company_name}</p>
                        <p><strong>Email:</strong> {prospect.email_address}</p>
                        {prospect.linkedin_url && (
                          <p><strong>LinkedIn:</strong> 
                            <a 
                              href={prospect.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline ml-1"
                            >
                              Profile
                            </a>
                          </p>
                        )}
                        {prospect.notes && (
                          <p><strong>Notes:</strong> {prospect.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !showForm ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Prospects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first prospect to create targeted email campaigns
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Prospect
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}