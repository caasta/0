import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useStore } from '../context/StoreContext'
import {
  formatPrice,
  openWhatsApp,
  productWhatsAppUrl,
} from '../lib/whatsapp'

type Props = {
  product: Product
  showBadge?: boolean
}

export default function ProductCard({ product, showBadge = true }: Props) {
  const { content, addToCart } = useStore()
  const detailPath = `/store/product/${product.id}`

  const buyWhatsApp = () => {
    openWhatsApp(productWhatsAppUrl(content, product))
  }

  return (
    <article className="store-product-card">
      <Link className="product-card-image" to={detailPath}>
        <img src={product.image} alt={product.name} />
        {showBadge && product.featured && <span>Destacado</span>}
      </Link>
      <div className="product-card-body">
        <small>{product.typeLabel}</small>
        <h3>
          <Link to={detailPath}>{product.name}</Link>
        </h3>
        <p className="product-card-desc">{product.description}</p>
        <div>
          <p>
            <strong>{formatPrice(product.price)}</strong>
          </p>
          <div className="product-card-actions">
            <Link
              className="product-arrow"
              to={detailPath}
              aria-label="Ver producto"
              title="Ver producto"
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
          </div>
        </div>
        <button type="button" className="product-wa-cta" onClick={buyWhatsApp}>
          <i className="ri-whatsapp-fill" />
          Comprar por WhatsApp
        </button>
      </div>
    </article>
  )
}
