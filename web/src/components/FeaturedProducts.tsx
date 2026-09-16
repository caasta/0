const PRODUCTS = [
  {
    id: 1,
    image: '/placeholders/product-1.svg',
    type: 'Producto digital',
    title: 'Nova IPTV Player | Aplicación Flutter con panel de administración PHP',
    price: '$79.99',
  },
  {
    id: 2,
    image: '/placeholders/product-2.svg',
    type: 'Personalizado',
    title: 'XOE PLUS Roku',
    price: '$425.00',
  },
  {
    id: 3,
    image: '/placeholders/product-3.svg',
    type: 'Personalizado',
    title: 'XCTV Trailer API Pro',
    price: '$149.00',
  },
  {
    id: 4,
    image: '/placeholders/product-4.svg',
    type: 'Producto digital',
    title: 'Servidor de Correo Profesional',
    price: '$45.00',
  },
]

export default function FeaturedProducts() {
  return (
    <section className="commerce-section commerce-featured" id="featured">
      <div className="store-container">
        <header className="commerce-section-head">
          <div>
            <span>Selección recomendada</span>
            <h2>Productos destacados</h2>
            <p>
              Una selección de productos y servicios recomendados por nuestro
              equipo.
            </p>
          </div>
          <a href="#featured">
            Ver todos
            <i className="ri-arrow-right-line" />
          </a>
        </header>
        <div className="product-grid">
          {PRODUCTS.map((product) => (
            <article className="store-product-card" key={product.id}>
              <a className="product-card-image" href="#featured">
                <img src={product.image} alt={product.title} />
                <span>Destacado</span>
              </a>
              <div className="product-card-body">
                <small>{product.type}</small>
                <h3>
                  <a href="#featured">{product.title}</a>
                </h3>
                <div>
                  <p>
                    <strong>{product.price}</strong>
                  </p>
                  <div className="product-card-actions">
                    <a
                      className="product-arrow"
                      href="#featured"
                      aria-label="Ver producto"
                    >
                      <i className="ri-eye-line" />
                    </a>
                    <button
                      className="product-card-cart"
                      type="button"
                      aria-label="Agregar al carrito"
                      title="Agregar al carrito"
                    >
                      <i className="ri-shopping-cart-2-line" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
