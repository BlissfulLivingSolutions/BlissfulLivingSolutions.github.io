/**
 * Questions & answers (#resources). Drives both the on-page accordion and the
 * FAQPage structured data in the <head>.
 *
 * `schema` is what Google sees. Its wording is deliberately a little fuller than
 * the accordion text; keep the two saying the same thing when you edit either.
 * Leave `schema` off an item to keep it out of the structured data.
 */

export interface FaqItem {
  id: string
  question: string
  /** "Ask them:" prompt — only for the "What to ask any agency" group */
  askThem?: string
  answer: string
  schema?: { question: string; answer: string }
}

export const faqGroups: { title: string; items: FaqItem[] }[] = [
  {
    title: 'What to ask any home care agency',
    items: [
      {
        id: 'faq-background',
        question: 'Do you perform background checks?',
        askThem: 'Do you check fingerprints and the Health Care Worker Registry?',
        answer: "Yes. We perform fingerprint-based checks and clear every worker through the IDPH Registry before they enter a client's home.",
        schema: {
          question: 'Do you perform background checks on caregivers?',
          answer: "Yes. We perform fingerprint-based criminal background checks and clear every caregiver through the IDPH Health Care Worker Registry before they enter a client's home.",
        },
      },
      {
        id: 'faq-training',
        question: 'How much training do caregivers get?',
        askThem: 'Is it just a video, or is it hands-on, substantive training?',
        answer: '10+ hours of initial training within the first 30 days, plus 10+ hours of annual continuing education on safety, dementia, and care skills.',
        schema: {
          question: 'How much training do caregivers receive?',
          answer: 'Caregivers receive 10 or more hours of initial training within the first 30 days, plus 10 or more hours of annual continuing education covering safety, dementia care, and caregiving skills.',
        },
      },
      {
        id: 'faq-supervision',
        question: 'Is there supervision after care starts?',
        askThem: 'How often does a supervisor actually visit the home?',
        answer: 'We conduct on-site supervisory visits at least every 90 days to ensure quality and client satisfaction.',
        schema: {
          question: 'Is there supervision after care begins?',
          answer: 'Yes. We conduct on-site supervisory visits at least every 90 days to ensure quality, safety, and client satisfaction.',
        },
      },
    ],
  },
  {
    title: 'Common questions',
    items: [
      {
        id: 'faq-insurance',
        question: 'Do you accept insurance?',
        answer: 'We accept private pay and many Long Term Care (LTC) insurance policies. We do not bill Medicare or Medicaid directly for non-medical services.',
        schema: {
          question: 'Do you accept insurance?',
          answer: 'We accept private pay and many Long Term Care (LTC) insurance policies. We do not bill Medicare or Medicaid directly for non-medical services.',
        },
      },
      {
        id: 'faq-livein',
        question: 'Do you provide live-in or overnight care?',
        answer: 'Yes. We can arrange continuous non-medical support, overnight shifts, or live-in arrangements depending on your needs. Contact us to discuss what works for your family.',
        schema: {
          question: 'Do you provide live-in or overnight care?',
          answer: 'Yes. We can arrange continuous non-medical support, overnight shifts, or live-in arrangements depending on your needs and schedule.',
        },
      },
    ],
  },
]
