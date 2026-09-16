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

  const buyWhatsApp = () => {
    openWhatsApp(productWhatsAppUrl(content, product))
  }

  return (
    <article className="store-product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
        {showBadge && product.featured && <span>Destacado</span>}
      </div>
      <div className="product-card-body">
        <small>{product.typeLabel}</small>
        <h3>{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div>
          <p>
            <strong>{formatPrice(product.price)}</strong>
          </p>
          <div className="product-card-actions">
            <button
              className="product-arrow"
              type="button"
              aria-label="Consultar por WhatsApp"
              title="Consultar por WhatsApp"
              onClick={buyWhatsApp}
            >
              <i className="ri-whatsapp-line" />
            </button>
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
