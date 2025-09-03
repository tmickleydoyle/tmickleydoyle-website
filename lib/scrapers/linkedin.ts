// Minimal LinkedIn public page scraper (best-effort). Avoids heavy parsing libs.
// Note: Respect LinkedIn's terms; prefer user-provided summaries or official APIs where possible.

function getMeta(html: string, key: 'name' | 'property', value: string): string | null {
  const re = new RegExp(`<meta[^>]+${key}=["']${value}["'][^>]*>`, 'i')
  const tag = re.exec(html)
  if (!tag) return null
  const contentMatch = /content=["']([^"']+)["']/i.exec(tag[0])
  return contentMatch ? contentMatch[1] : null
}

function getTitle(html: string): string | null {
  const m = /<title>([^<]*)<\/title>/i.exec(html)
  return m ? m[1].trim() : null
}

function tryJsonLd(html: string): string | null {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
  const m = re.exec(html)
  if (!m) return null
  try {
    const json = JSON.parse(m[1])
    const desc = (json?.description as string | undefined) || (json?.headline as string | undefined)
    return desc || null
  } catch {
    return null
  }
}

export async function fetchLinkedInSummary(url: string, timeoutMs = 5000): Promise<string> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      return `LINKEDIN: Failed to fetch (${res.status} ${res.statusText}).`
    }
    const html = await res.text()
    const title = getTitle(html)
    const og = getMeta(html, 'property', 'og:description')
    const meta = getMeta(html, 'name', 'description')
    const tw = getMeta(html, 'name', 'twitter:description')
    const ld = tryJsonLd(html)
    const description = og || meta || tw || ld || 'No public description found.'
    return [
      'LINKEDIN PUBLIC PROFILE:',
      `URL: ${url}`,
      title ? `Title: ${title}` : undefined,
      `Summary: ${description}`
    ].filter(Boolean).join('\n')
  } catch (e: unknown) {
    const msg = (e as { message?: string })?.message || 'unknown error'
    return `LINKEDIN: Fetch error (${msg}).`
  } finally {
    clearTimeout(id)
  }
}
