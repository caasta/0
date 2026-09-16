export default function Hero() {
  return (
    <section className="commerce-hero has-image">
      <div className="commerce-hero-glow" />
      <div className="store-container commerce-hero-grid">
        <div className="commerce-hero-copy">
          <span className="commerce-kicker">
            <i className="ri-sparkling-2-line" />
            Comercio Electrónico
          </span>
          <h1>Encuentra productos creados para tu negocio.</h1>
          <p>
            Explora nuestro catálogo, descubre ofertas y encuentra exactamente lo
            que necesitas.
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
          <img
            src="/placeholders/hero.svg"
            alt="Encuentra productos creados para tu negocio."
          />
        </div>
      </div>
    </section>
  )
}
