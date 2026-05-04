import { useState } from 'react'
import { useQuestions } from '../../hooks/useQuestions'
import { useServiceAreas } from '../../hooks/useServiceAreas'
import QuestionForm from '../components/QuestionForm'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Questions() {
  const { questions, sections, loading, create, update, remove } = useQuestions()
  const { areas, loading: areasLoading } = useServiceAreas()
  const [mode, setMode]         = useState(null)   // 'create' | { id }
  const [confirm, setConfirm]   = useState(null)
  const [filterArea, setFilterArea] = useState('')  // '' = todas

  if (loading || areasLoading) return <div className="adm-loading">Carregando…</div>

  const editing = mode && mode !== 'create' ? questions.find((q) => q.id === mode.id) : null

  const filtered = filterArea
    ? questions.filter((q) => q.area_id === filterArea)
    : questions

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Perguntas</h1>
          <p>Crie e gerencie as perguntas da pesquisa.</p>
        </div>
        <button className="adm-btn-primary" onClick={() => setMode('create')}>+ Nova pergunta</button>
      </div>

      {mode && (
        <div className="adm-card">
          <div className="adm-card-head">
            <div className="adm-card-head-left">
              <span className="adm-card-eyebrow">Formulário</span>
              <span className="adm-card-title">{mode === 'create' ? 'Nova pergunta' : 'Editar pergunta'}</span>
            </div>
          </div>
          <div className="adm-card-body">
            <QuestionForm
              initial={editing ?? {}}
              sections={sections}
              areas={areas}
              onSave={async (values, opts) => {
                if (mode === 'create') await create(values, opts)
                else await update(editing.id, values, opts)
                setMode(null)
              }}
              onCancel={() => setMode(null)}
            />
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <div className="adm-card-head-left">
            <span className="adm-card-eyebrow">Banco de perguntas</span>
            <span className="adm-card-title">{filtered.length} {filtered.length === 1 ? 'pergunta' : 'perguntas'}</span>
          </div>
          {areas.length > 0 && (
            <div className="adm-card-head-right">
              <select
                className="adm-filter-select"
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
              >
                <option value="">Todas as áreas</option>
                <option value="__global__" disabled>──────────</option>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Pergunta</th>
                <th>Tipo</th>
                <th>Área</th>
                <th>Seção</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-500)' }}>
                    Nenhuma pergunta encontrada.
                  </td>
                </tr>
              )}
              {filtered.map((q, i) => (
                <tr key={q.id} className={q.active ? '' : 'adm-row-inactive'}>
                  <td style={{ color: 'var(--ink-500)', width: '40px' }}>{i + 1}</td>
                  <td style={{ maxWidth: 300 }}><span className="adm-text-clamp">{q.text}</span></td>
                  <td><span className="adm-badge">{q.type}</span></td>
                  <td>
                    {q.service_areas
                      ? <span className="adm-badge adm-badge-area">{q.service_areas.title}</span>
                      : <span style={{ color: 'var(--ink-400)', fontSize: '12px' }}>global</span>}
                  </td>
                  <td style={{ color: 'var(--ink-600)', fontSize: '13px' }}>{q.survey_sections?.label ?? '—'}</td>
                  <td><span className={'adm-status ' + (q.active ? 'active' : 'inactive')}>{q.active ? 'Ativo' : 'Inativo'}</span></td>
                  <td className="adm-actions-cell">
                    <button className="adm-btn-sm" onClick={() => setMode({ id: q.id })}>Editar</button>
                    {q.active && (
                      <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => setConfirm(q.id)}>Desativar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          title="Desativar pergunta"
          message="A pergunta não aparecerá mais na pesquisa. O histórico de respostas é preservado."
          onConfirm={async () => { await remove(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
