import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAudit } from '../../services/auditService'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)
  const [form, setForm]           = useState(null)
  const [editing, setEditing]     = useState(null)
  const [confirm, setConfirm]     = useState(null) // { id, action }
  const [error, setError]         = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
    setCampaigns(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm({ title: '', starts_at: '', ends_at: '' })
    setEditing(null); setError('')
  }
  function openEdit(c) {
    setForm({ title: c.title, starts_at: c.starts_at ?? '', ends_at: c.ends_at ?? '' })
    setEditing(c.id); setError('')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('O título é obrigatório.'); return }
    try {
      if (editing) {
        await supabase.from('campaigns').update(form).eq('id', editing)
        await logAudit('update', 'campaigns', editing, null, form)
      } else {
        const { data } = await supabase.from('campaigns').insert(form).select().single()
        await logAudit('create', 'campaigns', data.id, null, form)
      }
      setForm(null); setEditing(null); await load()
    } catch (err) { setError(err.message) }
  }

  async function activate(id) {
    // Desativa todas, ativa a selecionada
    await supabase.from('campaigns').update({ active: false }).neq('id', id)
    await supabase.from('campaigns').update({ active: true }).eq('id', id)
    await logAudit('update', 'campaigns', id, null, { active: true })
    await load()
    setConfirm(null)
  }

  if (loading) return <div className="adm-loading">Carregando…</div>

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>Campanhas</h1><p>Gerencie os ciclos da pesquisa. Apenas uma pode estar ativa por vez.</p></div>
        <button className="adm-btn-primary" onClick={openCreate}>+ Nova campanha</button>
      </div>

      {form !== null && (
        <form className="adm-form adm-card" onSubmit={handleSave}>
          <h3>{editing ? 'Editar campanha' : 'Nova campanha'}</h3>
          <div className="adm-field">
            <label>Título</label>
            <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Início</label>
              <input type="date" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} />
            </div>
            <div className="adm-field">
              <label>Fim</label>
              <input type="date" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
            </div>
          </div>
          {error && <p className="adm-error">{error}</p>}
          <div className="adm-form-actions">
            <button type="button" className="adm-btn-ghost" onClick={() => setForm(null)}>Cancelar</button>
            <button type="submit" className="adm-btn-primary">Salvar</button>
          </div>
        </form>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Título</th><th>Início</th><th>Fim</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.title}</strong></td>
                <td>{c.starts_at ?? '—'}</td>
                <td>{c.ends_at ?? '—'}</td>
                <td><span className={'adm-status ' + (c.active ? 'active' : 'inactive')}>{c.active ? '● Ativa' : 'Inativa'}</span></td>
                <td className="adm-actions-cell">
                  <button className="adm-btn-sm" onClick={() => openEdit(c)}>Editar</button>
                  {!c.active && (
                    <button className="adm-btn-sm adm-btn-success-sm" onClick={() => setConfirm({ id: c.id, action: 'activate' })}>
                      Ativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm?.action === 'activate' && (
        <ConfirmDialog
          title="Ativar campanha"
          message="A campanha atual será desativada. Esta campanha passará a ser a ativa para a pesquisa pública."
          onConfirm={() => activate(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
