# AppRebrands landing + admin demo

Faithful visual recreation of [apprebrands.com](https://apprebrands.com/) with a local CMS and WhatsApp purchase flow.

## Stack

- Vite + React + TypeScript + React Router
- Remix Icon + Inter
- Persistence: `localStorage` + in-repo seed (`src/data/seed.ts`)

## Run

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173`.

## Admin

- URL: `http://localhost:5173/admin` (redirects to `/admin/login` if needed)
- Default user: `admin`
- Default password: `admin123` (changeable in Admin → Ajustes)

### What you can edit

- Hero / brand / featured copy
- Stats
- Products CRUD (name, price, description, category, featured, image URL)
- How-it-works, contact, footer
- WhatsApp number + message templates
- Export / import JSON, reset to seed, change password

## WhatsApp

Configure under **Admin → WhatsApp**:

- Phone: digits with country code, no `+` (placeholder seed: `15551234567`)
- Product template vars: `{name}` `{price}` `{category}` `{description}`
- Cart template vars: `{items}` `{total}`

Public CTAs open `https://wa.me/<phone>?text=...` — product buy buttons, header WhatsApp, contact form, and cart **Continuar por WhatsApp**.

## Cart

`/cart` is a shortlist, not a card checkout. Users add products, then continue on WhatsApp.

## Reset / export data

- **Export JSON** / **Import JSON** / **Reset a seed** in Admin → Ajustes
- Or clear browser keys:
  - `apprebrands.demo.content.v1`
  - `apprebrands.demo.cart.v1`
  - `apprebrands.demo.adminAuth.v1`

## Build

```bash
cd web
npm run build
npm run preview
```
