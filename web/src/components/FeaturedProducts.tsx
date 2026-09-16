import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'

export default function FeaturedProducts() {
  const { content } = useStore()
  const products = content.products.filter((p) => p.featured)

  return (
    <section className="commerce-section commerce-featured" id="featured">
      <div className="store-container">
        <header className="commerce-section-head">
          <div>
            <span>{content.featured.overline}</span>
            <h2>{content.featured.title}</h2>
            <p>{content.featured.subtitle}</p>
          </div>
          <a href="#catalog">
            Ver todos
            <i className="ri-arrow-right-line" />
          </a>
        </header>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
