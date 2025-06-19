import CompanyProfileForm from '@/components/CompanyProfileForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/profile" className="btn-outline mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Company Profile</h1>
            <p className="text-muted-foreground">
              Update your company information and email preferences
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-content p-6">
            <CompanyProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}