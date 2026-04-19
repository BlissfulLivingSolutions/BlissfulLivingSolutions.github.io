/**
 * Cookie consent banner — BASIC consent mode.
 * No GA script loads until the visitor explicitly accepts.
 */

import { initGA } from './analytics.js'

const STORAGE_KEY = 'bls_cookie_consent'
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function getConsent() {
  return localStorage.getItem(STORAGE_KEY) // 'granted' | 'denied' | null
}

function setConsent(value) {
  localStorage.setItem(STORAGE_KEY, value)
}

export function initConsentBanner() {
  if (!MEASUREMENT_ID) return

  const consent = getConsent()

  if (consent === 'granted') {
    initGA()
    return
  }

  if (consent === 'denied') return

  // No prior choice — show the banner
  showBanner()
}

export function showCookiePreferences() {
  if (!MEASUREMENT_ID) return
  showBanner()
}

function showBanner() {
  const existing = document.getElementById('cookie-banner')
  if (existing) {
    existing.removeAttribute('hidden')
    existing.querySelector('.cookie-banner-accept')?.focus()
    return
  }

  const banner = document.createElement('div')
  banner.id = 'cookie-banner'
  banner.className = 'cookie-banner'
  banner.setAttribute('role', 'dialog')
  banner.setAttribute('aria-label', 'Cookie preferences')
  banner.innerHTML = `
    <div class="cookie-banner-inner">
      <p class="cookie-banner-text">
        We use optional analytics cookies to understand how visitors use this site and improve it over time.
        See our <a href="/privacy-policy.html" class="cookie-banner-link">Privacy Policy</a>.
      </p>
      <div class="cookie-banner-actions">
        <button class="btn btn-primary cookie-banner-accept">Accept Analytics</button>
        <button class="btn btn-outline cookie-banner-decline">Decline</button>
      </div>
    </div>
  `

  document.body.appendChild(banner)

  const acceptBtn = banner.querySelector('.cookie-banner-accept')
  const declineBtn = banner.querySelector('.cookie-banner-decline')

  acceptBtn.addEventListener('click', () => {
    setConsent('granted')
    hideBanner(banner)
    initGA()
  })

  declineBtn.addEventListener('click', () => {
    setConsent('denied')
    hideBanner(banner)
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' })
    }
  })

  requestAnimationFrame(() => acceptBtn.focus())
}

function hideBanner(banner) {
  banner.setAttribute('hidden', '')
}
