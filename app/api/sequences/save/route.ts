import { NextRequest, NextResponse } from 'next/server'
import { saveEmailSequence } from '@/lib/cosmic'
import { GeneratedSequence, EmailSequenceFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting save sequence API request...')
    
    const body: {
      sequence: GeneratedSequence
      formData: EmailSequenceFormData
      prospectId: string
      senderProfileId?: string
    } = await request.json()
    
    // Validate required data
    if (!body.sequence || !body.formData || !body.prospectId) {
      return NextResponse.json(
        { error: 'Missing required data: sequence, formData, or prospectId' },
        { status: 400 }
      )
    }

    // Validate sequence structure
    if (!body.sequence.steps || !Array.isArray(body.sequence.steps) || body.sequence.steps.length === 0) {
      return NextResponse.json(
        { error: 'Invalid sequence: steps array is required and must not be empty' },
        { status: 400 }
      )
    }

    console.log('Saving email sequence with', body.sequence.steps.length, 'steps')

    // Save the sequence to Cosmic
    const savedSequence = await saveEmailSequence(
      body.sequence,
      body.formData,
      body.prospectId,
      body.senderProfileId
    )

    console.log('Email sequence saved successfully with ID:', savedSequence.id)

    return NextResponse.json({
      success: true,
      sequence: savedSequence
    })

  } catch (error) {
    console.error('Error in save sequence API:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to save email sequence',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}