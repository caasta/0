import { useStore } from '../context/StoreContext'

export default function Stats() {
  const { content } = useStore()

  return (
    <section
      className="commerce-section commerce-stats"
      aria-label="Indicadores de confianza y servicio"
    >
      <div className="store-container">
        <div className="commerce-stats-grid" role="list">
          {content.stats.map((stat, index) => (
            <article
              key={stat.id}
              role="listitem"
              style={{ ['--stat-index' as string]: index }}
            >
              <i className={stat.icon} />
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
