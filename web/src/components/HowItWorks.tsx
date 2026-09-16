import { useStore } from '../context/StoreContext'

export default function HowItWorks() {
  const { content } = useStore()
  const { how } = content

  return (
    <section className="commerce-section commerce-how">
      <div className="store-container">
        <header className="commerce-section-head">
          <div>
            <span>{how.overline}</span>
            <h2>{how.title}</h2>
            <p>{how.subtitle}</p>
          </div>
        </header>
        <div className="commerce-how-grid">
          {how.steps.map((step) => (
            <article key={step.id}>
              <b>{step.number}</b>
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
