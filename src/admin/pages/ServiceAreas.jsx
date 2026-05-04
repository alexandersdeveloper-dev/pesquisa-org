import { useState } from 'react'
import { useServiceAreas } from '../../hooks/useServiceAreas'
import ConfirmDialog from '../components/ConfirmDialog'

const EMPTY = { title: '', description: '' }

function AreaOptions({ area, onAdd, onUpdate, onRemove }) {
  const [newLabel, setNewLabel]   = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [saving, setSaving]       = useState(false)

  async function handleAdd() {
    if (!newLabel.trim()) return
    setSaving(true)
    await onAdd(area.id, newLabel.trim())
    setNewLabel('')
    setSaving(false)
  }

  function startEdit(opt) {
    setEditingId(opt.id)
    setEditLabel(opt.label)
  }

  async function handleUpdate(id) {
    if (!editLabel.trim()) return
    await onUpdate(id, editLabel.trim())
    setEditingId(null)
  }

  return (
    <div className="adm-area-opts">
      <div className="adm-area-opts-title">Opções de {area.title}</div>
      {area.options.length === 0 && (
        <p className="adm-area-opts-empty">Nenhuma opção ainda.</p>
      )}
      <div className="adm-area-opts-list">
        {area.options.map((opt) => (
          <div key={opt.id} className="adm-area-opt-item">
            {editingId === opt.id ? (
              <>
                <input
                  className="adm-area-opt-input"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(opt.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="adm-btn-sm" onClick={() => handleUpdate(opt.id)}>Salvar</button>
                  <button className="adm-btn-sm adm-btn-ghost" onClick={() => setEditingId(null)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <span>{opt.label}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="adm-btn-sm" onClick={() => startEdit(opt)}>Editar</button>
                  <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => onRemove(opt.id)}>Remover</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="adm-options-add">
        <input
          type="text"
          placeholder="Nova opção (ex: UBS Central, Escola Municipal…)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
        />
        <button type="button" className="adm-btn-ghost" onClick={handleAdd} disabled={saving || !newLabel.trim()}>
          Adicionar
        </button>
      </div>
    </div>
  )
}

export default function ServiceAreas() {
  const { areas, loading, create, update, remove, addOption, updateOption, removeOption } = useServiceAreas()
  const [form, setForm]           = useState(null)
  const [editing, setEditing]     = useState(null)
  const [confirm, setConfirm]     = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [error, setError]         = useState('')

  function openCreate() { setForm(EMPTY); setEditing(null); setError('') }
  function openEdit(a)  { setForm({ title: a.title, description: a.description ?? '' }); setEditing(a.id); setError('') }
  function closeForm()  { setForm(null); setEditing(null) }
  function toggleExpand(id) { setExpandedId((prev) => prev === id ? null : id) }

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
          <p>Defina as áreas e suas unidades (UBS, hospitais, escolas…). Cada área pode ter perguntas exclusivas.</p>
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
              placeholder="Ex: Saúde, Educação…"
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>
          <div className="adm-field">
            <label>Descrição <span style={{ fontWeight: 400, color: 'var(--ink-500)' }}>(opcional)</span></label>
            <textarea
              placeholder="Breve descrição exibida ao respondente."
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
              <tr><th>#</th><th>Nome</th><th>Opções</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {active.length === 0 && (
                <tr><td colSpan={5} style={{ color: 'var(--ink-500)', textAlign: 'center', padding: '24px' }}>
                  Nenhuma área criada ainda.
                </td></tr>
              )}
              {active.map((a, i) => (
                <>
                  <tr key={a.id}>
                    <td style={{ color: 'var(--ink-500)', width: '40px' }}>{i + 1}</td>
                    <td>
                      <strong>{a.title}</strong>
                      {a.description && <div style={{ fontSize: '12px', color: 'var(--ink-400)', marginTop: '2px' }}>{a.description}</div>}
                    </td>
                    <td>
                      <span className="adm-badge">{a.options.length} {a.options.length === 1 ? 'opção' : 'opções'}</span>
                    </td>
                    <td><span className="adm-status active">Ativo</span></td>
                    <td className="adm-actions-cell">
                      <button className="adm-btn-sm" onClick={() => toggleExpand(a.id)}>
                        {expandedId === a.id ? 'Fechar' : 'Opções'}
                      </button>
                      <button className="adm-btn-sm" onClick={() => openEdit(a)}>Editar</button>
                      <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => setConfirm(a.id)}>Desativar</button>
                    </td>
                  </tr>
                  {expandedId === a.id && (
                    <tr key={a.id + '-opts'}>
                      <td colSpan={5} style={{ padding: 0, background: 'var(--bg-soft)' }}>
                        <AreaOptions area={a} onAdd={addOption} onUpdate={updateOption} onRemove={removeOption} />
                      </td>
                    </tr>
                  )}
                </>
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
              <thead><tr><th>Nome</th><th>Opções</th><th></th></tr></thead>
              <tbody>
                {inactive.map((a) => (
                  <tr key={a.id} className="adm-row-inactive">
                    <td><strong>{a.title}</strong></td>
                    <td><span className="adm-badge">{a.options.length}</span></td>
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
          message="A área não aparecerá mais na pesquisa. As opções e perguntas vinculadas são preservadas."
          onConfirm={async () => { await remove(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
