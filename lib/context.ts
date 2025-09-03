// Builds dynamic assistant context from GitHub and an optional LinkedIn summary file.
// Caches results in-memory to avoid rate limits.

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fetchLinkedInSummary } from '@/lib/scrapers/linkedin'

type GitHubRepo = {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  html_url: string
  topics?: string[]
}

type GitHubUser = {
  name: string | null
  bio: string | null
  html_url: string
  public_repos: number
  followers: number
  following: number
}

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes
let cache: { value: string; expiresAt: number } | null = null

async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${url}`)
  return (await res.json()) as T
}

async function getGitHubContext(username: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const base = 'https://api.github.com'
    const [user, repos] = await Promise.all([
      fetchJson<GitHubUser>(`${base}/users/${username}`, headers),
      fetchJson<GitHubRepo[]>(`${base}/users/${username}/repos?sort=updated&per_page=5`, headers)
    ])

    // try to fetch topics for each repo (best-effort)
    const reposWithTopics = await Promise.all(
      repos.map(async (r) => {
        try {
          const topics = await fetchJson<{ names: string[] }>(`${base}/repos/${username}/${r.name}/topics`, {
            ...headers,
            Accept: 'application/vnd.github.mercy-preview+json'
          })
          return { ...r, topics: topics.names }
        } catch {
          return r
        }
      })
    )

    const repoLines = reposWithTopics.map((r) =>
      `- ${r.name}${r.language ? ` (${r.language})` : ''}${r.stargazers_count ? ` ★${r.stargazers_count}` : ''}: ${r.description ?? 'no description'}${r.topics && r.topics.length ? ` [topics: ${r.topics.slice(0, 6).join(', ')}]` : ''} — ${r.html_url}`
    )

    const profile = [
      `Name: ${user.name ?? 'N/A'}`,
      `Bio: ${user.bio ?? 'N/A'}`,
      `GitHub: ${user.html_url}`,
      `Public Repos: ${user.public_repos}, Followers: ${user.followers}, Following: ${user.following}`
    ].join('\n')

    return [
      'GITHUB PROFILE:',
      profile,
      '',
      'RECENTLY UPDATED REPOS (last 5):',
      ...repoLines
    ].join('\n')
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message || 'unknown error'
    return `GITHUB: Failed to fetch live data (${msg}). Use general knowledge of the profile.`
  }
}

function getLinkedInContext(): string {
  try {
    const filePath = join(process.cwd(), 'static', 'linkedin-summary.md')
    if (existsSync(filePath)) {
      const md = readFileSync(filePath, 'utf8')
      return `LINKEDIN SUMMARY (user-provided):\n${md.trim()}`
    }
  } catch {
    // ignore
  }
  return 'LINKEDIN: No summary file found. Add static/linkedin-summary.md to enrich answers.'
}

export async function buildAssistantDynamicContext(): Promise<string> {
  if (cache && cache.expiresAt > Date.now()) return cache.value

  const github = await getGitHubContext('tmickleydoyle')
  const linkedin = getLinkedInContext()
  let linkedinLive = ''
  if (process.env.LINKEDIN_SCRAPE === 'true') {
    const url = process.env.LINKEDIN_PROFILE_URL || 'https://www.linkedin.com/in/thomas-mickley-doyle/'
    linkedinLive = await fetchLinkedInSummary(url).catch(() => '')
  }

  const value = [
    'LIVE CONTEXT (refreshed ~10m):',
    github,
    '',
    linkedin,
    linkedinLive ? `\n${linkedinLive}` : ''
  ].join('\n')

  cache = { value, expiresAt: Date.now() + CACHE_TTL_MS }
  return value
}
