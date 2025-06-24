import { EmailSequenceFormData, GeneratedSequence } from '@/types'

interface ToneConfig {
  greeting: string
  closing: string
  style: string
}

interface GoalConfig {
  focus: string
  cta: string
  value: string
}

const toneAdjustments: Record<string, ToneConfig> = {
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
}

const goalTemplates: Record<string, GoalConfig> = {
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
}

export function generateSequenceFromTemplate(formData: EmailSequenceFormData): GeneratedSequence {
  const { tone, goal, full_name, company_name, industry } = formData
  
  const toneConfig = toneAdjustments[tone] || toneAdjustments.friendly
  const goalConfig = goalTemplates[goal] || goalTemplates.book_demo

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
  ]

  return {
    steps,
    metadata: {
      prospect_name: full_name,
      company_name: company_name,
      tone: tone,
      goal: goal
    }
  }
}

export function validateSequenceData(sequence: GeneratedSequence): boolean {
  if (!sequence.steps || !Array.isArray(sequence.steps)) {
    return false
  }

  if (sequence.steps.length === 0) {
    return false
  }

  for (const step of sequence.steps) {
    if (!step.step_number || !step.subject_line || !step.email_body) {
      return false
    }
  }

  return true
}