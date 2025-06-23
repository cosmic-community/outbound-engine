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

// Initialize Cosmic client
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
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

// Create email templates based on form data and tone
function createTemplateSequence(formData: EmailSequenceFormData): GeneratedSequence {
  const { tone, goal, full_name, company_name, industry } = formData;
  
  const toneAdjustments = {
    friendly: {
      greeting: "Hi there!",
      closing: "Looking forward to hearing from you!",
      style: "casual and warm"
    },
    formal: {
      greeting: "Dear",
      closing: "I look forward to your response.",
      style: "professional and respectful"
    },
    direct: {
      greeting: "Hello",
      closing: "Let me know your thoughts.",
      style: "straightforward and concise"
    },
    funny: {
      greeting: "Hey!",
      closing: "Hope to chat soon (and maybe share a laugh!)",
      style: "light-hearted and engaging"
    }
  };

  const goalTemplates = {
    book_demo: {
      focus: "scheduling a product demonstration",
      cta: "book a quick demo",
      value: "see how our solution can benefit your team"
    },
    introduce_product: {
      focus: "introducing our innovative solution",
      cta: "learn more about our product",
      value: "discover how we can solve your challenges"
    },
    close_deal: {
      focus: "finalizing our partnership",
      cta: "move forward with our proposal",
      value: "complete this beneficial partnership"
    },
    network: {
      focus: "building a professional connection",
      cta: "connect and explore opportunities",
      value: "expand our professional networks"
    },
    follow_up: {
      focus: "following up on our previous conversation",
      cta: "continue our discussion",
      value: "move forward with next steps"
    }
  };

  const toneConfig = toneAdjustments[tone];
  const goalConfig = goalTemplates[goal];

  const steps = [
    {
      step_number: 1,
      subject_line: `Quick introduction - ${goalConfig.focus}`,
      email_body: `
        <p>${toneConfig.greeting} ${full_name},</p>
        <p>I hope this email finds you well. I'm reaching out because I noticed ${company_name} is in the ${industry} industry, and I believe we have a solution that could be valuable for your team.</p>
        <p>We specialize in helping companies like yours ${goalConfig.value}. I'd love to ${goalConfig.cta} if you're interested.</p>
        <p>Would you be open to a brief conversation this week?</p>
        <p>Best regards,<br/>
        [Your Name]</p>
      `,
      timing: "Day 1 - Send immediately"
    },
    {
      step_number: 2,
      subject_line: `Following up - ${goalConfig.focus} for ${company_name}`,
      email_body: `
        <p>${toneConfig.greeting} ${full_name},</p>
        <p>I wanted to follow up on my previous email about ${goalConfig.focus}. I understand you're likely busy, but I thought you might be interested in how we've helped other ${industry} companies.</p>
        <p>Here are a few quick benefits our clients typically see:</p>
        <ul>
          <li>Improved efficiency and productivity</li>
          <li>Cost savings and better ROI</li>
          <li>Streamlined processes</li>
        </ul>
        <p>Would you be interested in a 15-minute call to ${goalConfig.cta}?</p>
        <p>${toneConfig.closing}</p>
        <p>Best regards,<br/>
        [Your Name]</p>
      `,
      timing: "Day 4 - First follow-up"
    },
    {
      step_number: 3,
      subject_line: `Case study: How we helped [Similar Company] in ${industry}`,
      email_body: `
        <p>${toneConfig.greeting} ${full_name},</p>
        <p>I thought you might find this interesting - we recently worked with a company similar to ${company_name} in the ${industry} space.</p>
        <p>They were facing challenges with [common industry challenge], and after implementing our solution, they saw:</p>
        <ul>
          <li>25% improvement in efficiency</li>
          <li>Significant cost reductions</li>
          <li>Better team collaboration</li>
        </ul>
        <p>I'd be happy to share more details about how this could apply to ${company_name}. Would you be open to a brief call?</p>
        <p>${toneConfig.closing}</p>
        <p>Best regards,<br/>
        [Your Name]</p>
      `,
      timing: "Day 7 - Share social proof"
    },
    {
      step_number: 4,
      subject_line: `Last attempt - ${goalConfig.focus} opportunity`,
      email_body: `
        <p>${toneConfig.greeting} ${full_name},</p>
        <p>I've reached out a few times about ${goalConfig.focus}, and I don't want to be a bother. This will be my last email on this topic.</p>
        <p>If timing isn't right now, I completely understand. However, if you're still interested in ${goalConfig.value}, I'm here to help.</p>
        <p>Simply reply with "Yes" if you'd like to ${goalConfig.cta}, or "No" if you'd prefer I don't follow up again.</p>
        <p>Thank you for your time and consideration.</p>
        <p>${toneConfig.closing}</p>
        <p>Best regards,<br/>
        [Your Name]</p>
      `,
      timing: "Day 11 - Direct ask"
    },
    {
      step_number: 5,
      subject_line: `[Final] Staying in touch - ${company_name}`,
      email_body: `
        <p>${toneConfig.greeting} ${full_name},</p>
        <p>I haven't heard back from you, so I assume ${goalConfig.focus} isn't a priority right now - and that's perfectly fine!</p>
        <p>I'll stop reaching out about this specific opportunity, but I wanted to leave the door open. If circumstances change and you'd like to ${goalConfig.cta} in the future, please don't hesitate to reach out.</p>
        <p>I'll also make sure to share any relevant industry insights or resources that might be valuable for ${company_name}.</p>
        <p>Wishing you and your team continued success!</p>
        <p>Best regards,<br/>
        [Your Name]</p>
      `,
      timing: "Day 15 - Soft close"
    }
  ];

  return {
    steps,
    metadata: {
      prospect_name: full_name,
      company_name: company_name,
      tone: tone,
      goal: goal
    }
  };
}

// Generate email sequence using AI with fallback to templates
export async function generateEmailSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence> {
  console.log('Starting email sequence generation for:', formData.full_name);

  // First, try to use AI generation
  try {
    console.log('Attempting AI generation...');
    
    const prompt = `Create a professional 5-step cold email sequence for reaching out to ${formData.full_name}, who is a ${formData.job_title} at ${formData.company_name} in the ${formData.industry} industry.

Requirements:
- Tone: ${formData.tone}
- Goal: ${formData.goal}
- Each email should build on the previous one
- Include timing for when to send each email
- Professional but ${formData.tone} tone
- Focus on achieving: ${formData.goal}

Format the response as valid JSON:
{
  "steps": [
    {
      "step_number": 1,
      "subject_line": "Subject line here",
      "email_body": "Email body with HTML formatting",
      "timing": "Day 1 - Send immediately"
    }
  ]
}

Create exactly 5 steps with appropriate timing (Day 1, Day 4, Day 7, Day 11, Day 15).`;

    const aiResponse = await cosmic.ai.generateText({
      prompt: prompt,
      max_tokens: 3000
    });

    console.log('AI response received, parsing...');

    if (aiResponse && aiResponse.text) {
      // Try to extract and parse JSON from the response
      const responseText = aiResponse.text.trim();
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          
          if (parsedResponse.steps && Array.isArray(parsedResponse.steps) && parsedResponse.steps.length >= 5) {
            console.log('AI generation successful!');
            return {
              steps: parsedResponse.steps.slice(0, 5), // Ensure exactly 5 steps
              metadata: {
                prospect_name: formData.full_name,
                company_name: formData.company_name,
                tone: formData.tone,
                goal: formData.goal
              }
            };
          }
        } catch (parseError) {
          console.log('Failed to parse AI response, using template fallback');
        }
      }
    }
  } catch (aiError) {
    console.log('AI generation failed, using template fallback:', aiError);
  }

  // Fallback to template-based generation
  console.log('Using template-based generation...');
  return createTemplateSequence(formData);
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
        generated_at: new Date().toISOString()
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