/**
 * Blissful Living Solutions — Main Script
 */

import './styles/main.css'
import { initConsentBanner, showCookiePreferences } from './consent-banner.js'
import { trackLeadFormSubmit } from './analytics.js'

document.addEventListener('DOMContentLoaded', () => {
  initBanner()
  initMobileNav()
  initScrollHeader()
  initSmoothScroll()
  initActiveNav()
  initScrollReveal()
  initPathwayExplorer()
  initCostEstimator()
  initAccordion()
  initContactForm()
  initConsentBanner()
  initCookiePrefsButtons()
})

function initCookiePrefsButtons() {
  document.querySelectorAll('[data-cookie-prefs]').forEach(el => {
    el.addEventListener('click', showCookiePreferences)
  })
}

/* ── Licensing Banner ─────────────────────────────────────── */
function initBanner() {
  const banner  = document.getElementById('licensing-banner')
  const closeBtn = document.getElementById('close-banner')
  if (!banner || !closeBtn) return

  closeBtn.addEventListener('click', () => {
    banner.classList.add('hidden')
  })
}

/* ── Mobile Navigation Overlay ───────────────────────────── */
function initMobileNav() {
  const toggle  = document.querySelector('.nav-toggle')
  const overlay = document.getElementById('mobile-nav-overlay')
  const closeBtn = document.getElementById('mobile-nav-close')
  if (!toggle || !overlay) return

  const open = () => {
    overlay.classList.add('open')
    toggle.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    overlay.classList.remove('open')
    toggle.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  }

  toggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? close() : open()
  })

  if (closeBtn) closeBtn.addEventListener('click', close)

  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', close))

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close()
  })
}

/* ── Scroll-Aware Header ─────────────────────────────────── */
function initScrollHeader() {
  const header = document.getElementById('site-header')
  if (!header) return

  const update = () => header.classList.toggle('scrolled', window.scrollY > 60)
  window.addEventListener('scroll', update, { passive: true })
  update()
}

/* ── Smooth Scroll with Sticky Header Offset ─────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href')
      if (targetId === '#') return
      const target = document.querySelector(targetId)
      if (!target) return

      e.preventDefault()
      const headerHeight = document.getElementById('site-header')?.offsetHeight ?? 72
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16

      window.scrollTo({ top, behavior: 'smooth' })
    })
  })
}

/* ── Active Nav Link on Scroll ───────────────────────────── */
function initActiveNav() {
  const sections  = document.querySelectorAll('main section[id]')
  const navLinks  = document.querySelectorAll('.nav-list a, .mobile-nav-list a')
  if (!sections.length || !navLinks.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        })
      }
    })
  }, { rootMargin: '-15% 0px -75% 0px' })

  sections.forEach(s => observer.observe(s))
}

/* ── Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger')
  if (!targets.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.08 })

  targets.forEach(el => observer.observe(el))
}

/* ── Care Pathway Explorer ───────────────────────────────── */
function initPathwayExplorer() {
  const buttons  = document.querySelectorAll('.pathway-btn')
  const contents = document.querySelectorAll('.pathway-content')
  if (!buttons.length || !contents.length) return

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b  => b.classList.remove('active'))
      contents.forEach(c => c.classList.remove('active'))

      btn.classList.add('active')
      const target = document.getElementById(btn.dataset.target)
      if (target) target.classList.add('active')
    })
  })
}

/* ── Cost Estimator ──────────────────────────────────────── */
function initCostEstimator() {
  const slider       = document.getElementById('hours-range')
  const hoursDisplay = document.getElementById('hours-display')
  const weeklyEl     = document.getElementById('weekly-cost')
  const monthlyEl    = document.getElementById('monthly-cost')
  if (!slider) return

  const HOURLY_RATE = 32

  function update() {
    const hours   = parseInt(slider.value, 10)
    const weekly  = hours * HOURLY_RATE
    const monthly = weekly * 4

    if (hoursDisplay) hoursDisplay.textContent = hours
    if (weeklyEl)     weeklyEl.textContent  = `$${weekly.toLocaleString()}`
    if (monthlyEl)    monthlyEl.textContent = `$${monthly.toLocaleString()}`

    // Update the CSS custom property for the track fill
    const pct = ((hours - parseInt(slider.min, 10)) / (parseInt(slider.max, 10) - parseInt(slider.min, 10))) * 100
    slider.style.setProperty('--range-pct', `${pct}%`)
  }

  slider.addEventListener('input', update)
  update()
}

/* ── Accordion ───────────────────────────────────────────── */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content    = header.nextElementSibling
      const iconEl     = header.querySelector('.accordion-icon')
      const isExpanded = header.getAttribute('aria-expanded') === 'true'

      header.setAttribute('aria-expanded', String(!isExpanded))
      content.classList.toggle('active', !isExpanded)
      if (iconEl) iconEl.textContent = !isExpanded ? '−' : '+'
    })
  })
}

/* ── Contact Form (mailto) ───────────────────────────────── */
function initContactForm() {
  const form     = document.getElementById('contact-form')
  const feedback = document.getElementById('form-feedback')
  if (!form) return

  form.addEventListener('submit', e => {
    e.preventDefault()

    const name    = document.getElementById('name')?.value.trim()
    const email   = document.getElementById('email')?.value.trim()
    const phone   = document.getElementById('phone')?.value.trim()
    const message = document.getElementById('message')?.value.trim()

    if (!name || !email || !phone || !message) {
      if (feedback) {
        feedback.textContent = 'Please fill out all fields.'
        feedback.className   = 'form-feedback error'
      }
      return
    }

    if (feedback) {
      feedback.textContent = 'Opening your email client...'
      feedback.className   = 'form-feedback success'
    }

    const subject = encodeURIComponent(`New Inquiry from ${name}`)
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    )

    // Fire event before redirect — sendBeacon guarantees delivery
    trackLeadFormSubmit()
    window.location.href =
      `mailto:contact@blissfullivingsolutions.com?subject=${subject}&body=${body}`

    form.reset()
  })
}
