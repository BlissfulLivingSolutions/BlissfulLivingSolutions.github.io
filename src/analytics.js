/**
 * GA4 analytics module — activates only after explicit user consent.
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
  initSectionReach()
  initLinkTracking()
  initCtaTracking()
}

// ── Page view ────────────────────────────────────────────────

export function trackPageView() {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_location: sanitizeUrl(),
    page_title: document.title,
  })
}

// ── Contact form ─────────────────────────────────────────────

export function trackLeadFormSubmit() {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'lead_form_submit', {
    form_id: 'contact-form',
    page_path: window.location.pathname,
  })
}

// ── CTA clicks ───────────────────────────────────────────────
// Wire by adding data-cta-label (and optionally data-cta-section) to any element.

export function trackCtaClick(label, section = '') {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'cta_click', {
    cta_label: label,
    page_section: section,
    page_path: window.location.pathname,
  })
}

// ── Care pathway tab ─────────────────────────────────────────

export function trackPathwaySelect(pathway_name) {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'pathway_select', {
    pathway_name,
    page_path: window.location.pathname,
  })
}

// ── Cost estimator ───────────────────────────────────────────

export function trackEstimatorInteraction(hours_per_week) {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'estimator_interaction', {
    hours_per_week,
    estimated_weekly_cost: hours_per_week * 32,
    page_path: window.location.pathname,
  })
}

// ── Accordion FAQ ────────────────────────────────────────────

export function trackAccordionOpen(question) {
  if (!ready || typeof window.gtag !== 'function') return
  window.gtag('event', 'faq_open', {
    question: question.slice(0, 100),
    page_path: window.location.pathname,
  })
}

// ── Internal: scroll depth ───────────────────────────────────

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

// ── Internal: key section reach ──────────────────────────────
// Fires once per section when 25% of it enters the viewport.

function initSectionReach() {
  const KEY_SECTIONS = ['services', 'contact', 'how-it-works', 'careers', 'why-us']
  const fired = new Set()

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired.has(entry.target.id)) {
        fired.add(entry.target.id)
        window.gtag('event', 'section_reach', {
          section_id: entry.target.id,
          page_path: window.location.pathname,
        })
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.25 })

  KEY_SECTIONS.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
}

// ── Internal: outbound, email, and phone link clicks ─────────

function initLinkTracking() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const href = link.getAttribute('href') || ''

    if (href.startsWith('mailto:')) {
      window.gtag('event', 'email_click', {
        link_text: (link.textContent || '').trim().slice(0, 80),
        page_path: window.location.pathname,
      })
      return
    }

    if (href.startsWith('tel:')) {
      window.gtag('event', 'phone_click', {
        page_path: window.location.pathname,
      })
      return
    }

    // Outbound HTTP links
    if (href.startsWith('http')) {
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
    }
  })
}

// ── Internal: CTA delegated listener ────────────────────────
// Picks up any element with [data-cta-label] in the DOM.

function initCtaTracking() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-cta-label]')
    if (!el) return
    trackCtaClick(
      el.dataset.ctaLabel,
      el.dataset.ctaSection || '',
    )
  })
}
