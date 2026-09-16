const STATS = [
  { icon: 'ri-rocket-2-line', value: '250+', label: 'Aplicaciones entregadas' },
  { icon: 'ri-group-line', value: '80+', label: 'Clientes activos' },
  { icon: 'ri-checkbox-circle-line', value: '99.9%', label: 'Disponibilidad' },
  { icon: 'ri-customer-service-2-line', value: '24/7', label: 'Soporte especializado' },
  { icon: 'ri-palette-line', value: '100%', label: 'Personalización total' },
]

export default function Stats() {
  return (
    <section
      className="commerce-section commerce-stats"
      aria-label="Indicadores de confianza y servicio"
    >
      <div className="store-container">
        <div className="commerce-stats-grid" role="list">
          {STATS.map((stat, index) => (
            <article key={stat.label} role="listitem" style={{ ['--stat-index' as string]: index }}>
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
