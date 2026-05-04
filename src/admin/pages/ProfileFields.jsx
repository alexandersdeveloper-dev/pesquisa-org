import { useState } from 'react'
import { useProfileFields } from '../../hooks/useProfileFields'
import OptionsList from '../components/OptionsList'
import ConfirmDialog from '../components/ConfirmDialog'

const FIELD_TYPES = [
  { value: 'select',   label: 'Seleção (select)' },
  { value: 'input',    label: 'Texto curto (input)' },
  { value: 'textarea', label: 'Comentário (textarea)' },
]

const EMPTY = { label: '', type: 'select', required: true }

export default function ProfileFields() {
  const { fields, loading, create, update, remove, addOption, removeOption } = useProfileFields()
  const [form, setForm]       = useState(null)   // null = fechado
  const [editing, setEditing] = useState(null)   // id sendo editado
  const [confirm, setConfirm] = useState(null)   // id para desativar
  const [newOptions, setNewOptions] = useState([])
  const [error, setError]     = useState('')

  function openCreate() { setForm({ ...EMPTY }); setEditing(null); setNewOptions([]); setError('') }
  function openEdit(f)  { setForm({ label: f.label, type: f.type, required: f.required }); setEditing(f.id); setNewOptions([]); setError('') }
  function closeForm()  { setForm(null); setEditing(null) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.label.trim()) { setError('O rótulo é obrigatório.'); return }
    try {
      if (editing) {
        await update(editing, form)
        for (const label of newOptions) await addOption(editing, label)
      } else {
        const created = await create(form)
        for (const label of newOptions) await addOption(created.id, label)
      }
      closeForm()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="adm-loading">Carregando…</div>

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Perfil do Respondente</h1>
          <p>Gerencie os campos exibidos no passo de identificação.</p>
        </div>
        <button className="adm-btn-primary" onClick={openCreate}>+ Novo campo</button>
      </div>

      {form !== null && (
        <form className="adm-form adm-card" onSubmit={handleSave}>
          <h3>{editing ? 'Editar campo' : 'Novo campo'}</h3>
          <div className="adm-field">
            <label>Rótulo</label>
            <input type="text" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} required />
          </div>
          <div className="adm-field">
            <label>Tipo</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="adm-field adm-checkbox">
            <label>
              <input type="checkbox" checked={form.required} onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))} />
              Campo obrigatório
            </label>
          </div>
          {form.type === 'select' && (
            <div className="adm-field">
              <label>Opções {editing ? '(adicionar novas)' : ''}</label>
              <OptionsList options={newOptions} onChange={setNewOptions} />
            </div>
          )}
          {error && <p className="adm-error">{error}</p>}
          <div className="adm-form-actions">
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>Cancelar</button>
            <button type="submit" className="adm-btn-primary">Salvar</button>
          </div>
        </form>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Ordem</th><th>Rótulo</th><th>Tipo</th><th>Obrigatório</th><th>Status</th><th>Opções</th><th></th></tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={f.id} className={f.active ? '' : 'adm-row-inactive'}>
                <td>{i + 1}</td>
                <td><strong>{f.label}</strong></td>
                <td><span className="adm-badge">{f.type}</span></td>
                <td>{f.required ? 'Sim' : 'Não'}</td>
                <td><span className={'adm-status ' + (f.active ? 'active' : 'inactive')}>{f.active ? 'Ativo' : 'Inativo'}</span></td>
                <td>{f.type === 'select' ? `${f.profile_field_options?.length ?? 0} opções` : '—'}</td>
                <td className="adm-actions-cell">
                  <button className="adm-btn-sm" onClick={() => openEdit(f)}>Editar</button>
                  {f.active && <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => setConfirm(f.id)}>Desativar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <ConfirmDialog
          title="Desativar campo"
          message="O campo não aparecerá mais na pesquisa. Esta ação pode ser revertida editando o campo."
          onConfirm={async () => { await remove(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
