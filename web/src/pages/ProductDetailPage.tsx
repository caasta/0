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

export default function ProductDetailPage() {
  const { id } = useParams()
  const { content, addToCart } = useStore()
  const product = content.products.find((p) => String(p.id) === String(id))
  const gallery = useMemo(
    () => (product ? productGallery(product) : []),
    [product],
  )
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

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
            <div className="store-breadcrumb">
              <Link to="/">Inicio</Link>
              <i className="ri-arrow-right-s-line" />
              <Link to={`/store?category=${encodeURIComponent(product.category)}`}>
                {product.category}
              </Link>
              <i className="ri-arrow-right-s-line" />
              <span>{product.name}</span>
            </div>

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
                    <div className="product-thumbnails">
                      {gallery.map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          className={index === active ? 'active' : ''}
                          onClick={() => setActive(index)}
                          aria-label={`Imagen ${index + 1}`}
                        >
                          <img src={src} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="product-info">
                <div className="product-type-row">
                  <span className="product-type">{product.typeLabel}</span>
                  {product.featured && (
                    <span className="featured-label">Destacado</span>
                  )}
                </div>
                <h1>{product.name}</h1>
                <p className="product-sku">SKU: {product.sku}</p>
                <div className="product-detail-price">
                  <strong>{formatPrice(product.price)}</strong>
                </div>
                <div
                  className={`stock-line ${product.inStock === false ? 'unavailable' : 'available'}`}
                >
                  <i
                    className={
                      product.inStock === false
                        ? 'ri-close-circle-line'
                        : 'ri-checkbox-circle-line'
                    }
                  />
                  {product.inStock === false ? 'No disponible' : 'Disponible'}
                </div>
                <p className="product-description">{productLongText(product)}</p>

                <div className="product-delivery">
                  <i className="ri-time-line" />
                  <span>
                    Tiempo de entrega
                    <small>{product.deliveryTime || '24 ~ 72 hr'}</small>
                  </span>
                </div>

                {(product.includes?.length || product.compatibility?.length) && (
                  <div className="product-extra-grid">
                    {!!product.includes?.length && (
                      <section>
                        <h3>
                          <i className="ri-box-3-line" />
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
                          <i className="ri-cpu-line" />
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
                )}

                <div className="product-buy-actions">
                  <button
                    type="button"
                    className="store-btn primary wa-btn"
                    onClick={() =>
                      openWhatsApp(productWhatsAppUrl(content, product))
                    }
                  >
                    <i className="ri-whatsapp-fill" />
                    Comprar por WhatsApp
                  </button>
                  <button
                    type="button"
                    className="store-btn secondary"
                    onClick={() => addToCart(product.id)}
                  >
                    <i className="ri-add-line" />
                    Agregar a la lista
                  </button>
                </div>

                <div className="product-benefits">
                  <div>
                    <i className="ri-shield-check-line" />
                    <span>
                      Compra segura
                      <small>Consulta y pago coordinados por WhatsApp</small>
                    </span>
                  </div>
                  <div>
                    <i className="ri-customer-service-2-line" />
                    <span>
                      Soporte
                      <small>Estamos para ayudarte</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {!!product.features?.length && (
              <div className="product-detail-after">
                <section className="product-features">
                  <h3>Características</h3>
                  <ul>
                    {product.features.map((f) => (
                      <li key={f}>
                        <span aria-hidden="true">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
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
