export default function Footer() {
  return (
    <footer className="store-footer">
      <div className="store-container store-footer-grid">
        <section className="store-footer-brand">
          <a className="store-brand" href="#">
            <img src="/placeholders/logo.svg" alt="" />
            <strong>AppRebrands</strong>
          </a>
          <p>Custom IPTV applications for brands and businesses.</p>
          <nav className="store-social-links" aria-label="Redes sociales" />
        </section>
        <section>
          <h3>Empresa</h3>
          <nav>
            <a href="#">Inicio</a>
            <a href="#featured">Tienda</a>
          </nav>
        </section>
        <section>
          <h3>Soporte</h3>
          <nav>
            <a href="#contact-support">Soporte</a>
            <a href="#contact-support">Mi cuenta</a>
            <a href="#contact-support">Descargas</a>
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
            © 2026 AppRebrands. <strong>v1.0.15</strong>
          </small>
          <nav className="store-legal-links">
            <a href="#">Política de privacidad</a>
            <a href="#">Términos y condiciones</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
