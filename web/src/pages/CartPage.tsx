import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useStore } from '../context/StoreContext'
import { cartWhatsAppUrl, formatPrice, openWhatsApp } from '../lib/whatsapp'

export default function CartPage() {
  const { cartProducts, setQuantity, removeFromCart, clearCart, content } =
    useStore()
  const [toast, setToast] = useState('')

  const total = useMemo(
    () =>
      cartProducts.reduce(
        (sum, row) => sum + row.product.price * row.quantity,
        0,
      ),
    [cartProducts],
  )

  const continueWhatsApp = (e: FormEvent) => {
    e.preventDefault()
    if (!cartProducts.length) return
    const url = cartWhatsAppUrl(
      content,
      cartProducts.map((r) => ({
        name: r.product.name,
        price: r.product.price,
        quantity: r.quantity,
      })),
    )
    openWhatsApp(url)
    setToast('Abriendo WhatsApp con tu pedido…')
  }

  return (
    <>
      <Header />
      <main className="cart-page">
        <div className="store-container">
          <header className="commerce-section-head">
            <div>
              <span>Pedido</span>
              <h2>Tu lista</h2>
              <p>
                Revisa los productos y continúa por WhatsApp. No hay checkout con
                tarjeta en esta demo.
              </p>
            </div>
            <Link to="/#featured">Seguir explorando</Link>
          </header>

          {!cartProducts.length ? (
            <div className="store-empty">
              <i className="ri-shopping-cart-2-line" />
              <h3>Tu lista está vacía</h3>
              <p>Agrega productos desde el catálogo para consultar por WhatsApp.</p>
              <Link className="store-btn primary" to="/#featured">
                Ver productos
              </Link>
            </div>
          ) : (
            <form className="cart-layout" onSubmit={continueWhatsApp}>
              <div className="cart-lines">
                {cartProducts.map(({ product, quantity }) => (
                  <article key={product.id} className="cart-line">
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                      <p>{formatPrice(product.price)}</p>
                    </div>
                    <label>
                      Cant.
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(product.id, Number(e.target.value) || 1)
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="store-icon"
                      aria-label="Quitar"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </article>
                ))}
              </div>
              <aside className="cart-summary">
                <h3>Resumen</h3>
                <p>
                  Total estimado <strong>{formatPrice(total)}</strong>
                </p>
                <p className="cart-wa-hint">
                  Número WhatsApp configurado:{' '}
                  <code>{content.whatsapp.phone || 'sin configurar'}</code>
                </p>
                <button type="submit" className="store-btn primary wa-btn">
                  <i className="ri-whatsapp-line" />
                  Continuar por WhatsApp
                </button>
                <button
                  type="button"
                  className="store-btn secondary"
                  onClick={clearCart}
                >
                  Vaciar lista
                </button>
                {toast && <p className="cart-toast">{toast}</p>}
              </aside>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
