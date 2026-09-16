export type ThemeMode = 'dark' | 'light'

export type Product = {
  id: string
  name: string
  price: number
  /** Short text for cards / catalog */
  description: string
  /** Full detail copy; falls back to description */
  longDescription?: string
  category: string
  typeLabel: string
  featured: boolean
  image: string
  /** Extra gallery images (detail page); falls back to [image] */
  gallery?: string[]
  sku?: string
  deliveryTime?: string
  features?: string[]
  includes?: string[]
  compatibility?: string[]
  inStock?: boolean
}

export type StatItem = {
  id: string
  icon: string
  value: string
  label: string
}

export type HowStep = {
  id: string
  number: string
  icon: string
  title: string
  text: string
}

export type SiteContent = {
  brandName: string
  logoUrl: string
  hero: {
    kicker: string
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
    trust: string[]
    image: string
  }
  featured: {
    overline: string
    title: string
    subtitle: string
  }
  how: {
    overline: string
    title: string
    subtitle: string
    steps: HowStep[]
  }
  contact: {
    overline: string
    title: string
    subtitle: string
    benefits: { title: string; text: string; icon: string }[]
  }
  finalCta: {
    overline: string
    title: string
    subtitle: string
    button: string
  }
  footer: {
    tagline: string
    companyLinks: { label: string; href: string }[]
    supportLinks: { label: string; href: string }[]
    ctaTitle: string
    ctaText: string
    ctaButton: string
    copyright: string
  }
  stats: StatItem[]
  products: Product[]
  categories: string[]
  whatsapp: {
    phone: string
    productMessageTemplate: string
    cartMessageTemplate: string
    generalMessageTemplate: string
  }
}

export type CartItem = {
  productId: string
  quantity: number
}

export function productGallery(product: Product): string[] {
  if (product.gallery?.length) return product.gallery
  return product.image ? [product.image] : ['/placeholders/product-1.svg']
}

export function productLongText(product: Product): string {
  return product.longDescription?.trim() || product.description
}
