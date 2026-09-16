import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { DEFAULT_ADMIN_PASSWORD } from '../data/seed'

export default function AdminLoginPage() {
  const { adminAuthed, loginAdmin } = useStore()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (adminAuthed) return <Navigate to="/admin" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!loginAdmin(password)) {
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
          Demo local. Credenciales por defecto:{' '}
          <code>admin / {DEFAULT_ADMIN_PASSWORD}</code>
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
        <button type="submit" className="store-btn primary">
          Entrar
        </button>
        <a href="/">← Volver a la tienda</a>
      </form>
    </div>
  )
}
