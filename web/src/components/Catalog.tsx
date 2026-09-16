import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'

export default function Catalog() {
  const { content } = useStore()
  const [category, setCategory] = useState('Todos')

  const filtered = useMemo(() => {
    if (category === 'Todos') return content.products
    return content.products.filter((p) => p.category === category)
  }, [category, content.products])

  return (
    <section className="commerce-section" id="catalog">
      <div className="store-container">
        <header className="commerce-section-head">
          <div>
            <span>Catálogo completo</span>
            <h2>Todos los productos</h2>
            <p>Filtra por categoría y consulta o agrega a tu lista para WhatsApp.</p>
          </div>
        </header>
        <div className="catalog-filters">
          {['Todos', ...content.categories].map((cat) => (
            <button
              key={cat}
              type="button"
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} showBadge={product.featured} />
          ))}
        </div>
        {!filtered.length && (
          <div className="store-empty">
            <i className="ri-inbox-line" />
            <h3>Sin productos en esta categoría</h3>
          </div>
        )}
      </div>
    </section>
  )
}
