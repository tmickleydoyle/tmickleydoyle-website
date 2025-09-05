import { NextRequest, NextResponse } from 'next/server'
import { buildAssistantDynamicContext } from '@/lib/context'
import { Ollama } from 'ollama'

const MODEL = process.env.OLLAMA_MODEL || 'gpt-oss:20b'
// Prefer direct host for SDK; derive from OLLAMA_API_URL when provided
const OLLAMA_HOST = 'https://ollama.com'

// Opt-in verbose logging without leaking secrets
const DEBUG = String(process.env.DEBUG_CHAT_API).toLowerCase() === 'true' || process.env.DEBUG_CHAT_API === '1'
const safe = {
  info: (...args: unknown[]) => { if (DEBUG) console.log('[chat]', ...args) },
  error: (...args: unknown[]) => console.error('[chat]', ...args)
}

const SYSTEM_PROMPT = `You are Thomas Doyle's AI assistant embedded in his terminal portfolio website. You help visitors learn about Thomas's professional experience and background.

THOMAS DOYLE PROFILE:

LOCATION: Ithaca, New York, USA - Remote

WORK EXPERIENCE:
• ML Engineering: Building fine-tuned language models to enhance user experience through patterned responses without overwhelming them with text. Focused on fine-tuning models for SQL onboarding to empower co-workers in data exploration. Creating intelligent solutions that streamline learning processes and improve data accessibility across teams with a variety of ML applications.

• Data Platform Design: Designing intuitive data solutions that drive product-led growth by working cross-collaboratively with product, engineering, and business teams. Focusing on simplifying data processing, storage, and analytics adoption across teams. Creating seamless data platforms that enable rapid product iteration and data-driven decision making.

• Data Engineering: Architecting and implementing robust data systems, focusing on scalability and performance. Developing data pipelines, analytics tools, and machine learning models to drive product improvements and business insights.

• Data Science and Analytics: Applying advanced statistical methods and machine learning techniques to solve complex business problems. Translating data insights into actionable strategies, enhancing product features and user experiences.

TECHNICAL PROJECTS & REPOSITORIES:
Based on Thomas's GitHub activity, he has worked on various projects including:
- Chat interfaces and LLM integrations
- Data analysis and visualization tools
- Healthcare chatbot implementations
- Portfolio and personal websites
- Data platform architectures
- ML model fine-tuning projects

PROFESSIONAL BACKGROUND:
- Navy construction experience that sparked passion for hands-on work
- Transition into data science and ML engineering
- Focus on practical, user-centered solutions
- Cross-functional collaboration with product and engineering teams
- Experience in healthcare data and applications

PERSONAL INTERESTS:
• Community Gardener: Passionate about sustainable urban agriculture and mutual aid. Maintaining community gardens, organizing volunteer programs, and sharing skills with local residents about regenerative gardening practices. Contributing to food security initiatives and environmental conservation efforts.

• Construction: Navy construction background sparked a lasting passion for hands-on work. Enjoys DIY projects, home improvements, and helping friends with renovations. Working with hands has become an essential part of who he is.

COMMUNICATION STYLE:
- Keep responses terminal-appropriate (concise, technical when needed)
- Use terminal-style formatting occasionally (like listing with •, -, or >)
- Be helpful and informative about Thomas's experience
- Direct visitors to his GitHub, LinkedIn, or email for deeper conversations
- Keep responses focused and not too verbose
- Maintain a professional but approachable tone
- Reference specific projects or experiences when relevant

CONNECTIONS:
- GitHub: https://github.com/tmickleydoyle (check for latest repositories and commits)
- LinkedIn: https://www.linkedin.com/in/thomas-mickley-doyle/ (professional posts and updates)
- Email: tmickleydoyle@gmail.com

RECENT ACTIVITY:
Thomas is actively working on ML/AI projects, data platform solutions, and maintaining his professional portfolio. He regularly commits to GitHub and shares insights on LinkedIn about data science, ML engineering, and platform design.

Answer questions about Thomas's experience, skills, projects, and background. Help visitors understand his expertise and how he might be a good fit for their needs. When possible, reference his actual work and contributions.`

export async function POST(req: NextRequest) {
  try {
  const { message, history } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    // Initialize Ollama SDK client
    const ollama = new Ollama({
      host: OLLAMA_HOST,
      headers: process.env.OLLAMA_API_KEY ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : undefined
    })

    const dynamicContext = await buildAssistantDynamicContext()
    // Construct chat history (if any)
    const hist = Array.isArray(history) ? (history as Array<{ role: string; content: string }>) : []
    // Compose messages for the Ollama SDK
    const msgs: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${dynamicContext}` },
      ...(
        hist.length
          ? hist.map(h => ({
              role: (h.role === 'assistant' || h.role === 'user' || h.role === 'system') ? (h.role as 'assistant'|'user'|'system') : 'user',
              content: h.content
            }))
          : [{ role: 'user' as const, content: String(message) }]
      )
    ]

    // Log basic configuration (no secrets)
    safe.info('config', {
      host: OLLAMA_HOST,
      MODEL,
      hasAuth: Boolean(process.env.OLLAMA_API_KEY),
      debug: DEBUG,
      initialMessages: msgs.length
    })

    // Stream final answer using the Ollama SDK
    type OllamaStreamPart = { message?: { content?: string } ; content?: string; response?: string }
    let streamIterator: AsyncIterable<OllamaStreamPart>
    safe.info('request.stream', { messages: msgs.length })
    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: msgs,
        stream: true,
        options: { temperature: 0.7, top_p: 0.9, num_ctx: 128000 }
      })
      // response is an AsyncIterable of chat parts
      streamIterator = response as AsyncIterable<OllamaStreamPart>
    } catch (e: unknown) {
      const err = e as { message?: string }
      safe.error('response.stream.error', { message: err?.message })
      return NextResponse.json({ error: `Ollama API error: ${err?.message || 'unknown'}` }, { status: 502 })
    }

    const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let wrote = false
          let loggedFirst = false
          for await (const part of streamIterator) {
            const piece = part?.message?.content ?? part?.content ?? part?.response ?? ''
            if (piece) {
              controller.enqueue(encoder.encode(piece))
              if (!wrote && DEBUG && !loggedFirst) {
                safe.info('stream.firstChunk', { length: piece.length, preview: piece.slice(0, 120) })
                loggedFirst = true
              }
              wrote = true
            }
          }
          // Fallback: if nothing was streamed, try a non-stream request to get content
          if (!wrote) {
            try {
              const obj = await ollama.chat({ model: MODEL, messages: msgs, stream: false, options: { temperature: 0.7, top_p: 0.9, num_ctx: 128000 } })
              const anyObj = obj as unknown as { message?: { content?: string }; content?: string; response?: string }
              const text = anyObj?.message?.content ?? anyObj?.content ?? anyObj?.response ?? ''
              if (text) controller.enqueue(encoder.encode(text))
              safe.info('fallback.response', { hasText: Boolean(text), preview: text.slice(0, 120) })
            } catch {}
          }
        } catch {
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

  } catch (error: unknown) {
    console.error('Chat API Error:', error)
    const err = error as { message?: string; code?: string | number }
    const msg = err?.message || ''
    const code = err?.code

    if (msg.includes('abort') || msg.includes('timeout')) {
      return NextResponse.json({ error: 'Request to model provider timed out' }, { status: 504 })
    }

    if (msg.includes('fetch failed') || msg.includes('Connection refused') || code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: 'Ollama endpoint not reachable. Start a local server (`ollama serve`) or set OLLAMA_API_URL to a reachable <host>/api/chat endpoint.' 
      }, { status: 503 })
    }
    
    if (/model\s+not\s+found/i.test(msg)) {
      return NextResponse.json({ 
        error: 'Model not found. Pull it first (e.g., `ollama pull gpt-oss:120b`) or update OLLAMA_MODEL.' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      error: 'Failed to get response from Ollama' 
    }, { status: 500 })
  }
}