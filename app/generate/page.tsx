'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExtendedWorkflowFormData, UserProfile, ProspectData, FormStep, GOAL_OPTIONS, TONE_OPTIONS, GoalKey, ToneKey } from '@/types'
import UserProfileForm from '@/components/UserProfileForm'
import ProspectForm from '@/components/ProspectForm'
import ApiKeyForm from '@/components/ApiKeyForm'
import { ArrowLeft, ArrowRight, User, Target, Key, Settings, CheckCircle } from 'lucide-react'

export default function GeneratePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.USER_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [prospectData, setProspectData] = useState<ProspectData | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [campaignSettings, setCampaignSettings] = useState({
    goal: 'book-demo' as GoalKey,
    tone: 'professional' as ToneKey,
    emailCount: 5
  });

  const steps = [
    { id: FormStep.USER_PROFILE, title: 'Your Profile', icon: User, completed: !!userProfile },
    { id: FormStep.PROSPECT_INFO, title: 'Prospect Info', icon: Target, completed: !!prospectData },
    { id: FormStep.API_KEY, title: 'API Key', icon: Key, completed: !!apiKey },
    { id: FormStep.CAMPAIGN_SETTINGS, title: 'Campaign', icon: Settings, completed: false },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleUserProfileSubmit = (data: UserProfile) => {
    setUserProfile(data);
    setCurrentStep(FormStep.PROSPECT_INFO);
  };

  const handleProspectSubmit = (data: ProspectData) => {
    setProspectData(data);
    setCurrentStep(FormStep.API_KEY);
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setCurrentStep(FormStep.CAMPAIGN_SETTINGS);
  };

  const handleCampaignSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile || !prospectData || !apiKey) {
      setError('Please complete all previous steps');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const workflowData: ExtendedWorkflowFormData = {
        // Prospect information
        prospect_full_name: prospectData.full_name,
        prospect_email_address: prospectData.email_address,
        prospect_company_name: prospectData.company_name,
        prospect_job_title: prospectData.job_title,
        
        // Sender information
        sender_full_name: userProfile.full_name,
        sender_email_address: userProfile.email_address,
        sender_company_name: userProfile.company_name,
        sender_job_title: userProfile.job_title,
        
        // Campaign settings
        industry: prospectData.industry,
        goal: campaignSettings.goal,
        tone: campaignSettings.tone,
        
        // Optional
        company_bio: userProfile.company_bio
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workflowData,
          apiKey,
          emailCount: campaignSettings.emailCount
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate workflow');
      }

      // Check if result and result.workflow exist before accessing slug
      if (result && result.workflow && result.workflow.slug) {
        router.push(`/results/${result.workflow.slug}`);
      } else {
        throw new Error('Invalid response: missing workflow slug');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const goToStep = (step: FormStep) => {
    const targetIndex = steps.findIndex(s => s.id === step);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    // Only allow going to completed steps or the next step
    if (targetIndex <= currentIndex || (steps[targetIndex - 1] && steps[targetIndex - 1].completed)) {
      setCurrentStep(step);
    }
  };

  const goBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const canGoBack = currentStepIndex > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Generate Your Email Sequence</h1>
            <p className="text-muted-foreground">
              Follow these steps to create a personalized outbound email campaign
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.completed;
                const isClickable = isCompleted || index === 0 || (steps[index - 1] && steps[index - 1].completed);

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isClickable && goToStep(step.id)}
                      disabled={!isClickable}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : isClickable
                          ? 'bg-muted hover:bg-muted/80'
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="card">
            <div className="card-content">
              {currentStep === FormStep.USER_PROFILE && (
                <UserProfileForm
                  initialData={userProfile || undefined}
                  onSubmit={handleUserProfileSubmit}
                  isSubmitting={isLoading}
                />
              )}

              {currentStep === FormStep.PROSPECT_INFO && (
                <ProspectForm
                  initialData={prospectData || undefined}
                  onSubmit={handleProspectSubmit}
                  onCancel={canGoBack ? goBack : undefined}
                  isSubmitting={isLoading}
                />
              )}

              {currentStep === FormStep.API_KEY && (
                <ApiKeyForm
                  initialApiKey={apiKey}
                  onSubmit={handleApiKeySubmit}
                  onCancel={canGoBack ? goBack : undefined}
                  isSubmitting={isLoading}
                />
              )}

              {currentStep === FormStep.CAMPAIGN_SETTINGS && (
                <form onSubmit={handleCampaignSettingsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Campaign Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="goal" className="block text-sm font-medium mb-2">
                          Campaign Goal *
                        </label>
                        <select
                          id="goal"
                          value={campaignSettings.goal}
                          onChange={(e) => setCampaignSettings(prev => ({ ...prev, goal: e.target.value as GoalKey }))}
                          className="select"
                          disabled={isLoading}
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
                          value={campaignSettings.tone}
                          onChange={(e) => setCampaignSettings(prev => ({ ...prev, tone: e.target.value as ToneKey }))}
                          className="select"
                          disabled={isLoading}
                          required
                        >
                          {Object.entries(TONE_OPTIONS).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="emailCount" className="block text-sm font-medium mb-2">
                          Number of Emails *
                        </label>
                        <select
                          id="emailCount"
                          value={campaignSettings.emailCount}
                          onChange={(e) => setCampaignSettings(prev => ({ ...prev, emailCount: Number(e.target.value) }))}
                          className="select"
                          disabled={isLoading}
                          required
                        >
                          <option value={3}>3 emails</option>
                          <option value={4}>4 emails</option>
                          <option value={5}>5 emails</option>
                          <option value={6}>6 emails</option>
                          <option value={7}>7 emails</option>
                        </select>
                      </div>
                    </div>

                    {/* Summary */}
                    {userProfile && prospectData && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Campaign Summary</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>From:</strong> {userProfile.full_name} at {userProfile.company_name}</p>
                          <p><strong>To:</strong> {prospectData.full_name} at {prospectData.company_name}</p>
                          <p><strong>Goal:</strong> {GOAL_OPTIONS[campaignSettings.goal]}</p>
                          <p><strong>Tone:</strong> {TONE_OPTIONS[campaignSettings.tone]}</p>
                          <p><strong>Emails:</strong> {campaignSettings.emailCount} emails in sequence</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="btn-outline"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Email Sequence'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}