import type { CartItem, SiteContent } from '../types'
import { seedContent } from '../data/seed'

const CONTENT_KEY = 'apprebrands.demo.content.v1'
const CART_KEY = 'apprebrands.demo.cart.v1'
const AUTH_KEY = 'apprebrands.demo.adminAuth.v1'
const THEME_KEY = 'apprebrands.demo.theme.v1'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadContent(): SiteContent {
  const stored = safeParse<SiteContent | null>(
    localStorage.getItem(CONTENT_KEY),
    null,
  )
  if (!stored) return structuredClone(seedContent)
  return {
    ...structuredClone(seedContent),
    ...stored,
    hero: { ...seedContent.hero, ...stored.hero },
    featured: { ...seedContent.featured, ...stored.featured },
    how: {
      ...seedContent.how,
      ...stored.how,
      steps: stored.how?.steps?.length ? stored.how.steps : seedContent.how.steps,
    },
    contact: {
      ...seedContent.contact,
      ...stored.contact,
      benefits: stored.contact?.benefits?.length
        ? stored.contact.benefits
        : seedContent.contact.benefits,
    },
    finalCta: { ...seedContent.finalCta, ...stored.finalCta },
    footer: { ...seedContent.footer, ...stored.footer },
    stats: stored.stats?.length ? stored.stats : seedContent.stats,
    products: stored.products?.length ? stored.products : seedContent.products,
    categories: stored.categories?.length
      ? stored.categories
      : seedContent.categories,
    whatsapp: { ...seedContent.whatsapp, ...stored.whatsapp },
    admin: { ...seedContent.admin, ...stored.admin },
  }
}

export function saveContent(content: SiteContent) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
}

export function resetContent(): SiteContent {
  const next = structuredClone(seedContent)
  saveContent(next)
  return next
}

export function exportContentJson(content: SiteContent): string {
  return JSON.stringify(content, null, 2)
}

export function importContentJson(raw: string): SiteContent {
  const parsed = JSON.parse(raw) as SiteContent
  if (!parsed || !Array.isArray(parsed.products)) {
    throw new Error('JSON inválido: falta products[]')
  }
  const merged = {
    ...structuredClone(seedContent),
    ...parsed,
    whatsapp: { ...seedContent.whatsapp, ...parsed.whatsapp },
    admin: { ...seedContent.admin, ...parsed.admin },
  }
  saveContent(merged)
  return merged
}

export function loadCart(): CartItem[] {
  return safeParse<CartItem[]>(localStorage.getItem(CART_KEY), [])
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function setAdminAuthenticated(value: boolean) {
  if (value) localStorage.setItem(AUTH_KEY, '1')
  else localStorage.removeItem(AUTH_KEY)
}

export function loadTheme(): 'dark' | 'light' {
  const t = localStorage.getItem(THEME_KEY)
  return t === 'light' ? 'light' : 'dark'
}

export function saveTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme)
}
