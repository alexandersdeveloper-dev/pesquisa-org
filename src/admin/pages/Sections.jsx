import { useState } from 'react'
import { useSections } from '../../hooks/useSections'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Sections() {
  const { sections, loading, create, update, remove } = useSections()
  const [form, setForm]       = useState(null)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [error, setError]     = useState('')

  function openCreate() { setForm({ label: '' }); setEditing(null); setError('') }
  function openEdit(s)  { setForm({ label: s.label }); setEditing(s.id); setError('') }
  function closeForm()  { setForm(null); setEditing(null) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.label.trim()) { setError('O nome da seção é obrigatório.'); return }
    try {
      if (editing) await update(editing, form)
      else await create(form)
      closeForm()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="adm-loading">Carregando…</div>

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>Seções</h1><p>Agrupe as perguntas em seções temáticas.</p></div>
        <button className="adm-btn-primary" onClick={openCreate}>+ Nova seção</button>
      </div>

      {form !== null && (
        <form className="adm-form adm-card" onSubmit={handleSave}>
          <h3>{editing ? 'Editar seção' : 'Nova seção'}</h3>
          <div className="adm-field">
            <label>Nome</label>
            <input type="text" value={form.label} onChange={(e) => setForm({ label: e.target.value })} required />
          </div>
          {error && <p className="adm-error">{error}</p>}
          <div className="adm-form-actions">
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="adm-btn-primary">Salvar</button>
          </div>
        </form>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>#</th><th>Nome</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {sections.map((s, i) => (
              <tr key={s.id} className={s.active ? '' : 'adm-row-inactive'}>
                <td>{i + 1}</td>
                <td><strong>{s.label}</strong></td>
                <td><span className={'adm-status ' + (s.active ? 'active' : 'inactive')}>{s.active ? 'Ativo' : 'Inativo'}</span></td>
                <td className="adm-actions-cell">
                  <button className="adm-btn-sm" onClick={() => openEdit(s)}>Editar</button>
                  {s.active && <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => setConfirm(s.id)}>Desativar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <ConfirmDialog
          title="Desativar seção"
          message="As perguntas desta seção continuarão existindo, mas a seção não aparecerá no agrupamento."
          onConfirm={async () => { await remove(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
