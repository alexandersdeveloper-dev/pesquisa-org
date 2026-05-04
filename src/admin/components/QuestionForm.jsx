import { useState } from 'react'
import OptionsList from './OptionsList'

const TYPES = [
  { value: 'likert', label: 'Likert (1–5)' },
  { value: 'multi',  label: 'Múltipla escolha' },
  { value: 'text',   label: 'Texto / Comentário' },
]

export default function QuestionForm({ initial = {}, sections = [], areas = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    section_id:     initial.section_id     ?? '',
    area_id:        initial.area_id        ?? '',
    type:           initial.type           ?? 'likert',
    text:           initial.text           ?? '',
    sub:            initial.sub            ?? '',
    max_selections: initial.max_selections ?? 3,
    required:       initial.required       ?? true,
    active:         initial.active         ?? true,
  })
  const [options, setOptions] = useState(
    (initial.question_options ?? []).map((o) => o.label)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.text.trim()) { setError('O texto da pergunta é obrigatório.'); return }
    if (form.type === 'multi' && options.length < 2) { setError('Adicione pelo menos 2 opções.'); return }
    setSaving(true)
    try {
      const values = { ...form, area_id: form.area_id || null }
      await onSave(values, form.type === 'multi' ? options : [])
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="adm-field">
          <label>Área / Serviço</label>
          <select value={form.area_id} onChange={(e) => set('area_id', e.target.value)}>
            <option value="">Todas as áreas (global)</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
          <span className="adm-field-hint">
            {form.area_id ? 'Exibida somente para quem selecionar esta área.' : 'Exibida para todos os respondentes.'}
          </span>
        </div>
        <div className="adm-field">
          <label>Seção</label>
          <select value={form.section_id} onChange={(e) => set('section_id', e.target.value)}>
            <option value="">Sem seção</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="adm-field">
        <label>Tipo</label>
        <select value={form.type} onChange={(e) => set('type', e.target.value)}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className="adm-field">
        <label>Pergunta</label>
        <textarea value={form.text} onChange={(e) => set('text', e.target.value)} rows={3} required />
      </div>
      <div className="adm-field">
        <label>Subtítulo / Instrução <span style={{ fontWeight: 400, color: 'var(--ink-500)' }}>(opcional)</span></label>
        <input type="text" value={form.sub} onChange={(e) => set('sub', e.target.value)} />
      </div>
      {form.type === 'multi' && (
        <>
          <div className="adm-field">
            <label>Máximo de seleções</label>
            <input type="number" min={1} max={20} value={form.max_selections}
              onChange={(e) => set('max_selections', parseInt(e.target.value, 10))} />
          </div>
          <div className="adm-field">
            <label>Opções</label>
            <OptionsList options={options} onChange={setOptions} />
          </div>
        </>
      )}
      <div className="adm-field adm-checkbox">
        <label>
          <input type="checkbox" checked={form.required} onChange={(e) => set('required', e.target.checked)} />
          Resposta obrigatória
        </label>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-form-actions">
        <button type="button" className="adm-btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="adm-btn-primary" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
