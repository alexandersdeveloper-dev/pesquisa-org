import { useState } from 'react'
import { useServiceAreas } from '../../hooks/useServiceAreas'
import ConfirmDialog from '../components/ConfirmDialog'

const EMPTY = { title: '', description: '' }

export default function ServiceAreas() {
  const { areas, loading, create, update, remove } = useServiceAreas()
  const [form, setForm]       = useState(null)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [error, setError]     = useState('')

  function openCreate() { setForm(EMPTY); setEditing(null); setError('') }
  function openEdit(a)  { setForm({ title: a.title, description: a.description ?? '' }); setEditing(a.id); setError('') }
  function closeForm()  { setForm(null); setEditing(null) }

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('O nome da área é obrigatório.'); return }
    try {
      if (editing) await update(editing, form)
      else         await create(form)
      closeForm()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="adm-loading">Carregando…</div>

  const active   = areas.filter((a) => a.active)
  const inactive = areas.filter((a) => !a.active)

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Áreas / Serviços</h1>
          <p>Defina as áreas ou serviços disponíveis. Cada área pode ter perguntas exclusivas.</p>
        </div>
        <button className="adm-btn-primary" onClick={openCreate}>+ Nova área</button>
      </div>

      {form !== null && (
        <form className="adm-form adm-card" onSubmit={handleSave}>
          <h3>{editing ? 'Editar área' : 'Nova área'}</h3>
          <div className="adm-field">
            <label>Nome da área / serviço</label>
            <input
              type="text"
              placeholder="Ex: Tributação, Saúde, Educação…"
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>
          <div className="adm-field">
            <label>Descrição <span style={{ fontWeight: 400, color: 'var(--ink-500)' }}>(opcional)</span></label>
            <textarea
              placeholder="Breve descrição exibida ao respondente na etapa de seleção de área."
              value={form.description}
              onChange={set('description')}
              rows={2}
            />
          </div>
          {error && <p className="adm-error">{error}</p>}
          <div className="adm-form-actions">
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="adm-btn-primary">Salvar</button>
          </div>
        </form>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <div className="adm-card-head-left">
            <span className="adm-card-eyebrow">Áreas ativas</span>
            <span className="adm-card-title">{active.length} {active.length === 1 ? 'área' : 'áreas'}</span>
          </div>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {active.length === 0 && (
                <tr><td colSpan={4} style={{ color: 'var(--ink-500)', textAlign: 'center', padding: '24px' }}>
                  Nenhuma área criada ainda.
                </td></tr>
              )}
              {active.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--ink-500)', width: '40px' }}>{i + 1}</td>
                  <td><strong>{a.title}</strong></td>
                  <td style={{ color: 'var(--ink-500)', fontSize: '13px' }}>{a.description || '—'}</td>
                  <td className="adm-actions-cell">
                    <button className="adm-btn-sm" onClick={() => openEdit(a)}>Editar</button>
                    <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => setConfirm(a.id)}>Desativar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {inactive.length > 0 && (
        <div className="adm-card">
          <div className="adm-card-head">
            <div className="adm-card-head-left">
              <span className="adm-card-eyebrow">Áreas inativas</span>
              <span className="adm-card-title">{inactive.length} desativadas</span>
            </div>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Nome</th><th>Descrição</th><th></th></tr>
              </thead>
              <tbody>
                {inactive.map((a) => (
                  <tr key={a.id} className="adm-row-inactive">
                    <td><strong>{a.title}</strong></td>
                    <td style={{ color: 'var(--ink-500)', fontSize: '13px' }}>{a.description || '—'}</td>
                    <td className="adm-actions-cell">
                      <button className="adm-btn-sm" onClick={() => update(a.id, { active: true })}>Reativar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title="Desativar área"
          message="A área não aparecerá mais na pesquisa pública. As perguntas vinculadas a ela serão mantidas, mas ficarão ocultas."
          onConfirm={async () => { await remove(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
