import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const dataDir = path.join(rootDir, 'data')
const contentPath = path.join(dataDir, 'content.json')
const seedPath = path.join(__dirname, 'seed-content.json')

/** Early deploy IDs → live AppRebrands numeric IDs */
const LEGACY_PRODUCT_IDS = {
  p1: '4',
  p2: '3',
  p3: '1',
  p4: '2',
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
}

function readSeed() {
  return JSON.parse(fs.readFileSync(seedPath, 'utf8'))
}

function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
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

function findSeedMatch(product, seedProducts) {
  const byId = seedProducts.find((s) => String(s.id) === String(product.id))
  if (byId) return byId
  const needle = normalizeName(product.name)
  if (!needle) return null
  return (
    seedProducts.find((s) => normalizeName(s.name) === needle) ||
    seedProducts.find(
      (s) =>
        needle.includes(normalizeName(s.name).slice(0, 18)) ||
        normalizeName(s.name).includes(needle.slice(0, 18)),
    ) ||
    null
  )
}

/**
 * Remap legacy p1–p4 IDs to live numeric IDs and backfill rich detail fields
 * from seed when missing (so old content.json still gets usable product sheets).
 */
function migrateProducts(products, seedProducts) {
  let changed = false
  const next = products.map((raw) => {
    let product = { ...raw }
    const legacyTarget = LEGACY_PRODUCT_IDS[String(product.id)]
    if (legacyTarget) {
      product.id = legacyTarget
      changed = true
    }

    const seed = findSeedMatch(product, seedProducts)
    if (seed) {
      if (String(product.id) !== String(seed.id) && /^p\d+$/i.test(String(raw.id))) {
        product.id = String(seed.id)
        changed = true
      }
      const enrichKeys = [
        'longDescription',
        'gallery',
        'sku',
        'deliveryTime',
        'features',
        'includes',
        'compatibility',
      ]
      for (const key of enrichKeys) {
        const cur = product[key]
        const empty =
          cur == null ||
          cur === '' ||
          (Array.isArray(cur) && cur.length === 0)
        if (empty && seed[key] != null && seed[key] !== '') {
          product[key] = structuredClone(seed[key])
          changed = true
        }
      }
      if (!product.typeLabel && seed.typeLabel) {
        product.typeLabel = seed.typeLabel
        changed = true
      }
    }
    return product
  })
  return { products: next, changed }
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
    const merged = deepMergeContent(seed, stored)
    const { products, changed } = migrateProducts(merged.products, seed.products)
    merged.products = products.map(normalizeProduct)
    if (changed) {
      try {
        fs.writeFileSync(contentPath, JSON.stringify(merged, null, 2))
        console.log(
          '[content] Migrated legacy product IDs / enriched detail fields →',
          products.map((p) => p.id).join(', '),
        )
      } catch (err) {
        console.warn('[content] Could not persist product migration:', err.message)
      }
    }
    return structuredClone(merged)
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
  const seed = normalizeContent(readSeed())
  const { products } = migrateProducts(clean.products, seed.products)
  clean.products = products.map(normalizeProduct)
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

export { LEGACY_PRODUCT_IDS }
