import { NextRequest, NextResponse } from 'next/server'
import { buildAssistantDynamicContext } from '@/lib/context'
import { listUserRepos, listRepoContents, getFileText } from '@/lib/github'

const API_URL = process.env.OLLAMA_API_URL || 'http://ollama.com/api/chat'
const MODEL = process.env.OLLAMA_MODEL || 'gpt-oss:20b'

const SYSTEM_PROMPT = `You are Thomas Mickley-Doyle's AI assistant embedded in his terminal portfolio website. You help visitors learn about Thomas's professional experience and background.

THOMAS MICKLEY-DOYLE PROFILE:

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
    // Ensure API_URL points to the chat endpoint
    if (!/\/api\/chat(\/?|$)/i.test(API_URL)) {
      return NextResponse.json({
        error: `Invalid OLLAMA_API_URL: ${API_URL}. It must point to <host>/api/chat (e.g., http://localhost:11434/api/chat).`
      }, { status: 500 })
    }

    const dynamicContext = await buildAssistantDynamicContext()

    // Construct chat history (if any)
    const hist = Array.isArray(history) ? (history as Array<{ role: string; content: string }>) : []
    const owner = 'tmickleydoyle'

    // Tool specifications for the model (OpenAI-style function tools)
    const TOOLS = [
      {
        type: 'function',
        function: {
          name: 'list_user_repos',
          description: 'List recent GitHub repositories for a user.',
          parameters: {
            type: 'object',
            properties: {
              user: { type: 'string', description: 'GitHub username. Defaults to tmickleydoyle.' },
              limit: { type: 'number', description: 'Max repos to return (1-100). Default 30.' }
            },
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'list_repo_contents',
          description: 'List files and folders in a GitHub repository at an optional path.',
          parameters: {
            type: 'object',
            properties: {
              owner: { type: 'string', description: 'Repo owner. Defaults to tmickleydoyle.' },
              repo: { type: 'string', description: 'Repository name.' },
              path: { type: 'string', description: 'Optional folder path. Default root.' }
            },
            required: ['repo']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_file_text',
          description: 'Fetch the text content of a file in a GitHub repository. If repo is omitted, the server will try to infer it from recent context.',
          parameters: {
            type: 'object',
            properties: {
              owner: { type: 'string', description: 'Repo owner. Defaults to tmickleydoyle.' },
              repo: { type: 'string', description: 'Repository name (optional; inferred from context when missing).' },
              path: { type: 'string', description: 'File path within the repository.' }
            },
            required: ['path']
          }
        }
      }
    ] as const

    // Helper to infer a repo name mentioned in conversation for ambiguous tool args
    const inferRepoName = async (): Promise<string | undefined> => {
      try {
        const repos = await listUserRepos(owner, 50)
        const candidates = repos.map(r => r.name.toLowerCase())
        const corpus = `${hist.map(h => h.content).join('\n').toLowerCase()}\n${String(message).toLowerCase()}`
        let best: { name?: string; idx: number } = { idx: -1 }
        for (const name of candidates) {
          const idx = corpus.lastIndexOf(name)
          if (idx > best.idx) best = { name, idx }
        }
        return best.name
      } catch {
        return undefined
      }
    }

    type ToolCall = { id?: string; type?: string; function?: { name: string; arguments?: string } }

    const executeTool = async (call: ToolCall): Promise<string> => {
      const fn = call?.function
      if (!fn?.name) return 'Tool error: missing function name.'
      const args = (() => { try { return fn.arguments ? JSON.parse(fn.arguments) : {} } catch { return {} } })()
      switch (fn.name) {
        case 'list_user_repos': {
          const user = typeof args.user === 'string' && args.user.trim() ? args.user.trim() : owner
          let limit = typeof args.limit === 'number' ? args.limit : 30
          if (!Number.isFinite(limit) || limit < 1) limit = 30
          if (limit > 100) limit = 100
          const repos = await listUserRepos(user, limit)
          const lines = repos.map(r => `- ${r.name}${r.language ? ` (${r.language})` : ''}${r.description ? ` — ${r.description}` : ''}`)
          return ['Recent repositories:', ...lines].join('\n')
        }
        case 'list_repo_contents': {
          let repo = String(args.repo || '').trim()
          if (!repo) {
            const inferred = await inferRepoName()
            if (inferred) repo = inferred
          }
          if (!repo) return 'Error: repo is required (try specifying it or mention it in context).'
          const repoOwner = String(args.owner || owner)
          const path = String(args.path || '')
          const items = await listRepoContents(repoOwner, repo, path)
          const lines = items.map(i => `${i.type === 'dir' ? '📁' : '📄'} ${i.path}`)
          return [`Contents of ${repoOwner}/${repo}${path ? '/' + path : ''}:`, ...lines].join('\n')
        }
        case 'get_file_text': {
          let repo = String(args.repo || '').trim()
          const repoOwner = String(args.owner || owner)
          const path = String(args.path || '').trim()
          if (!repo) {
            const inferred = await inferRepoName()
            if (inferred) repo = inferred
          }
          if (!repo || !path) return 'Error: repo and path are required (try specifying the repository or mention it in context).'
          const text = await getFileText(repoOwner, repo, path)
          return `File: ${repoOwner}/${repo}/${path}\n\n${text}`
        }
        default:
          return `Tool error: unknown function ${fn.name}`
      }
    }

  type ChatMsg = { role: string; content?: string; name?: string; tool_call_id?: string; tool_calls?: Array<{ id?: string; type?: string; function?: { name: string; arguments?: string } }> }
  const baseMessages: ChatMsg[] = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${dynamicContext}\n\nTOOLS AVAILABLE:\n- list_user_repos(user?, limit?)\n- list_repo_contents(owner?, repo, path?)\n- get_file_text(owner?, repo, path)\nUse tools when needed to answer precisely. If the repository is ambiguous, ask the user or infer from context.` },
      ...(hist.length ? hist : [{ role: 'user', content: message }])
  ]

    // Agent loop: let the model call tools (non-stream), then stream the final answer
  let msgs: Array<{ role: string; content?: string; name?: string; tool_call_id?: string; tool_calls?: ToolCall[] }> = [...baseMessages]
    const maxIters = 3

    for (let iter = 0; iter < maxIters; iter++) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)
      const httpRes = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; NextJS-App)',
          'Origin': 'https://tmickleydoyle.vercel.app',
          ...(process.env.OLLAMA_API_KEY ? { 'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}` } : {})
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL,
          messages: msgs,
          tools: TOOLS,
          tool_choice: 'auto',
          options: { temperature: 0.7, top_p: 0.9, num_ctx: 128000 },
          stream: false
        })
      })
      clearTimeout(timeoutId)

      if (!httpRes.ok) {
        const text = await httpRes.text().catch(() => '')
        console.error(`Ollama API error - Status: ${httpRes.status}, Response: ${text}`)
        return NextResponse.json({
          error: `Remote Ollama API error: ${httpRes.status} ${httpRes.statusText}${text ? ` - ${text}` : ''}`
        }, { status: httpRes.status })
      }
      const raw = await httpRes.json().catch(() => ({}))
      const obj = raw as { message?: { content?: string; tool_calls?: ToolCall[] }; content?: string; response?: string; tool_calls?: ToolCall[] }
      const assistantMsg = obj?.message
      const toolCalls: ToolCall[] = assistantMsg?.tool_calls || obj?.tool_calls || []

      if (toolCalls.length > 0) {
        // Append the assistant message containing tool_calls so tool results can reference call IDs
        msgs = [...msgs, { role: 'assistant', content: assistantMsg?.content ?? '', tool_calls: toolCalls }]
        // Execute tools and append their outputs
        for (const call of toolCalls) {
          try {
            const result = await executeTool(call)
            msgs = [...msgs, { role: 'tool', content: result, name: call.function?.name, tool_call_id: call.id }]
          } catch (e: unknown) {
            const errMsg = (e as { message?: string })?.message || 'Tool execution failed.'
            msgs = [...msgs, { role: 'tool', content: `Error: ${errMsg}`, name: call.function?.name, tool_call_id: call.id }]
          }
        }
        continue
      }
      // No tools requested; proceed to final streaming answer
      break
    }

    // Final streaming answer using the accumulated messages (with any tool outputs)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000)
  const httpRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-App)',
        'Origin': 'https://your-vercel-domain.vercel.app',
        ...(process.env.OLLAMA_API_KEY ? { 'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}` } : {})
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
  messages: msgs,
        options: { temperature: 0.7, top_p: 0.9, num_ctx: 128000 },
        stream: true
      })
    })
    clearTimeout(timeoutId)

    if (!httpRes.ok) {
      const text = await httpRes.text().catch(() => '')
      console.error(`Ollama streaming API error - Status: ${httpRes.status}, Response: ${text}`)
      return NextResponse.json({
        error: `Remote Ollama API error: ${httpRes.status} ${httpRes.statusText}${text ? ` - ${text}` : ''}`
      }, { status: httpRes.status })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const reader = httpRes.body?.getReader()
          if (!reader) { controller.close(); return }
          let buffer = ''
          let wrote = false
             while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk
            let idx
            while ((idx = buffer.indexOf('\n')) !== -1) {
               let line = buffer.slice(0, idx).trim()
              buffer = buffer.slice(idx + 1)
              if (!line) continue
                 if (line.startsWith('data:')) line = line.slice(5).trim()
              try {
                const o = JSON.parse(line) as { message?: { content?: string }, content?: string, response?: string }
                const piece = o?.message?.content ?? o?.content ?? o?.response ?? ''
                if (piece) { controller.enqueue(encoder.encode(piece)); wrote = true }
              } catch {}
            }
          }
          const tail = buffer.trim()
          if (tail) {
            try {
               const jsonTail = tail.startsWith('data:') ? tail.slice(5).trim() : tail
               const o = JSON.parse(jsonTail) as { message?: { content?: string }, content?: string, response?: string }
              const piece = o?.message?.content ?? o?.content ?? o?.response ?? ''
              if (piece) { controller.enqueue(encoder.encode(piece)); wrote = true }
            } catch {}
          }
          // Fallback: if nothing was streamed, try a non-stream request to get content
          if (!wrote) {
            try {
              const fallbackRes = await fetch(API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (compatible; NextJS-App)',
                  'Origin': 'https://tmickleydoyle.vercel.app',
                  ...(process.env.OLLAMA_API_KEY ? { 'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}` } : {})
                },
                body: JSON.stringify({ model: MODEL, messages: msgs, options: { temperature: 0.7, top_p: 0.9, num_ctx: 128000 }, stream: false })
              })
              if (fallbackRes.ok) {
                const obj = await fallbackRes.json().catch(() => ({})) as { message?: { content?: string }, content?: string, response?: string }
                const text = obj?.message?.content ?? obj?.content ?? obj?.response ?? ''
                if (text) controller.enqueue(encoder.encode(text))
              }
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