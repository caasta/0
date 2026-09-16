import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
import {
  loadContent,
  saveContent,
  resetContent,
  getPaths,
} from './store.js'
import {
  ensureAuthBootstrap,
  verifyPassword,
  createSession,
  destroySession,
  changePassword,
  requireAuth,
  getTokenFromRequest,
  isValidSession,
  defaultPasswordHint,
} from './auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { rootDir } = getPaths()

function loadDotEnv() {
  const envPath = path.join(rootDir, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}
loadDotEnv()

const distDir = path.join(rootDir, 'dist')
const PORT = Number(process.env.PORT || 3000)
const HOST = process.env.HOST || '0.0.0.0'
const isProd = process.env.NODE_ENV === 'production'

ensureAuthBootstrap()
loadContent()

export function createApp() {
  const app = express()

  app.use((_req, res, next) => {
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      res.set('Content-Type', 'application/json; charset=utf-8')
      return originalJson(body)
    }
    next()
  })

  app.use(express.json({ limit: '2mb' }))
  app.use(
    cors({
      origin: isProd ? false : true,
      credentials: true,
    }),
  )

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      env: isProd ? 'production' : 'development',
      authHint: defaultPasswordHint(),
      host: HOST,
      port: PORT,
    })
  })

  app.get('/api/content', (_req, res) => {
    res.json(loadContent())
  })

  app.put('/api/content', requireAuth, (req, res) => {
    try {
      const saved = saveContent(req.body)
      res.json(saved)
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : 'No se pudo guardar',
      })
    }
  })

  app.post('/api/content/reset', requireAuth, (_req, res) => {
    res.json(resetContent())
  })

  app.post('/api/content/import', requireAuth, (req, res) => {
    try {
      const saved = saveContent(req.body)
      res.json(saved)
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : 'JSON inválido',
      })
    }
  })

  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body || {}
    if (!verifyPassword(password)) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }
    const token = createSession()
    res.json({ token, user: 'admin' })
  })

  app.post('/api/auth/logout', (req, res) => {
    destroySession(getTokenFromRequest(req))
    res.json({ ok: true })
  })

  app.get('/api/auth/me', (req, res) => {
    const token = getTokenFromRequest(req)
    if (!isValidSession(token)) {
      return res.status(401).json({ authenticated: false })
    }
    res.json({ authenticated: true, user: 'admin' })
  })

  app.post('/api/auth/password', requireAuth, (req, res) => {
    const { currentPassword, nextPassword } = req.body || {}
    const result = changePassword(currentPassword, nextPassword)
    if (!result.ok) return res.status(400).json(result)
    res.json({ ok: true })
  })

  if (fs.existsSync(distDir)) {
    app.use(
      express.static(distDir, {
        index: false,
        setHeaders(res, filePath) {
          if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
          }
        },
      }),
    )

    app.get(/^\/(?!api).*/, (_req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.sendFile(path.join(distDir, 'index.html'))
    })
  } else if (isProd) {
    console.warn(
      '[warn] dist/ no encontrado. Ejecuta "npm run build" antes de "npm start".',
    )
    app.get('/', (_req, res) => {
      res
        .status(503)
        .type('text/plain; charset=utf-8')
        .send('dist/ missing — run npm run build')
    })
  }

  return app
}

const app = createApp()
export default app

let server = null

export function startServer() {
  if (server) return server
  server = app.listen(PORT, HOST, () => {
    console.log(`AppRebrands listening on http://${HOST}:${PORT}`)
    console.log(`Admin password: ${defaultPasswordHint()}`)
    if (!fs.existsSync(distDir)) {
      console.log('Modo API (sin dist). Usa Vite en :5173 con proxy /api.')
    }
  })
  return server
}

function isMainModule() {
  const entry = process.argv[1]
  if (!entry) return false
  try {
    return import.meta.url === pathToFileURL(path.resolve(entry)).href
  } catch {
    return false
  }
}

if (isMainModule()) {
  startServer()
}
