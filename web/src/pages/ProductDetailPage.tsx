import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SceneBackground from '../components/SceneBackground'
import { useStore } from '../context/StoreContext'
import { productGallery, productLongText } from '../types'
import {
  formatPrice,
  openWhatsApp,
  productWhatsAppUrl,
} from '../lib/whatsapp'

/** Legacy seed IDs from early deploys → live numeric IDs */
const LEGACY_PRODUCT_IDS: Record<string, string> = {
  p1: '4',
  p2: '3',
  p3: '1',
  p4: '2',
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { content, addToCart } = useStore()
  const rawId = String(id || '')
  const canonicalId = LEGACY_PRODUCT_IDS[rawId] || rawId

  const product = content.products.find(
    (p) => String(p.id) === canonicalId || String(p.id) === rawId,
  )
  const gallery = useMemo(
    () => (product ? productGallery(product) : []),
    [product],
  )
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (LEGACY_PRODUCT_IDS[rawId] && product) {
    return <Navigate to={`/store/product/${LEGACY_PRODUCT_IDS[rawId]}`} replace />
  }

  if (!product) {
    return <Navigate to="/store" replace />
  }

  const img = gallery[Math.min(active, gallery.length - 1)] || product.image

  return (
    <>
      <Header />
      <main>
        <SceneBackground />
        <section className="product-detail">
          <div className="store-container">
            <nav className="store-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Inicio</Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <Link
                to={`/store?category=${encodeURIComponent(product.category)}`}
              >
                {product.category}
              </Link>
              <i className="ri-arrow-right-s-line" aria-hidden="true" />
              <span>{product.name}</span>
            </nav>

            <div className="product-detail-grid">
              <div className="product-media-stack">
                <div className="product-gallery">
                  <button
                    className="product-main-image is-expandable"
                    type="button"
                    onClick={() => setLightbox(true)}
                    aria-label="Ampliar imagen"
                  >
                    <img src={img} alt={product.name} />
                    <span className="product-image-zoom">
                      <i className="ri-fullscreen-line" />
                      Ampliar imagen
                    </span>
                  </button>
                  {gallery.length > 1 && (
                    <div className="product-thumbnails" role="list">
                      {gallery.map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          className={index === active ? 'active' : ''}
                          onClick={() => setActive(index)}
                          aria-label={`Imagen ${index + 1}`}
                          aria-current={index === active ? 'true' : undefined}
                        >
                          <img src={src} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!!product.features?.length && (
                  <section className="product-features">
                    <h2>Características</h2>
                    <ul>
                      {product.features.map((f) => (
                        <li key={f}>
                          <span className="product-feature-check" aria-hidden="true">
                            ✓
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside className="product-info">
                <div className="product-type-row">
                  <span className="product-type">{product.typeLabel}</span>
                  {product.featured && (
                    <span className="featured-label">
                      <i className="ri-star-fill" aria-hidden="true" />
                      Destacado
                    </span>
                  )}
                </div>

                <h1>{product.name}</h1>
                {product.sku && (
                  <p className="product-sku">SKU: {product.sku}</p>
                )}

                <div className="product-detail-price">
                  <strong>{formatPrice(product.price)}</strong>
                </div>

                <div
                  className={`stock-line ${product.inStock === false ? 'unavailable' : 'available'}`}
                >
                  <i
                    className={
                      product.inStock === false
                        ? 'ri-close-circle-fill'
                        : 'ri-checkbox-circle-fill'
                    }
                    aria-hidden="true"
                  />
                  {product.inStock === false ? 'No disponible' : 'Disponible'}
                </div>

                <p className="product-description">{productLongText(product)}</p>

                <div className="product-delivery">
                  <i className="ri-time-line" aria-hidden="true" />
                  <span>
                    Tiempo de entrega
                    <small>{product.deliveryTime || '24 ~ 72 hr'}</small>
                  </span>
                </div>

                {(product.includes?.length || product.compatibility?.length) ? (
                  <div className="product-extra-grid">
                    {!!product.includes?.length && (
                      <section>
                        <h3>
                          <i className="ri-checkbox-circle-line" aria-hidden="true" />
                          Incluye
                        </h3>
                        <ul>
                          {product.includes.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {!!product.compatibility?.length && (
                      <section>
                        <h3>
                          <i className="ri-computer-line" aria-hidden="true" />
                          Compatibilidad
                        </h3>
                        <ul>
                          {product.compatibility.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                ) : null}

                <div className="product-buy-actions">
                  <button
                    type="button"
                    className="store-btn primary wa-btn product-buy-primary"
                    onClick={() =>
                      openWhatsApp(productWhatsAppUrl(content, product))
                    }
                  >
                    <i className="ri-whatsapp-fill" aria-hidden="true" />
                    Comprar por WhatsApp
                  </button>
                  <button
                    type="button"
                    className="store-btn secondary product-buy-secondary"
                    onClick={() => addToCart(product.id)}
                  >
                    <i className="ri-shopping-cart-2-line" aria-hidden="true" />
                    Agregar a la lista
                  </button>
                </div>

                <div className="product-benefits">
                  <div>
                    <i className="ri-shield-check-line" aria-hidden="true" />
                    <span>
                      Compra segura
                      <small>Transacciones protegidas</small>
                    </span>
                  </div>
                  <div>
                    <i className="ri-customer-service-2-line" aria-hidden="true" />
                    <span>
                      Soporte
                      <small>Estamos para ayudarte</small>
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {lightbox && (
        <div
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="product-lightbox-close"
            aria-label="Cerrar"
            onClick={() => setLightbox(false)}
          >
            <i className="ri-close-line" />
          </button>
          <figure
            className="product-lightbox-figure"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={img} alt={product.name} />
            <figcaption>
              {product.name} · {active + 1} / {gallery.length}
            </figcaption>
          </figure>
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                className="product-lightbox-nav previous"
                aria-label="Anterior"
                onClick={(e) => {
                  e.stopPropagation()
                  setActive((i) => (i - 1 + gallery.length) % gallery.length)
                }}
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              <button
                type="button"
                className="product-lightbox-nav next"
                aria-label="Siguiente"
                onClick={(e) => {
                  e.stopPropagation()
                  setActive((i) => (i + 1) % gallery.length)
                }}
              >
                <i className="ri-arrow-right-s-line" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
