import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const dataDir = path.join(rootDir, 'data')
const contentPath = path.join(dataDir, 'content.json')
const seedPath = path.join(__dirname, 'seed-content.json')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
}

function readSeed() {
  return JSON.parse(fs.readFileSync(seedPath, 'utf8'))
}

function deepMergeContent(seed, stored) {
  if (!stored || typeof stored !== 'object') return structuredClone(seed)
  return {
    ...structuredClone(seed),
    ...stored,
    hero: { ...seed.hero, ...stored.hero },
    featured: { ...seed.featured, ...stored.featured },
    how: {
      ...seed.how,
      ...stored.how,
      steps: stored.how?.steps?.length ? stored.how.steps : seed.how.steps,
    },
    contact: {
      ...seed.contact,
      ...stored.contact,
      benefits: stored.contact?.benefits?.length
        ? stored.contact.benefits
        : seed.contact.benefits,
    },
    finalCta: { ...seed.finalCta, ...stored.finalCta },
    footer: { ...seed.footer, ...stored.footer },
    stats: stored.stats?.length ? stored.stats : seed.stats,
    products: stored.products?.length ? stored.products : seed.products,
    categories: stored.categories?.length ? stored.categories : seed.categories,
    whatsapp: { ...seed.whatsapp, ...stored.whatsapp },
  }
}

export function loadContent() {
  ensureDataDir()
  const seed = readSeed()
  if (!fs.existsSync(contentPath)) {
    fs.writeFileSync(contentPath, JSON.stringify(seed, null, 2))
    return structuredClone(seed)
  }
  try {
    const stored = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    // Strip legacy admin password if present in old files
    if (stored && stored.admin) delete stored.admin
    return deepMergeContent(seed, stored)
  } catch {
    return structuredClone(seed)
  }
}

export function saveContent(content) {
  ensureDataDir()
  const clean = { ...content }
  delete clean.admin
  if (!Array.isArray(clean.products)) {
    throw new Error('content.products must be an array')
  }
  fs.writeFileSync(contentPath, JSON.stringify(clean, null, 2))
  return clean
}

export function resetContent() {
  const seed = readSeed()
  return saveContent(seed)
}

export function getPaths() {
  return { rootDir, dataDir, contentPath, seedPath }
}
