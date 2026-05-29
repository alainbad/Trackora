import { useEffect } from 'react'

interface SEOProps {
  title:       string
  description: string
  canonical?:  string
  ogType?:     string
}

/**
 * Updates the document <title> and key meta tags on each route change.
 * Works without react-helmet — directly mutates the tags set in index.html.
 */
export function useSEO({ title, description, canonical, ogType = 'website' }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title

    const set = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    // Primary
    set('meta[name="description"]',               'content', description)

    // Open Graph
    set('meta[property="og:title"]',              'content', title)
    set('meta[property="og:description"]',        'content', description)
    set('meta[property="og:type"]',               'content', ogType)
    if (canonical) set('meta[property="og:url"]', 'content', canonical)

    // Twitter
    set('meta[name="twitter:title"]',             'content', title)
    set('meta[name="twitter:description"]',       'content', description)

    // Canonical
    if (canonical) {
      const link = document.querySelector('link[rel="canonical"]')
      if (link) link.setAttribute('href', canonical)
    }
  }, [title, description, canonical, ogType])
}
