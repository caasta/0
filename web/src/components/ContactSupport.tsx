import { useState } from 'react'
import type { FormEvent } from 'react'

export default function ContactSupport() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="commerce-section support-contact-section" id="contact-support">
      <div className="store-container support-contact-grid">
        <div className="support-contact-copy">
          <span className="support-contact-kicker">
            <i className="ri-customer-service-2-line" />
            Contacto y soporte
          </span>
          <h1>¿Cómo podemos ayudarte?</h1>
          <p>
            Cuéntanos qué necesitas. Crearemos un ticket con número de seguimiento
            para que recibas cada respuesta y mantengas toda la conversación
            organizada.
          </p>
          <div className="support-contact-benefits">
            <article>
              <i className="ri-ticket-2-line" />
              <span>
                <strong>Número de seguimiento</strong>
                <small>Cada consulta se registra como un ticket real.</small>
              </span>
            </article>
            <article>
              <i className="ri-mail-check-line" />
              <span>
                <strong>Correo validado</strong>
                <small>
                  El ticket solo se crea después de confirmar tu dirección.
                </small>
              </span>
            </article>
            <article>
              <i className="ri-history-line" />
              <span>
                <strong>Conversación organizada</strong>
                <small>
                  Consulta el historial completo desde un enlace privado.
                </small>
              </span>
            </article>
          </div>
        </div>
        <form className="support-contact-form" onSubmit={onSubmit}>
          {submitted && (
            <div className="support-form-alert success" role="status">
              Demo: formulario listo. En el sitio real se valida el correo y se
              crea un ticket.
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
          <div className="internal-captcha-widget">
            <img
              src="/placeholders/captcha.svg"
              alt="Imagen de verificación"
            />
            <button type="button" aria-label="Actualizar captcha">
              <i className="ri-refresh-line" />
            </button>
            <input
              type="text"
              name="captcha"
              maxLength={6}
              autoComplete="off"
              placeholder="Escribe el código de la imagen"
              required
            />
          </div>
          <button type="submit">
            <i className="ri-send-plane-fill" />
            Validar correo y continuar
          </button>
          <p className="support-contact-privacy">
            <i className="ri-shield-check-line" />
            Usaremos estos datos únicamente para responder tu solicitud.{' '}
            <a href="#">Política de privacidad</a>
          </p>
        </form>
      </div>
    </section>
  )
}
