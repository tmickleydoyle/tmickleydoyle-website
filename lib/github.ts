type Repo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  default_branch?: string
}

type ContentItem = {
  name: string
  path: string
  type: 'file' | 'dir' | 'symlink' | 'submodule'
  size: number
  sha: string
  html_url?: string
}

const BASE = 'https://api.github.com'

function headers() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return h
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers(), cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`)
  return (await res.json()) as T
}

export async function listUserRepos(user: string, limit = 50): Promise<Repo[]> {
  const url = `${BASE}/users/${user}/repos?sort=updated&per_page=${Math.min(limit, 100)}`
  return await getJson<Repo[]>(url)
}

export async function listRepoContents(owner: string, repo: string, path = ''): Promise<ContentItem[]> {
  const normPath = path.replace(/^\/+|\/+$/g, '')
  const url = `${BASE}/repos/${owner}/${repo}/contents/${normPath}`.replace(/\/$/, '')
  const data = await getJson<ContentItem | ContentItem[]>(url)
  return Array.isArray(data) ? data : [data]
}

export async function getFileText(owner: string, repo: string, path: string): Promise<string> {
  const normPath = path.replace(/^\/+/, '')
  const url = `${BASE}/repos/${owner}/${repo}/contents/${normPath}`
  const res = await fetch(url, { headers: headers(), cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`)
  const json = (await res.json()) as { content?: string; encoding?: string; size?: number }
  if (!json.content) throw new Error('No content in response')
  const buf = Buffer.from(json.content, json.encoding === 'base64' ? 'base64' : 'utf8')
  // Cap very large files
  const MAX = 100 * 1024
  return buf.length > MAX ? buf.subarray(0, MAX).toString('utf8') + '\n\n[truncated]' : buf.toString('utf8')
}
