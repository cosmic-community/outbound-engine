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

// Initialize Cosmic client with staging environment
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
    // Enhanced Cosmic AI generation with improved prompt
    console.log('Attempting Cosmic AI generation...');
    
    const prompt = `You are an expert email marketing specialist. Create a professional 5-step cold email sequence for ${formData.full_name}, who is a ${formData.job_title} at ${formData.company_name} in the ${formData.industry} industry.

Campaign Requirements:
- Goal: ${formData.goal}
- Tone: ${formData.tone}
- Industry: ${formData.industry}
- Target: ${formData.job_title} role

Generate exactly 5 emails with this structure:
1. Initial outreach (Day 1)
2. Value-focused follow-up (Day 4) 
3. Social proof/case study (Day 7)
4. Direct ask/urgency (Day 11)
5. Soft close/future connection (Day 15)

Each email must include:
- Compelling subject line
- Personalized greeting
- Value proposition relevant to ${formData.industry}
- Clear call-to-action aligned with ${formData.goal}
- Professional ${formData.tone} tone
- HTML formatted body with proper paragraphs

Return ONLY valid JSON in this exact format:
{
  "steps": [
    {
      "step_number": 1,
      "subject_line": "...",
      "email_body": "<p>Hi ${formData.full_name},</p><p>...</p>",
      "timing": "Day 1 - Initial outreach"
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
      max_tokens: 3000 // Increased token limit for better responses
    });

    console.log('Cosmic AI response received');
    
    // Parse the AI response with improved error handling
    let parsedResponse: GeneratedSequence;
    try {
      // Clean the response text
      let cleanedText = aiResponse.text.trim();
      
      // Remove any markdown code blocks
      cleanedText = cleanedText.replace(/