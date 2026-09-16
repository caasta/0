const STEPS = [
  {
    n: '01',
    icon: 'ri-search-eye-line',
    title: 'Elige',
    text: 'Selecciona producto, licencia o servicio.',
  },
  {
    n: '02',
    icon: 'ri-shopping-cart-2-line',
    title: 'Compra',
    text: 'Completa tu pedido desde la tienda.',
  },
  {
    n: '03',
    icon: 'ri-tools-line',
    title: 'Personalizamos',
    text: 'Recibimos tus datos y configuramos tu entrega.',
  },
  {
    n: '04',
    icon: 'ri-download-cloud-2-line',
    title: 'Recibe',
    text: 'Accede a descargas, licencias y soporte desde tu cuenta.',
  },
]

export default function HowItWorks() {
  return (
    <section className="commerce-section commerce-how">
      <div className="store-container">
        <header className="commerce-section-head">
          <div>
            <span>Proceso de compra</span>
            <h2>Cómo funciona</h2>
            <p>Un proceso claro desde la selección hasta la entrega final.</p>
          </div>
        </header>
        <div className="commerce-how-grid">
          {STEPS.map((step) => (
            <article key={step.n}>
              <b>{step.n}</b>
              <i className={step.icon} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
