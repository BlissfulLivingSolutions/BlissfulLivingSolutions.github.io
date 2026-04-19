/**
 * GA4 analytics module — loads only after explicit user consent.
 * All events sanitize URLs (origin + pathname only) before sending.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let ready = false

export function sanitizeUrl() {
  return window.location.origin + window.location.pathname
}

export function initGA() {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('consent', 'update', { analytics_storage: 'granted' })
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  ready = true

  trackPageView()
  initScrollDepth()
  initOutboundClicks()
}

export function trackPageView() {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_location: sanitizeUrl(),
    page_title: document.title,
  })
}

export function trackLeadFormSubmit() {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'lead_form_submit', {
    form_id: 'contact-form',
    page_path: window.location.pathname,
  })
}

function initScrollDepth() {
  const milestones = [50, 90]
  const fired = new Set()

  function check() {
    const scrolled = window.scrollY + window.innerHeight
    const total = document.documentElement.scrollHeight
    const pct = (scrolled / total) * 100

    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m)
        window.gtag('event', 'scroll_depth', {
          percent_scrolled: m,
          page_path: window.location.pathname,
        })
      }
    }

    if (fired.size === milestones.length) {
      window.removeEventListener('scroll', check)
    }
  }

  window.addEventListener('scroll', check, { passive: true })
}

function initOutboundClicks() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="http"]')
    if (!link) return

    try {
      const parsed = new URL(link.href)
      if (parsed.hostname === location.hostname) return

      window.gtag('event', 'outbound_click', {
        link_url: parsed.origin + parsed.pathname,
        link_domain: parsed.hostname,
        link_text: (link.textContent || '').trim().slice(0, 80),
      })
    } catch {
      // unparseable URL — skip
    }
  })
}
