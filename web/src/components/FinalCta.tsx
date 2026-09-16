import { useStore } from '../context/StoreContext'

export default function FinalCta() {
  const { content } = useStore()
  const { finalCta } = content

  return (
    <section className="commerce-final-cta">
      <div className="store-container">
        <div>
          <span>{finalCta.overline}</span>
          <h2>{finalCta.title}</h2>
          <p>{finalCta.subtitle}</p>
        </div>
        <a className="store-btn primary" href="/store">
          {finalCta.button}
          <i className="ri-arrow-right-line" />
        </a>
      </div>
    </section>
  )
}
