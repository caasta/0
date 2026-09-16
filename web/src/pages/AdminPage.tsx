import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import type { Product, SiteContent } from '../types'
import { formatPrice } from '../lib/whatsapp'

type Tab =
  | 'hero'
  | 'stats'
  | 'products'
  | 'how'
  | 'contact'
  | 'footer'
  | 'whatsapp'
  | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'hero', label: 'Hero', icon: 'ri-layout-top-2-line' },
  { id: 'stats', label: 'Stats', icon: 'ri-bar-chart-2-line' },
  { id: 'products', label: 'Productos', icon: 'ri-shopping-bag-3-line' },
  { id: 'how', label: 'Cómo funciona', icon: 'ri-flow-chart' },
  { id: 'contact', label: 'Contacto', icon: 'ri-customer-service-2-line' },
  { id: 'footer', label: 'Footer', icon: 'ri-layout-bottom-2-line' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'ri-whatsapp-line' },
  { id: 'settings', label: 'Ajustes', icon: 'ri-settings-3-line' },
]

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function AdminPage() {
  const {
    adminAuthed,
    authChecked,
    content,
    setContent,
    resetContent,
    exportJson,
    importJson,
    logoutAdmin,
    changeAdminPassword,
  } = useStore()
  const [tab, setTab] = useState<Tab>('products')
  const [draft, setDraft] = useState<SiteContent>(content)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNext, setPwdNext] = useState('')
  const [importText, setImportText] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(content)
  }, [content])

  const editingProduct = useMemo(
    () => draft.products.find((p) => p.id === editingId) ?? null,
    [draft.products, editingId],
  )

  if (authChecked && !adminAuthed) {
    return <Navigate to="/admin/login" replace />
  }
  if (!authChecked) {
    return (
      <div className="admin-login-page">
        <p>Verificando sesión…</p>
      </div>
    )
  }

  const syncDraft = (next: SiteContent) => setDraft(next)

  const save = async () => {
    setSaving(true)
    try {
      await setContent(draft)
      setSavedAt(new Date().toLocaleTimeString())
      setNotice('Cambios guardados en el servidor. Todos los visitantes verán esta versión.')
    } catch (err) {
      setNotice(
        err instanceof Error ? err.message : 'No se pudo guardar en el servidor',
      )
    } finally {
      setSaving(false)
    }
  }

  const upsertProduct = (product: Product) => {
    const exists = draft.products.some((p) => p.id === product.id)
    syncDraft({
      ...draft,
      products: exists
        ? draft.products.map((p) => (p.id === product.id ? product : p))
        : [...draft.products, product],
    })
    setEditingId(product.id)
    setNotice('Producto actualizado en el borrador. Pulsa Guardar.')
  }

  const deleteProduct = (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    syncDraft({
      ...draft,
      products: draft.products.filter((p) => p.id !== id),
    })
    if (editingId === id) setEditingId(null)
  }

  const blankProduct = (): Product => ({
    id: `p${Date.now()}`,
    name: 'Nuevo producto',
    price: 0,
    description: '',
    category: draft.categories[0] || 'General',
    typeLabel: 'Producto digital',
    featured: false,
    image: '/placeholders/product-1.svg',
  })

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={draft.logoUrl} alt="" />
          <div>
            <strong>{draft.brandName}</strong>
            <small>CMS demo</small>
          </div>
        </div>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              <i className={t.icon} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/">Ver tienda</Link>
          <button type="button" onClick={() => void logoutAdmin()}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{TABS.find((t) => t.id === tab)?.label}</h1>
            <p>Edita el contenido y guárdalo en el servidor para todos los visitantes.</p>
          </div>
          <div className="admin-topbar-actions">
            {savedAt && <small>Guardado {savedAt}</small>}
            <button
              type="button"
              className="store-btn primary"
              onClick={() => void save()}
              disabled={saving}
            >
              <i className="ri-save-line" />
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </header>

        {notice && (
          <div className="admin-notice">
            {notice}
            <button type="button" onClick={() => setNotice('')}>
              ×
            </button>
          </div>
        )}

        <div className="admin-panel">
          {tab === 'hero' && (
            <div className="admin-grid-2">
              <Field label="Marca">
                <input
                  value={draft.brandName}
                  onChange={(e) =>
                    syncDraft({ ...draft, brandName: e.target.value })
                  }
                />
              </Field>
              <Field label="Logo URL">
                <input
                  value={draft.logoUrl}
                  onChange={(e) =>
                    syncDraft({ ...draft, logoUrl: e.target.value })
                  }
                />
              </Field>
              <Field label="Kicker">
                <input
                  value={draft.hero.kicker}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: { ...draft.hero, kicker: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Imagen hero URL">
                <input
                  value={draft.hero.image}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: { ...draft.hero, image: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Título">
                <textarea
                  rows={2}
                  value={draft.hero.title}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: { ...draft.hero, title: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Subtítulo">
                <textarea
                  rows={3}
                  value={draft.hero.subtitle}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: { ...draft.hero, subtitle: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="CTA primario">
                <input
                  value={draft.hero.primaryCta}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: { ...draft.hero, primaryCta: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="CTA secundario">
                <input
                  value={draft.hero.secondaryCta}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: { ...draft.hero, secondaryCta: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Trust badges (separados por | )">
                <input
                  value={draft.hero.trust.join(' | ')}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      hero: {
                        ...draft.hero,
                        trust: e.target.value
                          .split('|')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                />
              </Field>
              <Field label="Featured overline / título / subtítulo">
                <input
                  value={draft.featured.overline}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      featured: { ...draft.featured, overline: e.target.value },
                    })
                  }
                  placeholder="Overline"
                />
                <input
                  value={draft.featured.title}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      featured: { ...draft.featured, title: e.target.value },
                    })
                  }
                  placeholder="Título"
                />
                <textarea
                  rows={2}
                  value={draft.featured.subtitle}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      featured: { ...draft.featured, subtitle: e.target.value },
                    })
                  }
                />
              </Field>
            </div>
          )}

          {tab === 'stats' && (
            <div className="admin-stack">
              {draft.stats.map((stat, idx) => (
                <div className="admin-card-row" key={stat.id}>
                  <Field label="Icono (Remix class)">
                    <input
                      value={stat.icon}
                      onChange={(e) => {
                        const stats = [...draft.stats]
                        stats[idx] = { ...stat, icon: e.target.value }
                        syncDraft({ ...draft, stats })
                      }}
                    />
                  </Field>
                  <Field label="Valor">
                    <input
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...draft.stats]
                        stats[idx] = { ...stat, value: e.target.value }
                        syncDraft({ ...draft, stats })
                      }}
                    />
                  </Field>
                  <Field label="Etiqueta">
                    <input
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...draft.stats]
                        stats[idx] = { ...stat, label: e.target.value }
                        syncDraft({ ...draft, stats })
                      }}
                    />
                  </Field>
                </div>
              ))}
            </div>
          )}

          {tab === 'products' && (
            <div className="admin-products">
              <div className="admin-products-list">
                <div className="admin-products-head">
                  <h2>Catálogo ({draft.products.length})</h2>
                  <button
                    type="button"
                    className="store-btn primary"
                    onClick={() => {
                      const p = blankProduct()
                      upsertProduct(p)
                    }}
                  >
                    <i className="ri-add-line" />
                    Nuevo
                  </button>
                </div>
                {draft.products.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`admin-product-item${editingId === p.id ? ' active' : ''}`}
                    onClick={() => setEditingId(p.id)}
                  >
                    <img src={p.image} alt="" />
                    <span>
                      <strong>{p.name}</strong>
                      <small>
                        {formatPrice(p.price)} · {p.category}
                        {p.featured ? ' · Destacado' : ''}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="admin-product-editor">
                {!editingProduct ? (
                  <p>Selecciona un producto o crea uno nuevo.</p>
                ) : (
                  <>
                    <Field label="Nombre">
                      <input
                        value={editingProduct.name}
                        onChange={(e) =>
                          upsertProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <div className="admin-grid-2">
                      <Field label="Precio (USD)">
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct.price}
                          onChange={(e) =>
                            upsertProduct({
                              ...editingProduct,
                              price: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </Field>
                      <Field label="Categoría">
                        <input
                          value={editingProduct.category}
                          list="admin-categories"
                          onChange={(e) =>
                            upsertProduct({
                              ...editingProduct,
                              category: e.target.value,
                            })
                          }
                        />
                        <datalist id="admin-categories">
                          {draft.categories.map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </Field>
                      <Field label="Etiqueta tipo">
                        <input
                          value={editingProduct.typeLabel}
                          onChange={(e) =>
                            upsertProduct({
                              ...editingProduct,
                              typeLabel: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Imagen URL">
                        <input
                          value={editingProduct.image}
                          onChange={(e) =>
                            upsertProduct({
                              ...editingProduct,
                              image: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Descripción">
                      <textarea
                        rows={4}
                        value={editingProduct.description}
                        onChange={(e) =>
                          upsertProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <label className="admin-check">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) =>
                          upsertProduct({
                            ...editingProduct,
                            featured: e.target.checked,
                          })
                        }
                      />
                      Destacado en homepage
                    </label>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="store-btn secondary"
                        onClick={() => deleteProduct(editingProduct.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                    <Field label="Categorías del menú (separadas por coma)">
                      <input
                        value={draft.categories.join(', ')}
                        onChange={(e) =>
                          syncDraft({
                            ...draft,
                            categories: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </Field>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'how' && (
            <div className="admin-stack">
              <Field label="Overline">
                <input
                  value={draft.how.overline}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      how: { ...draft.how, overline: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Título">
                <input
                  value={draft.how.title}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      how: { ...draft.how, title: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Subtítulo">
                <textarea
                  rows={2}
                  value={draft.how.subtitle}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      how: { ...draft.how, subtitle: e.target.value },
                    })
                  }
                />
              </Field>
              {draft.how.steps.map((step, idx) => (
                <div className="admin-card-row" key={step.id}>
                  <Field label="Nº">
                    <input
                      value={step.number}
                      onChange={(e) => {
                        const steps = [...draft.how.steps]
                        steps[idx] = { ...step, number: e.target.value }
                        syncDraft({ ...draft, how: { ...draft.how, steps } })
                      }}
                    />
                  </Field>
                  <Field label="Título">
                    <input
                      value={step.title}
                      onChange={(e) => {
                        const steps = [...draft.how.steps]
                        steps[idx] = { ...step, title: e.target.value }
                        syncDraft({ ...draft, how: { ...draft.how, steps } })
                      }}
                    />
                  </Field>
                  <Field label="Texto">
                    <input
                      value={step.text}
                      onChange={(e) => {
                        const steps = [...draft.how.steps]
                        steps[idx] = { ...step, text: e.target.value }
                        syncDraft({ ...draft, how: { ...draft.how, steps } })
                      }}
                    />
                  </Field>
                </div>
              ))}
            </div>
          )}

          {tab === 'contact' && (
            <div className="admin-grid-2">
              <Field label="Overline">
                <input
                  value={draft.contact.overline}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      contact: { ...draft.contact, overline: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Título">
                <input
                  value={draft.contact.title}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      contact: { ...draft.contact, title: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Subtítulo">
                <textarea
                  rows={4}
                  value={draft.contact.subtitle}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      contact: { ...draft.contact, subtitle: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Final CTA">
                <input
                  value={draft.finalCta.overline}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      finalCta: { ...draft.finalCta, overline: e.target.value },
                    })
                  }
                  placeholder="Overline"
                />
                <input
                  value={draft.finalCta.title}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      finalCta: { ...draft.finalCta, title: e.target.value },
                    })
                  }
                  placeholder="Título"
                />
                <textarea
                  rows={2}
                  value={draft.finalCta.subtitle}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      finalCta: { ...draft.finalCta, subtitle: e.target.value },
                    })
                  }
                />
                <input
                  value={draft.finalCta.button}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      finalCta: { ...draft.finalCta, button: e.target.value },
                    })
                  }
                  placeholder="Botón"
                />
              </Field>
            </div>
          )}

          {tab === 'footer' && (
            <div className="admin-grid-2">
              <Field label="Tagline">
                <textarea
                  rows={2}
                  value={draft.footer.tagline}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      footer: { ...draft.footer, tagline: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Copyright">
                <input
                  value={draft.footer.copyright}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      footer: { ...draft.footer, copyright: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="CTA título / texto / botón">
                <input
                  value={draft.footer.ctaTitle}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      footer: { ...draft.footer, ctaTitle: e.target.value },
                    })
                  }
                />
                <input
                  value={draft.footer.ctaText}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      footer: { ...draft.footer, ctaText: e.target.value },
                    })
                  }
                />
                <input
                  value={draft.footer.ctaButton}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      footer: { ...draft.footer, ctaButton: e.target.value },
                    })
                  }
                />
              </Field>
            </div>
          )}

          {tab === 'whatsapp' && (
            <div className="admin-stack">
              <div className="admin-callout">
                <i className="ri-whatsapp-fill" />
                <div>
                  <strong>Compra por WhatsApp</strong>
                  <p>
                    Los botones de compra / consulta abren un chat con este
                    número. Usa solo dígitos con código de país (ej.{' '}
                    <code>17871234567</code>).
                  </p>
                </div>
              </div>
              <Field label="Número WhatsApp (con código de país, sin +)">
                <input
                  value={draft.whatsapp.phone}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      whatsapp: { ...draft.whatsapp, phone: e.target.value },
                    })
                  }
                  placeholder="15551234567"
                />
              </Field>
              <Field label="Plantilla producto — variables: {name} {price} {category} {description}">
                <textarea
                  rows={3}
                  value={draft.whatsapp.productMessageTemplate}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      whatsapp: {
                        ...draft.whatsapp,
                        productMessageTemplate: e.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Plantilla carrito — variables: {items} {total}">
                <textarea
                  rows={4}
                  value={draft.whatsapp.cartMessageTemplate}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      whatsapp: {
                        ...draft.whatsapp,
                        cartMessageTemplate: e.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="Plantilla general">
                <textarea
                  rows={2}
                  value={draft.whatsapp.generalMessageTemplate}
                  onChange={(e) =>
                    syncDraft({
                      ...draft,
                      whatsapp: {
                        ...draft.whatsapp,
                        generalMessageTemplate: e.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>
          )}

          {tab === 'settings' && (
            <div className="admin-stack">
              <div className="admin-card-block">
                <h3>Cambiar contraseña</h3>
                <Field label="Contraseña actual">
                  <input
                    type="password"
                    value={pwdCurrent}
                    onChange={(e) => setPwdCurrent(e.target.value)}
                  />
                </Field>
                <Field label="Nueva contraseña">
                  <input
                    type="password"
                    value={pwdNext}
                    onChange={(e) => setPwdNext(e.target.value)}
                  />
                </Field>
                <button
                  type="button"
                  className="store-btn primary"
                  onClick={() => {
                    void (async () => {
                      const result = await changeAdminPassword(
                        pwdCurrent,
                        pwdNext,
                      )
                      if (!result.ok) {
                        setNotice(
                          result.error ||
                            'No se pudo cambiar. Verifica la contraseña actual (mín. 4 caracteres).',
                        )
                        return
                      }
                      setPwdCurrent('')
                      setPwdNext('')
                      setNotice(
                        'Contraseña actualizada en el servidor. Vuelve a iniciar sesión.',
                      )
                    })()
                  }}
                >
                  Actualizar contraseña
                </button>
              </div>

              <div className="admin-card-block">
                <h3>Exportar / importar / reset</h3>
                <p>
                  Los datos viven en el servidor (<code>data/content.json</code>
                  ). Exporta un JSON para respaldo o restaura el seed inicial.
                </p>
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="store-btn secondary"
                    onClick={() => {
                      const blob = new Blob([exportJson()], {
                        type: 'application/json',
                      })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'apprebrands-content.json'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Exportar JSON
                  </button>
                  <button
                    type="button"
                    className="store-btn secondary"
                    onClick={() => {
                      if (
                        !confirm(
                          '¿Restablecer todo el contenido al seed de demo?',
                        )
                      )
                        return
                      void (async () => {
                        try {
                          await resetContent()
                          setNotice('Contenido restablecido en el servidor.')
                        } catch (err) {
                          setNotice(
                            err instanceof Error
                              ? err.message
                              : 'No se pudo restablecer',
                          )
                        }
                      })()
                    }}
                  >
                    Reset a seed
                  </button>
                </div>
                <Field label="Pegar JSON para importar">
                  <textarea
                    rows={6}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder='{"brandName":"...", "products":[...]}'
                  />
                </Field>
                <button
                  type="button"
                  className="store-btn primary"
                  onClick={() => {
                    void (async () => {
                      try {
                        await importJson(importText)
                        setImportText('')
                        setNotice('Importación aplicada en el servidor.')
                      } catch (err) {
                        setNotice(
                          err instanceof Error
                            ? err.message
                            : 'No se pudo importar el JSON',
                        )
                      }
                    })()
                  }}
                >
                  Importar JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
