// lib/cosmic.ts
import { createBucketClient } from '@cosmicjs/sdk';
import { 
  EmailSequence, 
  EmailStep, 
  Prospect, 
  SenderProfile, 
  EmailTemplate,
  EmailSequenceFormData,
  GeneratedSequence,
  CosmicError,
  isCosmicError
} from '@/types';
import { generateSequenceFromTemplate } from './emailGenerator';

// Initialize Cosmic client
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: "staging"
});

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all email sequences
export async function getEmailSequences(): Promise<EmailSequence[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-sequences' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects as EmailSequence[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email sequences');
  }
}

// Fetch email sequence by slug
export async function getEmailSequence(slug: string): Promise<EmailSequence | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'email-sequences',
        slug: slug
      })
      .depth(1);
    
    return response.object as EmailSequence;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch email steps for a sequence
export async function getEmailSteps(sequenceId: string): Promise<EmailStep[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'email-steps',
        'metadata.email_sequence': sequenceId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as EmailStep[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email steps');
  }
}

// Create prospect
export async function createProspect(data: {
  full_name: string;
  email_address: string;
  job_title?: string;
  company_name?: string;
  company_industry?: string;
}): Promise<Prospect> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'prospects',
      title: `${data.full_name} - ${data.job_title || 'Contact'}`,
      slug: `${data.full_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      metadata: {
        full_name: data.full_name,
        email_address: data.email_address,
        job_title: data.job_title || '',
        company_name: data.company_name || '',
        company_industry: data.company_industry || '',
        status: 'new'
      }
    });
    
    return response.object as Prospect;
  } catch (error) {
    console.error('Error creating prospect:', error);
    throw new Error('Failed to create prospect');
  }
}

// Get or create sender profile
export async function getActiveSenderProfile(): Promise<SenderProfile | null> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'sender-profiles',
        'metadata.active': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(1);
    
    return response.objects.length > 0 ? response.objects[0] as SenderProfile : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch sender profile');
  }
}

// Generate email sequence using Cosmic AI
export async function generateEmailSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence> {
  console.log('Starting email sequence generation with Cosmic AI for:', formData.full_name);

  try {
    // Try Cosmic AI generation first
    console.log('Attempting Cosmic AI generation...');
    
    const prompt = `Create a professional 5-step cold email sequence for reaching out to ${formData.full_name}, who is a ${formData.job_title} at ${formData.company_name} in the ${formData.industry} industry.

Campaign Goal: ${formData.goal}
Email Tone: ${formData.tone}

Please generate exactly 5 emails with the following structure for each:
- Step number (1-5)
- Subject line (engaging and relevant)
- Email body (personalized HTML format with proper paragraphs)
- Timing (when to send - Day 1, 4, 7, 11, 15)

Make the emails ${formData.tone} in tone and focused on ${formData.goal}. Each email should build upon the previous one and include a clear call-to-action.

Format the response as a JSON object with this structure:
{
  "steps": [
    {
      "step_number": 1,
      "subject_line": "...",
      "email_body": "...",
      "timing": "..."
    }
  ],
  "metadata": {
    "prospect_name": "${formData.full_name}",
    "company_name": "${formData.company_name}",
    "tone": "${formData.tone}",
    "goal": "${formData.goal}"
  }
}`;

    const aiResponse = await cosmic.ai.generateText({
      prompt: prompt,
      max_tokens: 2000
    });

    console.log('Cosmic AI response received');
    
    // Parse the AI response
    let parsedResponse;
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : aiResponse.text;
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      console.warn('Failed to parse Cosmic AI response, falling back to template generation:', parseError);
      throw new Error('AI response parsing failed');
    }

    // Validate the parsed response
    if (parsedResponse.steps && Array.isArray(parsedResponse.steps) && parsedResponse.steps.length > 0) {
      console.log('Cosmic AI generation successful with', parsedResponse.steps.length, 'steps');
      return parsedResponse as GeneratedSequence;
    } else {
      throw new Error('Invalid Cosmic AI response structure');
    }

  } catch (error) {
    console.warn('Cosmic AI generation failed, using template-based generation:', error);
    
    // Fallback to template-based generation
    console.log('Using template-based generation as fallback...');
    const sequence = generateSequenceFromTemplate(formData);
    console.log('Template-based generation successful with', sequence.steps.length, 'steps');
    return sequence;
  }
}

// Save generated sequence to Cosmic
export async function saveEmailSequence(
  sequence: GeneratedSequence,
  formData: EmailSequenceFormData,
  prospectId: string,
  senderProfileId?: string
): Promise<EmailSequence> {
  try {
    console.log('Saving email sequence to Cosmic...');
    
    // Create the email sequence
    const sequenceResponse = await cosmic.objects.insertOne({
      type: 'email-sequences',
      title: `${sequence.metadata.prospect_name} - ${sequence.metadata.goal} Sequence`,
      slug: `${sequence.metadata.prospect_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      metadata: {
        sequence_name: `${sequence.metadata.prospect_name} - ${sequence.metadata.goal} Sequence`,
        sender_profile: senderProfileId || '',
        prospect: prospectId,
        email_count: sequence.steps.length,
        frequency_days: 3,
        tone: sequence.metadata.tone,
        goal: sequence.metadata.goal,
        status: 'draft',
        generated_at: new Date().toISOString(),
        ai_generated: true
      }
    });

    const savedSequence = sequenceResponse.object as EmailSequence;
    console.log('Email sequence saved with ID:', savedSequence.id);

    // Create email steps
    for (const step of sequence.steps) {
      await cosmic.objects.insertOne({
        type: 'email-steps',
        title: `Step ${step.step_number} - ${step.subject_line}`,
        slug: `${savedSequence.slug}-step-${step.step_number}`,
        metadata: {
          email_sequence: savedSequence.id,
          step_number: step.step_number,
          subject_line: step.subject_line,
          email_body: step.email_body,
          send_delay_days: (step.step_number - 1) * 3,
          status: 'draft'
        }
      });
    }

    console.log('All email steps saved successfully');
    return savedSequence;
  } catch (error) {
    console.error('Error saving email sequence:', error);
    throw new Error('Failed to save email sequence');
  }
}

// Get email templates
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'email-templates',
        'metadata.active': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as EmailTemplate[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email templates');
  }
}