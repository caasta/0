import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SceneBackground from '../components/SceneBackground'
import { useStore } from '../context/StoreContext'
import {
  formatPrice,
  openWhatsApp,
  productWhatsAppUrl,
} from '../lib/whatsapp'

export default function StorePage() {
  const { content, addToCart } = useStore()
  const [params, setParams] = useSearchParams()
  const [draftQ, setDraftQ] = useState(params.get('q') || '')

  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const type = params.get('type') || ''
  const sort = params.get('sort') || 'recent'

  const filtered = useMemo(() => {
    let list = [...content.products]
    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle),
      )
    }
    if (category) {
      list = list.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      )
    }
    if (type) {
      const map: Record<string, string> = {
        digital: 'producto digital',
        custom: 'personalizado',
        service: 'servicio',
        physical: 'producto físico',
      }
      const label = map[type] || type
      list = list.filter((p) => p.typeLabel.toLowerCase().includes(label))
    }
    switch (sort) {
      case 'featured':
        list.sort((a, b) => Number(b.featured) - Number(a.featured))
        break
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        break
      default:
        break
    }
    return list
  }, [content.products, q, category, type, sort])

  const applyFilters = (e: FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (draftQ.trim()) next.set('q', draftQ.trim())
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    for (const key of ['category', 'type', 'sort'] as const) {
      const val = String(data.get(key) || '')
      if (val) next.set(key, val)
    }
    setParams(next)
  }

  const clearFilters = () => {
    setDraftQ('')
    setParams({})
  }

  return (
    <>
      <Header />
      <main>
        <SceneBackground />
        <section className="modern-catalog">
          <div className="store-container">
            <nav className="catalog-breadcrumb">
              <Link to="/">Inicio</Link>
              <i className="ri-arrow-right-s-line" />
              <span>Tienda</span>
            </nav>
            <div className="catalog-shell">
              <aside>
                <details className="catalog-filter" open>
                  <summary>
                    <i className="ri-equalizer-3-line" />
                    Filtros
                  </summary>
                  <form onSubmit={applyFilters}>
                    <label>
                      Buscar
                      <input
                        name="q"
                        value={draftQ}
                        onChange={(e) => setDraftQ(e.target.value)}
                        placeholder="Buscar productos…"
                      />
                    </label>
                    <label>
                      Categoría
                      <select name="category" defaultValue={category}>
                        <option value="">Todas las categorías</option>
                        {content.categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Tipo
                      <select name="type" defaultValue={type}>
                        <option value="">Todos los tipos</option>
                        <option value="custom">Personalizado</option>
                        <option value="physical">Producto físico</option>
                        <option value="digital">Producto digital</option>
                        <option value="service">Servicio</option>
                      </select>
                    </label>
                    <label>
                      Ordenar por
                      <select name="sort" defaultValue={sort}>
                        <option value="recent">Más recientes</option>
                        <option value="featured">Destacados primero</option>
                        <option value="price_asc">Precio: menor a mayor</option>
                        <option value="price_desc">Precio: mayor a menor</option>
                        <option value="name">Nombre: A–Z</option>
                      </select>
                    </label>
                    <div className="catalog-filter-actions">
                      <button type="submit">
                        <i className="ri-filter-3-line" />
                        &nbsp;Aplicar filtros
                      </button>
                      <button type="button" className="catalog-clear" onClick={clearFilters}>
                        Limpiar
                      </button>
                    </div>
                  </form>
                </details>
              </aside>
              <div>
                <header className="catalog-results-head">
                  <div>
                    <span>Catálogo</span>
                    <h1>
                      {category
                        ? category
                        : q
                          ? `Resultados para “${q}”`
                          : 'Todos los productos'}
                    </h1>
                  </div>
                  <div className="catalog-results-count">
                    {filtered.length} producto{filtered.length === 1 ? '' : 's'}
                  </div>
                </header>
                <div className="modern-product-grid">
                  {filtered.map((product) => (
                    <article className="catalog-product-card" key={product.id}>
                      <Link
                        className="catalog-product-image"
                        to={`/store/product/${product.id}`}
                      >
                        <img src={product.image} alt={product.name} />
                        {product.featured && (
                          <span className="catalog-featured">Destacado</span>
                        )}
                      </Link>
                      <div className="catalog-product-body">
                        <div className="catalog-product-meta">
                          <span>{product.typeLabel}</span>
                          <small>
                            <i className="ri-time-line" />
                            {product.deliveryTime || '24 ~ 72 hr'}
                          </small>
                        </div>
                        <h3>
                          <Link to={`/store/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p>{product.description}</p>
                        <div className="catalog-product-bottom">
                          <div className="catalog-price">
                            <strong>{formatPrice(product.price)}</strong>
                          </div>
                          <div className="catalog-card-actions">
                            <Link
                              className="catalog-card-view"
                              to={`/store/product/${product.id}`}
                              aria-label="Ver producto"
                            >
                              <i className="ri-eye-line" />
                            </Link>
                            <button
                              className="product-card-cart"
                              type="button"
                              aria-label="Agregar a la lista"
                              title="Agregar a la lista"
                              onClick={() => addToCart(product.id)}
                            >
                              <i className="ri-add-line" />
                            </button>
                            <button
                              className="product-card-cart wa"
                              type="button"
                              aria-label="Comprar por WhatsApp"
                              title="Comprar por WhatsApp"
                              onClick={() =>
                                openWhatsApp(productWhatsAppUrl(content, product))
                              }
                            >
                              <i className="ri-whatsapp-line" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {!filtered.length && (
                  <div className="store-empty">
                    <i className="ri-inbox-line" />
                    <h3>Sin resultados</h3>
                    <p>Prueba otros filtros o limpia la búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
