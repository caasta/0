import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
const authPath = path.join(dataDir, 'auth.json')

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function defaultPassword() {
  return process.env.ADMIN_PASSWORD || 'admin123'
}

/** @type {Map<string, { expires: number }>} */
const sessions = new Map()

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
}

function readAuthFile() {
  ensureDataDir()
  if (!fs.existsSync(authPath)) return null
  try {
    return JSON.parse(fs.readFileSync(authPath, 'utf8'))
  } catch {
    return null
  }
}

function writeAuthFile(data) {
  ensureDataDir()
  fs.writeFileSync(authPath, JSON.stringify(data, null, 2))
}

export function ensureAuthBootstrap() {
  const existing = readAuthFile()
  if (existing?.passwordHash) return existing
  const passwordHash = bcrypt.hashSync(defaultPassword(), 10)
  const data = {
    passwordHash,
    updatedAt: new Date().toISOString(),
    note: 'Generated on first boot. Change via admin panel or ADMIN_PASSWORD on fresh install.',
  }
  writeAuthFile(data)
  return data
}

export function verifyPassword(password) {
  const auth = ensureAuthBootstrap()
  return bcrypt.compareSync(String(password || ''), auth.passwordHash)
}

export function changePassword(currentPassword, nextPassword) {
  if (!verifyPassword(currentPassword)) {
    return { ok: false, error: 'Contraseña actual incorrecta' }
  }
  const next = String(nextPassword || '').trim()
  if (next.length < 4) {
    return { ok: false, error: 'La nueva contraseña debe tener al menos 4 caracteres' }
  }
  writeAuthFile({
    passwordHash: bcrypt.hashSync(next, 10),
    updatedAt: new Date().toISOString(),
  })
  // Invalidate all sessions after password change
  sessions.clear()
  return { ok: true }
}

export function createSession() {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { expires: Date.now() + SESSION_TTL_MS })
  return token
}

export function destroySession(token) {
  if (token) sessions.delete(token)
}

export function isValidSession(token) {
  if (!token) return false
  const row = sessions.get(token)
  if (!row) return false
  if (Date.now() > row.expires) {
    sessions.delete(token)
    return false
  }
  // sliding expiry
  row.expires = Date.now() + SESSION_TTL_MS
  return true
}

export function getTokenFromRequest(req) {
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) return header.slice(7).trim()
  return ''
}

export function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req)
  if (!isValidSession(token)) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  req.adminToken = token
  next()
}

export function defaultPasswordHint() {
  return process.env.ADMIN_PASSWORD
    ? '(definida por ADMIN_PASSWORD)'
    : 'admin123 (cámbiala en producción)'
}
