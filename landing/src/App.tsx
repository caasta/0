import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import 'remixicon/fonts/remixicon.css'
import logo from './assets/logo.svg'
import heroImage from './assets/hero-placeholder.svg'
import productNova from './assets/product-nova.svg'
import productRoku from './assets/product-roku.svg'
import productYoutube from './assets/product-youtube.svg'
import productMail from './assets/product-mail.svg'
import captchaImage from './assets/captcha-placeholder.svg'
import './App.css'

const products = [
  {
    title: 'Nova IPTV Player | Aplicación Flutter con panel de administración PHP',
    type: 'Producto digital',
    price: '$79.99',
    image: productNova,
  },
  {
    title: 'XOE PLUS Roku',
    type: 'Personalizado',
    price: '$425.00',
    image: productRoku,
  },
  {
    title: 'Programa para tráileres de YouTube',
    type: 'Producto digital',
    price: '$149.00',
    image: productYoutube,
  },
  {
    title: 'Servidor de Correo Profesional',
    type: 'Producto digital',
    price: '$45.00',
    image: productMail,
  },
]

const stats = [
  { value: '250+', label: 'Aplicaciones entregadas', icon: 'ri-rocket-2-line' },
  { value: '80+', label: 'Clientes activos', icon: 'ri-group-line' },
  { value: '99.9%', label: 'Disponibilidad', icon: 'ri-checkbox-circle-line' },
  { value: '24/7', label: 'Soporte especializado', icon: 'ri-customer-service-2-line' },
  { value: '100%', label: 'Personalización total', icon: 'ri-palette-line' },
]

const steps = [
  {
    n: '01',
    icon: 'ri-search-eye-line',
    title: 'Elige',
    text: 'Selecciona producto, licencia o servicio.',
  },
  {
    n: '02',
    icon: 'ri-shopping-cart-2-line',
    title: 'Compra',
    text: 'Completa tu pedido desde la tienda.',
  },
  {
    n: '03',
    icon: 'ri-tools-line',
    title: 'Personalizamos',
    text: 'Recibimos tus datos y configuramos tu entrega.',
  },
  {
    n: '04',
    icon: 'ri-download-cloud-2-line',
    title: 'Recibe',
    text: 'Accede a descargas, licencias y soporte desde tu cuenta.',
  },
]

function BrandMark({ className = '' }: { className?: string }) {
  return (
    <a className={`store-brand ${className}`} href="#top">
      <img src={logo} alt="" />
      <strong>AppRebrands</strong>
    </a>
  )
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [langOpen, setLangOpen] = useState(false)
  const [locale, setLocale] = useState<'es' | 'en'>('es')
  const [formNote, setFormNote] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      const bar = document.getElementById('progressBar')
      if (!bar) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      bar.style.width = `${pct}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onContactSubmit = (event: FormEvent) => {
    event.preventDefault()
    setFormNote('Demo local: el formulario no envía datos. En el sitio real se valida el correo y se crea un ticket.')
  }

  return (
    <div className="store-body" id="top">
      <div className="store-progress-bar" id="progressBar" aria-hidden="true" />

      <header className="store-header">
        <div className="store-container store-nav">
          <BrandMark />
          <nav>
            <a href="#top">
              <i className="ri-home-4-fill" />
              Inicio
            </a>
            <details className="store-catalog-menu">
              <summary>
                <i className="ri-store-2-fill" />
                Tienda
                <i className="ri-arrow-down-s-line" />
              </summary>
              <div>
                <a href="#featured">
                  <i className="ri-layout-grid-fill" />
                  Todos los productos
                </a>
                <a href="#featured">
                  <i className="ri-folder-3-line" />
                  Android
                </a>
                <a href="#featured">
                  <i className="ri-folder-3-line" />
                  Roku
                </a>
                <a href="#featured">
                  <i className="ri-folder-3-line" />
                  Paquetes
                </a>
                <a href="#featured">
                  <i className="ri-folder-3-line" />
                  Scripts
                </a>
              </div>
            </details>
          </nav>
          <div className="store-actions">
            <details
              className="store-language"
              open={langOpen}
              onToggle={(e) => setLangOpen((e.target as HTMLDetailsElement).open)}
            >
              <summary aria-label="Idioma">
                <i className="ri-global-line" />
              </summary>
              <div>
                <button
                  type="button"
                  className={locale === 'es' ? 'active' : ''}
                  onClick={() => {
                    setLocale('es')
                    setLangOpen(false)
                  }}
                >
                  Español
                </button>
                <button
                  type="button"
                  className={locale === 'en' ? 'active' : ''}
                  onClick={() => {
                    setLocale('en')
                    setLangOpen(false)
                  }}
                >
                  English
                </button>
              </div>
            </details>
            <button
              className="store-icon"
              type="button"
              aria-label="Cambiar tema"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} />
            </button>
            <a className="store-cart-link" href="#featured" aria-label="Carrito">
              <i className="ri-shopping-cart-2-line" />
            </a>
            <a className="store-login-button" href="#contact-support">
              <i className="ri-login-box-line" />
              <span>Ingresar</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <div className="store-public-scene" aria-hidden="true">
          <span className="store-scene-grid" />
          <span className="store-scene-stars" />
          <span className="store-scene-aurora" />
          <span className="store-scene-floor" />
        </div>

        <section className="commerce-hero has-image">
          <div className="commerce-hero-glow" />
          <div className="store-container commerce-hero-grid">
            <div className="commerce-hero-copy">
              <span className="commerce-kicker">
                <i className="ri-sparkling-2-line" />
                Comercio Electrónico
              </span>
              <p className="brand-hero-signal">AppRebrands</p>
              <h1>Encuentra productos creados para tu negocio.</h1>
              <p>
                Explora nuestro catálogo, descubre ofertas y encuentra exactamente lo que
                necesitas.
              </p>
              <div className="commerce-hero-actions">
                <a className="store-btn primary" href="#featured">
                  Explorar productos
                  <i className="ri-arrow-right-line" />
                </a>
                <a className="store-btn secondary" href="#contact-support">
                  <i className="ri-search-eye-line" />
                  Consultar pedido
                </a>
              </div>
              <div className="commerce-trust">
                <span>
                  <i className="ri-shield-check-line" />
                  Compra protegida
                </span>
                <span>
                  <i className="ri-customer-service-2-line" />
                  Soporte cercano
                </span>
                <span>
                  <i className="ri-download-cloud-2-line" />
                  Entrega organizada
                </span>
              </div>
            </div>
            <div className="commerce-hero-media">
              <img src={heroImage} alt="Encuentra productos creados para tu negocio." />
            </div>
          </div>
        </section>

        <section
          className="commerce-section commerce-stats"
          aria-label="Indicadores de confianza y servicio"
        >
          <div className="store-container">
            <div className="commerce-stats-grid" role="list">
              {stats.map((stat, index) => (
                <article key={stat.label} role="listitem" style={{ ['--stat-index' as string]: index }}>
                  <i className={stat.icon} />
                  <div>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="commerce-section commerce-featured" id="featured">
          <div className="store-container">
            <header className="commerce-section-head">
              <div>
                <span>Selección recomendada</span>
                <h2>Productos destacados</h2>
                <p>Una selección de productos y servicios recomendados por nuestro equipo.</p>
              </div>
              <a href="#featured">
                Ver todos
                <i className="ri-arrow-right-line" />
              </a>
            </header>
            <div className="product-grid">
              {products.map((product) => (
                <article className="store-product-card" key={product.title}>
                  <a className="product-card-image" href="#featured">
                    <img src={product.image} alt={product.title} />
                    <span>Destacado</span>
                  </a>
                  <div className="product-card-body">
                    <small>{product.type}</small>
                    <h3>
                      <a href="#featured">{product.title}</a>
                    </h3>
                    <div>
                      <p>
                        <strong>{product.price}</strong>
                      </p>
                      <div className="product-card-actions">
                        <a className="product-arrow" href="#featured" aria-label="Ver producto">
                          <i className="ri-eye-line" />
                        </a>
                        <button
                          className="product-card-cart"
                          type="button"
                          aria-label="Agregar al carrito"
                          title="Agregar al carrito"
                        >
                          <i className="ri-shopping-cart-2-line" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="commerce-section commerce-how">
          <div className="store-container">
            <header className="commerce-section-head">
              <div>
                <span>Proceso de compra</span>
                <h2>Cómo funciona</h2>
                <p>Un proceso claro desde la selección hasta la entrega final.</p>
              </div>
            </header>
            <div className="commerce-how-grid">
              {steps.map((step) => (
                <article key={step.n}>
                  <b>{step.n}</b>
                  <i className={step.icon} />
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="commerce-section support-contact-section" id="contact-support">
          <div className="store-container support-contact-grid">
            <div className="support-contact-copy">
              <span className="support-contact-kicker">
                <i className="ri-customer-service-2-line" />
                Contacto y soporte
              </span>
              <h1>¿Cómo podemos ayudarte?</h1>
              <p>
                Cuéntanos qué necesitas. Crearemos un ticket con número de seguimiento para que
                recibas cada respuesta y mantengas toda la conversación organizada.
              </p>
              <div className="support-contact-benefits">
                <article>
                  <i className="ri-ticket-2-line" />
                  <span>
                    <strong>Número de seguimiento</strong>
                    <small>Cada consulta se registra como un ticket real.</small>
                  </span>
                </article>
                <article>
                  <i className="ri-mail-check-line" />
                  <span>
                    <strong>Correo validado</strong>
                    <small>El ticket solo se crea después de confirmar tu dirección.</small>
                  </span>
                </article>
                <article>
                  <i className="ri-history-line" />
                  <span>
                    <strong>Conversación organizada</strong>
                    <small>Consulta el historial completo desde un enlace privado.</small>
                  </span>
                </article>
              </div>
            </div>

            <form className="support-contact-form" onSubmit={onContactSubmit}>
              <label>
                <span>Tu nombre</span>
                <div>
                  <i className="ri-user-3-line" />
                  <input name="name" maxLength={160} autoComplete="name" placeholder="Nombre completo" required />
                </div>
              </label>
              <label>
                <span>Tu correo electrónico</span>
                <div>
                  <i className="ri-mail-line" />
                  <input
                    type="email"
                    name="email"
                    maxLength={190}
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    required
                  />
                </div>
              </label>
              <label>
                <span>Tema de la consulta</span>
                <div>
                  <i className="ri-questionnaire-line" />
                  <select name="topic" required defaultValue="">
                    <option value="" disabled>
                      Selecciona un tema
                    </option>
                    <option value="sales">Información de compra</option>
                    <option value="product">Pregunta sobre un producto</option>
                    <option value="customization">Personalización o proyecto</option>
                    <option value="technical">Soporte técnico</option>
                    <option value="billing">Pago o facturación</option>
                    <option value="other">Otra consulta</option>
                  </select>
                  <i className="ri-arrow-down-s-line" />
                </div>
              </label>
              <label>
                <span>Tu mensaje</span>
                <textarea
                  name="message"
                  rows={6}
                  minLength={10}
                  maxLength={10000}
                  placeholder="Describe tu consulta con todos los detalles necesarios…"
                  required
                />
              </label>
              <div className="internal-captcha-widget">
                <img src={captchaImage} alt="Imagen de verificación" />
                <button type="button" aria-label="Actualizar captcha">
                  <i className="ri-refresh-line" />
                </button>
                <input
                  type="text"
                  name="captcha"
                  maxLength={6}
                  autoComplete="off"
                  placeholder="Escribe el código de la imagen"
                  required
                />
              </div>
              <button type="submit">
                <i className="ri-send-plane-fill" />
                Validar correo y continuar
              </button>
              <p className="support-contact-privacy">
                <i className="ri-shield-check-line" />
                Usaremos estos datos únicamente para responder tu solicitud.{' '}
                <a href="#top">Política de privacidad</a>
              </p>
              {formNote ? <p className="support-form-note">{formNote}</p> : null}
            </form>
          </div>
        </section>

        <section className="commerce-final-cta">
          <div className="store-container">
            <div>
              <span>Comienza hoy</span>
              <h2>Encuentra la solución ideal para tu proyecto</h2>
              <p>Explora el catálogo completo y crea tu pedido cuando estés listo.</p>
            </div>
            <a className="store-btn primary" href="#featured">
              Explorar catálogo
              <i className="ri-arrow-right-line" />
            </a>
          </div>
        </section>
      </main>

      <footer className="store-footer">
        <div className="store-container store-footer-grid">
          <section className="store-footer-brand">
            <BrandMark />
            <p>Custom IPTV applications for brands and businesses.</p>
          </section>
          <section>
            <h3>Empresa</h3>
            <nav>
              <a href="#top">Inicio</a>
              <a href="#featured">Tienda</a>
            </nav>
          </section>
          <section>
            <h3>Soporte</h3>
            <nav>
              <a href="#contact-support">Soporte</a>
              <a href="#contact-support">Mi cuenta</a>
              <a href="#featured">Descargas</a>
            </nav>
          </section>
          <section className="store-footer-cta">
            <h3>¿Listo para comenzar?</h3>
            <p>Explora nuestros productos y servicios digitales.</p>
            <a className="store-btn primary" href="#featured">
              Ver catálogo
              <i className="ri-arrow-right-line" />
            </a>
          </section>
          <div className="store-footer-bottom">
            <small>
              © 2026 AppRebrands. <strong>Demo lookalike</strong>
            </small>
            <nav className="store-legal-links">
              <a href="#top">Política de privacidad</a>
              <a href="#top">Términos y condiciones</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
