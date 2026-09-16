export type ThemeMode = 'dark' | 'light'

export type Product = {
  id: string
  name: string
  price: number
  description: string
  category: string
  typeLabel: string
  featured: boolean
  image: string
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
