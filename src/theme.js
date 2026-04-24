const STORAGE_KEY = 'bls_theme'

function getStoredTheme() {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function setStoredTheme(value) {
  try { localStorage.setItem(STORAGE_KEY, value) } catch {}
}

function resolveTheme() {
  const stored = getStoredTheme()
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  if (prefersDark) return 'dark'
  const h = new Date().getHours()
  return (h >= 19 || h < 7) ? 'dark' : 'light'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const btn = document.querySelector('[data-theme-toggle]')
  if (!btn) return
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
}

export function initThemeToggle() {
  applyTheme(resolveTheme())

  const btn = document.querySelector('[data-theme-toggle]')
  if (!btn) return

  btn.addEventListener('click', () => {
    const next = resolveTheme() === 'dark' ? 'light' : 'dark'
    setStoredTheme(next)
    applyTheme(next)
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const stored = getStoredTheme()
    if (!stored || stored === 'auto') applyTheme(resolveTheme())
  })
}
