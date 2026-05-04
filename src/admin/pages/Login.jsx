import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { session } = useAuth()
  const navigate    = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (session) navigate('/admin', { replace: true })
  }, [session, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <img src="/assets/logpmp.png" alt="Prefeitura de Parintins" />
          <span>Painel Administrativo</span>
        </div>
        <h2>Entrar</h2>
        <p className="adm-login-sub">Acesso restrito a administradores autorizados.</p>
        <form onSubmit={handleSubmit} className="adm-login-form">
          <div className="adm-field">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@parintins.am.gov.br" required autoComplete="email" />
          </div>
          <div className="adm-field">
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required autoComplete="current-password" />
          </div>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="adm-btn-primary" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
