import type { Product, SiteContent } from '../types'

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '')
}

function applyTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (msg, [key, val]) => msg.replaceAll(`{${key}}`, val),
    template,
  )
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const n = digitsOnly(phone)
  const text = encodeURIComponent(message)
  return `https://wa.me/${n}?text=${text}`
}

export function productWhatsAppUrl(
  content: SiteContent,
  product: Product,
): string {
  const message = applyTemplate(content.whatsapp.productMessageTemplate, {
    name: product.name,
    price: formatPrice(product.price),
    category: product.category,
    description: product.description,
  })
  return buildWhatsAppUrl(content.whatsapp.phone, message)
}

export function cartWhatsAppUrl(
  content: SiteContent,
  lines: { name: string; price: number; quantity: number }[],
): string {
  const items = lines
    .map(
      (l) =>
        `• ${l.name} x${l.quantity} — ${formatPrice(l.price * l.quantity)}`,
    )
    .join('\n')
  const total = formatPrice(
    lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
  )
  const message = applyTemplate(content.whatsapp.cartMessageTemplate, {
    items,
    total,
  })
  return buildWhatsAppUrl(content.whatsapp.phone, message)
}

export function generalWhatsAppUrl(content: SiteContent): string {
  return buildWhatsAppUrl(
    content.whatsapp.phone,
    content.whatsapp.generalMessageTemplate,
  )
}

export function openWhatsApp(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
