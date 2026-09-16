import type { SiteContent } from '../types'
import { getAdminToken, setAdminToken } from './storage'

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (auth) {
    const token = getAdminToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(path, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      (data && typeof data.error === 'string' && data.error) ||
      `Error HTTP ${res.status}`
    throw new Error(message)
  }
  return data as T
}

export function fetchContent() {
  return request<SiteContent>('/api/content')
}

export function saveContentApi(content: SiteContent) {
  return request<SiteContent>(
    '/api/content',
    { method: 'PUT', body: JSON.stringify(content) },
    true,
  )
}

export function resetContentApi() {
  return request<SiteContent>('/api/content/reset', { method: 'POST' }, true)
}

export function importContentApi(content: SiteContent) {
  return request<SiteContent>(
    '/api/content/import',
    { method: 'POST', body: JSON.stringify(content) },
    true,
  )
}

export async function loginApi(password: string) {
  const data = await request<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  setAdminToken(data.token)
  return data
}

export async function logoutApi() {
  try {
    await request('/api/auth/logout', { method: 'POST' }, true)
  } finally {
    setAdminToken(null)
  }
}

export async function meApi() {
  try {
    const data = await request<{ authenticated: boolean }>(
      '/api/auth/me',
      {},
      true,
    )
    return Boolean(data.authenticated)
  } catch {
    setAdminToken(null)
    return false
  }
}

export function changePasswordApi(currentPassword: string, nextPassword: string) {
  return request<{ ok: boolean }>(
    '/api/auth/password',
    {
      method: 'POST',
      body: JSON.stringify({ currentPassword, nextPassword }),
    },
    true,
  )
}
