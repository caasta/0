import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { generalWhatsAppUrl, openWhatsApp } from '../lib/whatsapp'

export default function Footer() {
  const { content } = useStore()
  const { footer } = content

  return (
    <footer className="store-footer">
      <div className="store-container store-footer-grid">
        <section className="store-footer-brand">
          <Link className="store-brand" to="/">
            <img src={content.logoUrl} alt="" />
            <strong>{content.brandName}</strong>
          </Link>
          <p>{footer.tagline}</p>
          <nav className="store-social-links" aria-label="Redes sociales">
            <button
              type="button"
              aria-label="WhatsApp"
              onClick={() => openWhatsApp(generalWhatsAppUrl(content))}
            >
              <i className="ri-whatsapp-line" />
            </button>
          </nav>
        </section>
        <section>
          <h3>Empresa</h3>
          <nav>
            {footer.companyLinks.map((l) => (
              <Link key={l.label} to={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </section>
        <section>
          <h3>Soporte</h3>
          <nav>
            {footer.supportLinks.map((l) =>
              l.href === '#' ? (
                <button
                  key={l.label}
                  type="button"
                  className="footer-text-btn"
                  onClick={() => openWhatsApp(generalWhatsAppUrl(content))}
                >
                  {l.label}
                </button>
              ) : (
                <Link key={l.label} to={l.href}>
                  {l.label}
                </Link>
              ),
            )}
          </nav>
        </section>
        <section className="store-footer-cta">
          <h3>{footer.ctaTitle}</h3>
          <p>{footer.ctaText}</p>
          <a className="store-btn primary" href="/store">
            {footer.ctaButton}
            <i className="ri-arrow-right-line" />
          </a>
        </section>
        <div className="store-footer-bottom">
          <small>{footer.copyright}</small>
          <nav className="store-legal-links">
            <Link to="/admin">Admin</Link>
            <a href="#contact-support">Soporte</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
