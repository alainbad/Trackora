import { useEffect } from 'react'

interface SEOProps {
  title:       string
  description: string
  canonical?:  string
  ogType?:     string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonLd?:     Record<string, any> | Record<string, any>[]
}

/**
 * Updates the document <title> and key meta tags on each route change.
 * Works without react-helmet — directly mutates the tags set in index.html.
 * Pass jsonLd to inject page-specific structured data (removed on unmount).
 */
export function useSEO({ title, description, canonical, ogType = 'website', jsonLd }: SEOProps) {
  useEffect(() => {
    document.title = title

    const set = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    set('meta[name="description"]',               'content', description)
    set('meta[property="og:title"]',              'content', title)
    set('meta[property="og:description"]',        'content', description)
    set('meta[property="og:type"]',               'content', ogType)
    if (canonical) set('meta[property="og:url"]', 'content', canonical)
    set('meta[name="twitter:title"]',             'content', title)
    set('meta[name="twitter:description"]',       'content', description)

    if (canonical) {
      const link = document.querySelector('link[rel="canonical"]')
      if (link) link.setAttribute('href', canonical)
    }
  }, [title, description, canonical, ogType])

  // Inject / remove page-specific JSON-LD
  useEffect(() => {
    if (!jsonLd) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id   = 'page-jsonld'
    script.textContent = JSON.stringify(jsonLd)
    // Remove any previous page-level JSON-LD first
    document.getElementById('page-jsonld')?.remove()
    document.head.appendChild(script)
    return () => { document.getElementById('page-jsonld')?.remove() }
  }, [jsonLd])
}
