import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import {
  generalWhatsAppUrl,
  openWhatsApp,
} from '../lib/whatsapp'

export default function Header() {
  const { content, theme, toggleTheme, cartCount } = useStore()

  return (
    <header className="store-header">
      <div className="store-container store-nav">
        <Link className="store-brand" to="/">
          <img src={content.logoUrl} alt="" />
          <strong>{content.brandName}</strong>
        </Link>
        <nav>
          <Link to="/">
            <i className="ri-home-4-fill" />
            Inicio
          </Link>
          <details className="store-catalog-menu">
            <summary>
              <i className="ri-store-2-fill" />
              Tienda
              <i className="ri-arrow-down-s-line" />
            </summary>
            <div>
              <Link to="/store">
                <i className="ri-layout-grid-fill" />
                Todos los productos
              </Link>
              {content.categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/store?category=${encodeURIComponent(cat)}`}
                >
                  <i className="ri-folder-3-line" />
                  {cat}
                </Link>
              ))}
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
            onClick={toggleTheme}
          >
            <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} />
          </button>
          <Link className="store-cart-link" to="/cart" aria-label="Lista">
            <i className="ri-shopping-cart-2-line" />
            {cartCount > 0 && <b className="cart-badge">{cartCount}</b>}
          </Link>
          <button
            type="button"
            className="store-login-button"
            onClick={() => openWhatsApp(generalWhatsAppUrl(content))}
          >
            <i className="ri-whatsapp-line" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  )
}
