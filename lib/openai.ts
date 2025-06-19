import OpenAI from 'openai';
import { WorkflowFormData, GeneratedWorkflow } from '@/types';

// Generate AI workflow using user's OpenAI API key
export async function generateAIWorkflow(
  formData: WorkflowFormData, 
  apiKey: string,
  companyBio?: string
): Promise<GeneratedWorkflow> {
  
  // Initialize OpenAI with user's API key
  const openai = new OpenAI({
    apiKey: apiKey.trim(),
  });

  const goalDescriptions = {
    'book-demo': 'book a product demo',
    'raise-awareness': 'raise awareness about our solution',
    'close-deal': 'close a sales deal'
  };

  const industryMap = {
    'tech': 'Technology',
    'finance': 'Finance',
    'healthcare': 'Healthcare',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'education': 'Education',
    'real-estate': 'Real Estate',
    'consulting': 'Consulting',
    'marketing': 'Marketing',
    'other': 'Other'
  };

  const defaultCompanyBio = "We help businesses optimize their outreach and improve their sales processes with AI-powered solutions.";

  const prompt = `Create a professional 5-step cold email sequence for outreach.

TARGET DETAILS:
- Name: ${formData.prospect_full_name}
- Job Title: ${formData.prospect_job_title}
- Company: ${formData.prospect_company_name}
- Industry: ${industryMap[formData.industry]}

SENDER DETAILS:
- Name: ${formData.sender_full_name}
- Company: ${formData.sender_company_name}
- Job Title: ${formData.sender_job_title}

CAMPAIGN DETAILS:
- Goal: ${goalDescriptions[formData.goal]}
- Tone: ${formData.tone}

SENDER COMPANY BIO:
${companyBio || defaultCompanyBio}

Create a strategic email sequence that:
1. Builds rapport and establishes credibility
2. Identifies relevant pain points for their industry/role
3. Provides value and social proof
4. Creates urgency without being pushy
5. Includes clear calls-to-action

Return ONLY a valid JSON object with this exact structure:
{
  "steps": [
    {
      "step": 1,
      "subject": "Subject line here",
      "body": "Email body with proper formatting and line breaks",
      "timing": "When to send this email",
      "notes": "Strategy note for this email"
    }
  ],
  "summary": "Brief summary of the sequence strategy"
}

Make sure each email is personalized, relevant, and follows cold outreach best practices. Use the prospect's name, company, and industry throughout. Include specific value propositions and avoid generic language.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert email marketing specialist who creates high-converting cold email sequences. Always return valid JSON responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    try {
      const workflow = JSON.parse(content) as GeneratedWorkflow;
      
      // Validate the structure
      if (!workflow.steps || !Array.isArray(workflow.steps) || workflow.steps.length === 0) {
        throw new Error('Invalid workflow structure');
      }

      return workflow;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
    }

  } catch (openaiError) {
    console.error('OpenAI API error:', openaiError);
    if (openaiError instanceof Error) {
      if (openaiError.message.includes('401')) {
        throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
      } else if (openaiError.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (openaiError.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your OpenAI account billing.');
      }
    }
    throw new Error('Failed to generate workflow. Please try again.');
  }
}

// Fallback workflow generation for testing/demo purposes
export function generateFallbackWorkflow(formData: WorkflowFormData): GeneratedWorkflow {
  const industryMap = {
    'tech': 'Technology',
    'finance': 'Finance',
    'healthcare': 'Healthcare',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'education': 'Education',
    'real-estate': 'Real Estate',
    'consulting': 'Consulting',
    'marketing': 'Marketing',
    'other': 'Other'
  };

  const goalMap = {
    'book-demo': 'Book a Demo',
    'raise-awareness': 'Raise Awareness',
    'close-deal': 'Close Deal'
  };

  return {
    steps: [
      {
        step: 1,
        subject: `Quick question about ${formData.prospect_company_name}'s ${industryMap[formData.industry]} strategy`,
        body: `Hi ${formData.prospect_full_name},\n\nI noticed ${formData.prospect_company_name} has been making moves in the ${industryMap[formData.industry]} space. As ${formData.prospect_job_title}, you're probably always looking for ways to optimize your processes and drive better results.\n\nI'm ${formData.sender_full_name} from ${formData.sender_company_name}, and I'd love to show you how other ${industryMap[formData.industry]} companies are achieving their goals with our solution.\n\nWould you be open to a brief conversation?\n\nBest regards,\n${formData.sender_full_name}`,
        timing: "Send immediately",
        notes: "Introduction email focusing on industry-specific pain points"
      },
      {
        step: 2,
        subject: `${formData.prospect_company_name} + ${formData.sender_company_name}: Success story inside`,
        body: `Hi ${formData.prospect_full_name},\n\nI wanted to follow up on my previous email about optimizing ${industryMap[formData.industry]} operations.\n\nA similar company in your space was facing challenges with efficiency and growth. After implementing our solution, they:\n• Improved efficiency by 40%\n• Reduced operational costs by 25%\n• Increased customer satisfaction significantly\n\nWould you like to see how this could work for ${formData.prospect_company_name}?\n\nBest,\n${formData.sender_full_name}\n${formData.sender_company_name}`,
        timing: "Send 3 days after step 1",
        notes: "Social proof with specific benefits"
      },
      {
        step: 3,
        subject: `Last attempt: Quick chat about ${formData.prospect_company_name}?`,
        body: `Hi ${formData.prospect_full_name},\n\nI know you're incredibly busy, so I'll keep this brief.\n\nI've reached out a couple of times about how we're helping ${industryMap[formData.industry]} companies like yours achieve better results. If this isn't a priority right now, no worries at all.\n\nBut if you're interested in a quick 15-minute conversation, just reply with a time that works for you.\n\nOtherwise, I'll stop reaching out.\n\nBest,\n${formData.sender_full_name}`,
        timing: "Send 1 week after step 2",
        notes: "Polite final attempt with clear exit"
      },
      {
        step: 4,
        subject: "Thought you'd find this interesting",
        body: `Hi ${formData.prospect_full_name},\n\nI came across this article about ${industryMap[formData.industry]} trends and thought of our previous conversation: [link to relevant article]\n\nThe section on digital transformation particularly reminded me of the challenges many ${formData.prospect_job_title}s face in today's market.\n\nIf you ever want to discuss how this applies to ${formData.prospect_company_name}, I'm here.\n\nBest,\n${formData.sender_full_name}`,
        timing: "Send 2 weeks after step 3",
        notes: "Value-add content to stay top of mind"
      },
      {
        step: 5,
        subject: `Re: Quick question about ${formData.prospect_company_name}'s ${industryMap[formData.industry]} strategy`,
        body: `Hi ${formData.prospect_full_name},\n\nI hope things are going well at ${formData.prospect_company_name}!\n\nI'm checking in one final time about the conversation I mentioned. Several ${industryMap[formData.industry]} companies have reached out recently about similar challenges.\n\nIf you'd like to explore this for ${formData.prospect_company_name}, I'm happy to share some insights. Otherwise, I'll take you off my outreach list.\n\nWishing you continued success,\n${formData.sender_full_name}\n${formData.sender_company_name}`,
        timing: "Send 1 month after step 4",
        notes: "Final follow-up with professional closure"
      }
    ],
    summary: `${formData.tone} 5-step sequence for ${goalMap[formData.goal]} targeting ${industryMap[formData.industry]} ${formData.prospect_job_title}`
  };
}