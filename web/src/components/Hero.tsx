import { useStore } from '../context/StoreContext'
import { generalWhatsAppUrl, openWhatsApp } from '../lib/whatsapp'

const TRUST_ICONS = [
  'ri-shield-check-line',
  'ri-customer-service-2-line',
  'ri-download-cloud-2-line',
]

export default function Hero() {
  const { content } = useStore()
  const { hero } = content

  return (
    <section className="commerce-hero has-image">
      <div className="commerce-hero-glow" />
      <div className="store-container commerce-hero-grid">
        <div className="commerce-hero-copy">
          <span className="commerce-kicker">
            <i className="ri-sparkling-2-line" />
            {hero.kicker}
          </span>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <div className="commerce-hero-actions">
            <a className="store-btn primary" href="/store">
              {hero.primaryCta}
              <i className="ri-arrow-right-line" />
            </a>
            <button
              type="button"
              className="store-btn secondary"
              onClick={() => openWhatsApp(generalWhatsAppUrl(content))}
            >
              <i className="ri-whatsapp-line" />
              {hero.secondaryCta}
            </button>
          </div>
          <div className="commerce-trust">
            {hero.trust.map((label, i) => (
              <span key={label}>
                <i className={TRUST_ICONS[i] || 'ri-checkbox-circle-line'} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="commerce-hero-media">
          <img src={hero.image} alt={hero.title} />
        </div>
      </div>
    </section>
  )
}
