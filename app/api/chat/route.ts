import { NextRequest, NextResponse } from 'next/server'
import { buildAssistantDynamicContext } from '@/lib/context'

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_KEY_API_URL || 'https://ollama.com/api/chat'
    const MODEL = 'gpt-oss:20b-cloud'
    const API_KEY = process.env.NEXT_NEXT_PUBLIC_OLLAMA_API_KEY

    const systemPrompt = `You are Thomas Mickley-Doyle's AI assistant embedded in his terminal portfolio website. You help visitors learn about Thomas's professional experience and background.

IMPORTANT: You ONLY answer questions about Thomas Mickley-Doyle. If users ask unrelated questions (like "How to mine bitcoin?" or "What is the population of Iceland?"), respond with:

"This agent is designed specifically to answer questions about Thomas Mickley-Doyle - his professional background, experience, skills, and career. 

For example, you could ask:
- 'What is Thomas's professional background?'
- 'What technologies does Thomas work with?'
- 'What projects has Thomas worked on?'

Please ask a question related to Thomas Mickley-Doyle."

THOMAS MICKLEY-DOYLE PROFILE:
LOCATION: Ithaca, New York, USA - Remote

WORK EXPERIENCE:
• ML Engineering: Building fine-tuned language models to enhance user experience through patterned responses without overwhelming them with text. Focused on fine-tuning models for SQL onboarding to empower co-workers in data exploration.
• Data Platform Design: Designing intuitive data solutions that drive product-led growth by working cross-collaboratively with product, engineering, and business teams.
• Data Engineering: Architecting and implementing robust data systems, focusing on scalability and performance.
• Data Science and Analytics: Applying advanced statistical methods and machine learning techniques to solve complex business problems.

Answer questions about Thomas's experience, skills, projects, and background. Keep responses terminal-appropriate and concise.

RESPONSE STYLE:
- Use conversational, natural language format - avoid markdown tables unless absolutely necessary
- Present information in readable paragraphs and bullet points
- Focus on being conversational and easy to read rather than structured data presentation
- Only use tables when the information truly requires tabular comparison`

    const dynamicContext = await buildAssistantDynamicContext()
    const fullSystemPrompt = `${systemPrompt}\n\n${dynamicContext}`

    const hist = Array.isArray(history) ? history : []
    const msgs = [
      { role: 'system', content: fullSystemPrompt },
      ...hist.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ]

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`
    }

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: MODEL,
        messages: msgs,
        stream: true,
        options: { 
          temperature: 0.7, 
          top_p: 0.9, 
          num_ctx: 128000 
        }
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Ollama API error: ${response.status} ${response.statusText}` 
      }, { status: response.status })
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
