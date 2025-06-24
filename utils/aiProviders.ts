import { createBucketClient } from '@cosmicjs/sdk'
import { EmailSequenceFormData, GeneratedSequence } from '@/types'

// AI Provider interface
export interface AIProvider {
  name: string
  generateSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence>
  isAvailable(): boolean
}

// Cosmic AI Provider
export class CosmicAIProvider implements AIProvider {
  name = 'Cosmic AI'
  private cosmic: ReturnType<typeof createBucketClient>

  constructor() {
    this.cosmic = createBucketClient({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
      readKey: process.env.COSMIC_READ_KEY as string,
      writeKey: process.env.COSMIC_WRITE_KEY as string,
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
    console.log('Using Cosmic AI for sequence generation')

    const prompt = this.buildPrompt(formData)
    
    try {
      const response = await this.cosmic.ai.generateText({
        prompt,
        max_tokens: 2000
      })

      console.log('Cosmic AI response received, parsing...')
      
      // Parse and validate the response
      const parsedSequence = this.parseResponse(response.text, formData)
      
      if (this.validateSequence(parsedSequence)) {
        console.log('Cosmic AI generation successful')
        return parsedSequence
      } else {
        throw new Error('Invalid sequence structure from AI')
      }
    } catch (error) {
      console.error('Cosmic AI generation failed:', error)
      throw new Error(`Cosmic AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private buildPrompt(formData: EmailSequenceFormData): string {
    return `Create a professional 5-step cold email sequence for reaching out to ${formData.full_name}, who is a ${formData.job_title} at ${formData.company_name} in the ${formData.industry} industry.

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
}`
  }

  private parseResponse(text: string, formData: EmailSequenceFormData): GeneratedSequence {
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : text
      const parsed = JSON.parse(jsonText)
      
      // Ensure metadata is properly set
      if (!parsed.metadata) {
        parsed.metadata = {
          prospect_name: formData.full_name,
          company_name: formData.company_name,
          tone: formData.tone,
          goal: formData.goal
        }
      }
      
      return parsed as GeneratedSequence
    } catch (error) {
      throw new Error('Failed to parse AI response as JSON')
    }
  }

  private validateSequence(sequence: GeneratedSequence): boolean {
    if (!sequence.steps || !Array.isArray(sequence.steps)) {
      return false
    }

    if (sequence.steps.length === 0) {
      return false
    }

    return sequence.steps.every(step => 
      step.step_number && 
      step.subject_line && 
      step.email_body && 
      step.timing
    )
  }
}

// AI Provider Manager
export class AIProviderManager {
  private providers: AIProvider[] = []
  private currentProvider: AIProvider | null = null

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders(): void {
    // Add Cosmic AI provider
    const cosmicProvider = new CosmicAIProvider()
    if (cosmicProvider.isAvailable()) {
      this.providers.push(cosmicProvider)
      this.currentProvider = cosmicProvider
    }

    console.log(`Initialized ${this.providers.length} AI providers`)
    console.log(`Current provider: ${this.currentProvider?.name || 'None'}`)
  }

  async generateSequence(formData: EmailSequenceFormData): Promise<GeneratedSequence> {
    if (!this.currentProvider) {
      throw new Error('No AI provider available')
    }

    console.log(`Generating sequence with ${this.currentProvider.name}`)
    
    try {
      return await this.currentProvider.generateSequence(formData)
    } catch (error) {
      console.error(`${this.currentProvider.name} failed:`, error)
      
      // Try other providers as fallback
      for (const provider of this.providers) {
        if (provider !== this.currentProvider) {
          try {
            console.log(`Trying fallback provider: ${provider.name}`)
            return await provider.generateSequence(formData)
          } catch (fallbackError) {
            console.error(`Fallback provider ${provider.name} failed:`, fallbackError)
          }
        }
      }
      
      throw new Error('All AI providers failed')
    }
  }

  getAvailableProviders(): string[] {
    return this.providers.map(p => p.name)
  }

  getCurrentProvider(): string | null {
    return this.currentProvider?.name || null
  }

  hasAvailableProviders(): boolean {
    return this.providers.length > 0
  }
}

// Export singleton instance
export const aiProviderManager = new AIProviderManager()