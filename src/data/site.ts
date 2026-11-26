/**
 * Business facts used across every page — header, footer, contact section,
 * structured data. Change a fact here and it updates everywhere.
 */

export const site = {
  name: 'Blissful Living Solutions',
  legalName: 'Blissful Living Solutions LLC',
  tagline: 'Compassionate Home Services',
  url: 'https://www.blissfullivingsolutions.com',
  email: 'contact@blissfullivingsolutions.com',
  city: 'Lemont',
  region: 'IL',
  postalCode: '60439',
  geo: { latitude: 41.6736, longitude: -88.0017 },
  counties: ['Cook', 'Will', 'Kane', 'Lake', 'DuPage'],

  /*
   * Waiting on the IDPH license NUMBER (approval is done). Leave these as null
   * until it arrives — nothing renders while they are null. When it arrives,
   * fill them in and each one appears in the contact section, the footer and
   * the schema.org data automatically:
   *   phone:         { display: '(630) 555-0100', tel: '+16305550100' }
   *   streetAddress: '123 Street Name'
   *   licenseNumber: '1234567'
   */
  phone: null as { display: string; tel: string } | null,
  streetAddress: null as string | null,
  licenseNumber: null as string | null,
} as const

/** One-page section links. `label` is the footer wording; the header and the
 *  menu sheet use a shorter or longer label for two of them. */
export const navLinks: { hash: string; label: string; headerLabel?: string; menuLabel?: string }[] = [
  { hash: 'services', label: 'Services' },
  { hash: 'who-we-help', label: 'Who we help' },
  { hash: 'quality', label: 'Quality & safety', headerLabel: 'Quality' },
  { hash: 'how-it-works', label: 'How it works' },
  { hash: 'resources', label: 'FAQs', menuLabel: 'Questions & answers' },
  { hash: 'careers', label: 'Careers' },
]

export const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/blissfullivingsolutionsllc',
    path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/blissfullivingsolutions',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    name: 'X',
    href: 'https://x.com/BlissfulLS_LLC',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/blissful-living-solutions',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
]
