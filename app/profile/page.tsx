'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'
import UserProfileForm from '@/components/UserProfileForm'
import { Save, User } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (data: UserProfile) => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call - in real implementation, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(data);
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your personal and company information for outbound campaigns
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <Save className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Profile Form */}
          <div className="card">
            <div className="card-content">
              <UserProfileForm
                initialData={profile || undefined}
                onSubmit={handleSubmit}
                isSubmitting={isLoading}
              />
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Why do we need this information?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your details are used to personalize outbound email campaigns</li>
              <li>• Company bio helps AI create more relevant and compelling content</li>
              <li>• All information is stored securely and used only for your campaigns</li>
              <li>• You can update this information at any time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}