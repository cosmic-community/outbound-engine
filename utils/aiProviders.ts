import { createBucketClient } from '@cosmicjs/sdk'
import { EmailSequenceFormData, GeneratedSequence } from '@/types'

// AI Provider interface
export interface AIProvider {
  name: string
  generateSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence>
  isAvailable(): boolean
}

// Cosmic AI Provider with enhanced capabilities
export class CosmicAIProvider implements AIProvider {
  name = 'Cosmic AI'
  private cosmic: ReturnType<typeof createBucketClient>

  constructor() {
    this.cosmic = createBucketClient({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
      readKey: process.env.COSMIC_READ_KEY as string,
      writeKey: process.env.COSMIC_WRITE_KEY as string,
      apiEnvironment: "staging"
    })
  }

  isAvailable(): boolean {
    return !!(
      process.env.COSMIC_BUCKET_SLUG && 
      process.env.COSMIC_READ_KEY && 
      process.env.COSMIC_WRITE_KEY
    )
  }

  async generateSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence> {
    console.log('Using Enhanced Cosmic AI for sequence generation')

    const prompt = this.buildEnhancedPrompt(formData)
    
    try {
      const response = await this.cosmic.ai.generateText({
        prompt,
        max_tokens: 3000 // Increased for better content
      })

      console.log('Cosmic AI response received, parsing...')
      
      // Parse and validate the response
      const parsedSequence = this.parseResponse(response.text, formData)
      
      if (this.validateSequence(parsedSequence)) {
        console.log('Enhanced Cosmic AI generation successful')
        return parsedSequence
      } else {
        throw new Error('Invalid sequence structure from AI')
      }
    } catch (error) {
      console.error('Cosmic AI generation failed:', error)
      throw new Error(`Cosmic AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Enhanced prompt building with industry-specific insights
  private buildEnhancedPrompt(formData: EmailSequenceFormData): string {
    const industryInsights = this.getIndustryInsights(formData.industry)
    const goalStrategy = this.getGoalStrategy(formData.goal)
    const toneGuidance = this.getToneGuidance(formData.tone)

    return `You are an expert B2B email marketing specialist with deep knowledge of the ${formData.industry} industry. Create a highly personalized 5-step cold email sequence targeting ${formData.full_name}, a ${formData.job_title} at ${formData.company_name}.

CONTEXT ANALYSIS:
- Industry: ${formData.industry} ${industryInsights}
- Target Role: ${formData.job_title}
- Campaign Goal: ${formData.goal} ${goalStrategy}
- Communication Style: ${formData.tone} ${toneGuidance}

SEQUENCE REQUIREMENTS:
Create exactly 5 strategically timed emails:

1. INITIAL OUTREACH (Day 1)
   - Hook: Industry-specific pain point or opportunity
   - Credibility: Brief company introduction
   - Soft CTA: Interest check

2. VALUE DEMONSTRATION (Day 4)
   - Social proof: Industry-relevant case study
   - Specific benefits for ${formData.job_title} role
   - Clear value proposition

3. EDUCATIONAL CONTENT (Day 7)
   - Industry insights or best practices
   - Thought leadership positioning
   - Helpful resource sharing

4. DIRECT ENGAGEMENT (Day 11)
   - Clear meeting request
   - Specific time commitment (15-20 minutes)
   - Multiple response options

5. PROFESSIONAL CLOSE (Day 15)
   - Respectful final attempt
   - Door left open for future
   - Valuable parting gift (resource/insight)

FORMATTING REQUIREMENTS:
- Professional HTML structure with <p> tags
- Subject lines: 6-8 words, compelling but not spammy
- Email body: 80-120 words per email
- Personalization: Use ${formData.full_name} and ${formData.company_name}
- CTA: Clear and specific to ${formData.goal}

Return ONLY this JSON structure:
{
  "steps": [
    {
      "step_number": 1,
      "subject_line": "...",
      "email_body": "<p>Hi ${formData.full_name},</p><p>...</p><p>Best regards,<br/>[Sender Name]</p>",
      "timing": "Day 1 - Initial outreach"
    }
  ],
  "metadata": {
    "prospect_name": "${formData.full_name}",
    "company_name": "${formData.company_name}",
    "tone": "${formData.tone}",
    "goal": "${formData.goal}"
  }
}`
  }

  private getIndustryInsights(industry: string): string {
    const insights: Record<string, string> = {
      'Technology': '- Focus on scalability, automation, and competitive advantage',
      'Healthcare': '- Emphasize compliance, patient outcomes, and efficiency',
      'Finance': '- Highlight security, regulatory compliance, and ROI',
      'Manufacturing': '- Focus on operational efficiency and cost reduction',
      'Retail': '- Emphasize customer experience and sales optimization',
      'Education': '- Focus on student outcomes and administrative efficiency',
      'Real Estate': '- Highlight lead generation and client relationship management'
    }
    
    return insights[industry] || '- Focus on efficiency and growth opportunities'
  }

  private getGoalStrategy(goal: string): string {
    const strategies: Record<string, string> = {
      'book_demo': '- Build curiosity about the product solution',
      'introduce_product': '- Focus on problem-solution fit',
      'close_deal': '- Create urgency and address objections',
      'network': '- Build professional relationship and mutual value',
      'follow_up': '- Maintain momentum from previous interaction'
    }
    
    return strategies[goal] || '- Build trust and demonstrate value'
  }

  private getToneGuidance(tone: string): string {
    const guidance: Record<string, string> = {
      'friendly': '- Warm, approachable, conversational language',
      'formal': '- Professional, respectful, structured communication',
      'direct': '- Concise, clear, action-oriented messaging',
      'funny': '- Light humor, engaging, memorable approach'
    }
    
    return guidance[tone] || '- Professional and engaging communication'
  }

  private parseResponse(text: string, formData: EmailSequenceFormData): GeneratedSequence {
    try {
      // Enhanced parsing with multiple fallback strategies
      let cleanedText = text.trim()
      
      // Remove markdown code blocks
      cleanedText = cleanedText.replace(/