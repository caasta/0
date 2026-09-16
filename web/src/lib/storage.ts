import type { CartItem, SiteContent } from '../types'
import { seedContent } from '../data/seed'

const CART_KEY = 'apprebrands.cart.v1'
const THEME_KEY = 'apprebrands.theme.v1'
const TOKEN_KEY = 'apprebrands.adminToken.v1'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function emptyContent(): SiteContent {
  return structuredClone(seedContent)
}

export function loadCart(): CartItem[] {
  return safeParse<CartItem[]>(localStorage.getItem(CART_KEY), [])
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function loadTheme(): 'dark' | 'light' {
  const t = localStorage.getItem(THEME_KEY)
  return t === 'light' ? 'light' : 'dark'
}

export function saveTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme)
}

export function getAdminToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function setAdminToken(token: string | null) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

export function exportContentJson(content: SiteContent): string {
  return JSON.stringify(content, null, 2)
}
