import { NextRequest, NextResponse } from 'next/server'
import { generateEmailSequence, createProspect, getActiveSenderProfile, saveEmailSequence } from '@/lib/cosmic'
import { EmailSequenceFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting email sequence generation API request...')
    
    const body: EmailSequenceFormData = await request.json()
    
    // Validate required fields
    const requiredFields = ['full_name', 'email_address', 'company_name', 'job_title', 'industry', 'goal', 'tone']
    const missingFields = requiredFields.filter(field => !body[field as keyof EmailSequenceFormData])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email_address)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      )
    }

    console.log('Generating email sequence for:', body.full_name)

    // Generate the email sequence
    const generatedSequence = await generateEmailSequence(body)
    console.log('Email sequence generated successfully')

    // Create prospect record
    console.log('Creating prospect record...')
    const prospect = await createProspect({
      full_name: body.full_name,
      email_address: body.email_address,
      job_title: body.job_title,
      company_name: body.company_name,
      company_industry: body.industry
    })
    console.log('Prospect created with ID:', prospect.id)

    // Get active sender profile
    console.log('Fetching active sender profile...')
    const senderProfile = await getActiveSenderProfile()
    console.log('Sender profile:', senderProfile?.id || 'No active sender profile found')

    // Save the sequence to Cosmic
    console.log('Saving email sequence to database...')
    const savedSequence = await saveEmailSequence(
      generatedSequence,
      body,
      prospect.id,
      senderProfile?.id
    )
    console.log('Email sequence saved with slug:', savedSequence.slug)

    return NextResponse.json({
      success: true,
      sequence: savedSequence,
      redirect_url: `/results/${savedSequence.slug}`
    })

  } catch (error) {
    console.error('Error in sequence generation API:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to generate email sequence',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}