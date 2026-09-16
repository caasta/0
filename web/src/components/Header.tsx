type Props = {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="store-header">
      <div className="store-container store-nav">
        <a className="store-brand" href="#">
          <img src="/placeholders/logo.svg" alt="" />
          <strong>AppRebrands</strong>
        </a>
        <nav>
          <a href="#">
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
          <details className="store-language">
            <summary>
              <i className="ri-global-line" />
            </summary>
            <div>
              <button type="button" className="active">
                Español
              </button>
              <button type="button">English</button>
            </div>
          </details>
          <button
            className="store-icon"
            type="button"
            aria-label="Cambiar tema"
            onClick={onToggleTheme}
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
  )
}
