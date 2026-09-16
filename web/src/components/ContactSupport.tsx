import { useState } from 'react'
import type { FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { generalWhatsAppUrl, openWhatsApp } from '../lib/whatsapp'

export default function ContactSupport() {
  const { content } = useStore()
  const { contact } = content
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    openWhatsApp(generalWhatsAppUrl(content))
  }

  return (
    <section className="commerce-section support-contact-section" id="contact-support">
      <div className="store-container support-contact-grid">
        <div className="support-contact-copy">
          <span className="support-contact-kicker">
            <i className="ri-customer-service-2-line" />
            {contact.overline}
          </span>
          <h1>{contact.title}</h1>
          <p>{contact.subtitle}</p>
          <div className="support-contact-benefits">
            {contact.benefits.map((b) => (
              <article key={b.title}>
                <i className={b.icon} />
                <span>
                  <strong>{b.title}</strong>
                  <small>{b.text}</small>
                </span>
              </article>
            ))}
          </div>
        </div>
        <form className="support-contact-form" onSubmit={onSubmit}>
          {submitted && (
            <div className="support-form-alert success" role="status">
              Abriendo WhatsApp para continuar la conversación…
            </div>
          )}
          <label>
            <span>Tu nombre</span>
            <div>
              <i className="ri-user-3-line" />
              <input
                name="name"
                maxLength={160}
                autoComplete="name"
                placeholder="Nombre completo"
                required
              />
            </div>
          </label>
          <label>
            <span>Tu correo electrónico</span>
            <div>
              <i className="ri-mail-line" />
              <input
                type="email"
                name="email"
                maxLength={190}
                autoComplete="email"
                placeholder="nombre@correo.com"
                required
              />
            </div>
          </label>
          <label>
            <span>Tema de la consulta</span>
            <div>
              <i className="ri-questionnaire-line" />
              <select name="topic" required defaultValue="">
                <option value="" disabled>
                  Selecciona un tema
                </option>
                <option value="sales">Información de compra</option>
                <option value="product">Pregunta sobre un producto</option>
                <option value="customization">Personalización o proyecto</option>
                <option value="technical">Soporte técnico</option>
                <option value="billing">Pago o facturación</option>
                <option value="other">Otra consulta</option>
              </select>
              <i className="ri-arrow-down-s-line" />
            </div>
          </label>
          <label>
            <span>Tu mensaje</span>
            <textarea
              name="message"
              rows={6}
              minLength={10}
              maxLength={10000}
              placeholder="Describe tu consulta con todos los detalles necesarios…"
              required
            />
          </label>
          <button type="submit">
            <i className="ri-whatsapp-fill" />
            Continuar por WhatsApp
          </button>
          <p className="support-contact-privacy">
            <i className="ri-shield-check-line" />
            Te redirigiremos a WhatsApp con el número configurado en el admin.
          </p>
        </form>
      </div>
    </section>
  )
}
