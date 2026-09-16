import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { DEFAULT_ADMIN_PASSWORD } from '../data/seed'

export default function AdminLoginPage() {
  const { adminAuthed, authChecked, loginAdmin } = useStore()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (authChecked && adminAuthed) return <Navigate to="/admin" replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = await loginAdmin(password)
    setBusy(false)
    if (!ok) {
      setError('Contraseña incorrecta')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <div className="admin-login-icon">
          <i className="ri-shield-keyhole-line" />
        </div>
        <h1>Panel de administración</h1>
        <p>
          Autenticación en el servidor. Por defecto:{' '}
          <code>admin / {DEFAULT_ADMIN_PASSWORD}</code> (cámbiala en producción).
        </p>
        <label>
          Usuario
          <input value="admin" readOnly />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            required
          />
        </label>
        {error && <div className="support-form-alert error">{error}</div>}
        <button type="submit" className="store-btn primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
        <a href="/">← Volver a la tienda</a>
      </form>
    </div>
  )
}
