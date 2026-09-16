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

function normalizeProduct(product) {
  const image = product.image || '/placeholders/product-1.svg'
  const gallery =
    Array.isArray(product.gallery) && product.gallery.length
      ? product.gallery
      : [image]
  return {
    id: String(product.id),
    name: product.name || 'Producto',
    price: Number(product.price) || 0,
    description: product.description || '',
    longDescription: product.longDescription || product.description || '',
    category: product.category || 'General',
    typeLabel: product.typeLabel || 'Producto digital',
    featured: Boolean(product.featured),
    image,
    gallery,
    sku:
      product.sku ||
      String(product.name || 'SKU')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48),
    deliveryTime: product.deliveryTime || '24 ~ 72 hr',
    features: Array.isArray(product.features) ? product.features : [],
    includes: Array.isArray(product.includes) ? product.includes : [],
    compatibility: Array.isArray(product.compatibility)
      ? product.compatibility
      : [],
    inStock: product.inStock !== false,
  }
}

function normalizeContent(content) {
  const next = { ...content }
  next.products = Array.isArray(next.products)
    ? next.products.map(normalizeProduct)
    : []
  return next
}

function deepMergeContent(seed, stored) {
  if (!stored || typeof stored !== 'object') return structuredClone(seed)
  return normalizeContent({
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
  })
}

export function loadContent() {
  ensureDataDir()
  const seed = normalizeContent(readSeed())
  if (!fs.existsSync(contentPath)) {
    fs.writeFileSync(contentPath, JSON.stringify(seed, null, 2))
    return structuredClone(seed)
  }
  try {
    const stored = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    if (stored && stored.admin) delete stored.admin
    return deepMergeContent(seed, stored)
  } catch {
    return structuredClone(seed)
  }
}

export function saveContent(content) {
  ensureDataDir()
  const clean = normalizeContent({ ...content })
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
