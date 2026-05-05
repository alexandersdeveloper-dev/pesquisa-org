import { useState } from 'react'
import { useResponses } from '../../hooks/useResponses'
import ConfirmDialog from '../components/ConfirmDialog'

const fmt = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function AnswerRow({ answer }) {
  const q = answer.survey_questions
  if (!q) return null
  const value = Array.isArray(answer.value)
    ? answer.value.join(', ')
    : String(answer.value ?? '—')
  return (
    <div className="resp-answer-row">
      <span className="resp-answer-q">{q.text}</span>
      <span className="resp-answer-v">{value}</span>
    </div>
  )
}

function ResponseRow({ resp, onDelete }) {
  const [open, setOpen] = useState(false)

  const modeLabel = resp.modo === 'identificado' ? 'Identificado' : 'Anônimo'
  const modeCls   = resp.modo === 'identificado' ? 'adm-badge' : 'adm-badge adm-badge-area'
  const answers   = resp.response_answers ?? []
  const profile   = resp.profile ?? {}

  return (
    <>
      <tr>
        <td className="adm-mono" style={{ fontSize: 12 }}>{resp.protocol}</td>
        <td><span className={modeCls}>{modeLabel}</span></td>
        <td style={{ fontSize: 13, color: 'var(--ink-600)' }}>
          {resp.service_areas?.title ?? '—'}
          {resp.service_area_options?.label && (
            <span style={{ color: 'var(--ink-400)' }}> · {resp.service_area_options.label}</span>
          )}
        </td>
        <td style={{ fontSize: 13, color: 'var(--ink-600)' }}>{resp.campaigns?.title ?? '—'}</td>
        <td className="adm-mono" style={{ fontSize: 12 }}>{fmt(resp.submitted_at)}</td>
        <td className="adm-actions-cell">
          <button className="adm-btn-sm" onClick={() => setOpen((o) => !o)}>
            {open ? 'Fechar' : `Ver (${answers.length})`}
          </button>
          <button className="adm-btn-sm adm-btn-danger-sm" onClick={() => onDelete(resp.id)}>
            Excluir
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6} style={{ padding: 0, background: 'var(--bg-soft)' }}>
            <div className="resp-detail">
              {Object.keys(profile).length > 0 && (
                <div className="resp-profile">
                  <div className="resp-section-label">Perfil</div>
                  {Object.entries(profile).map(([k, v]) => (
                    <div key={k} className="resp-answer-row">
                      <span className="resp-answer-q">{k}</span>
                      <span className="resp-answer-v">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="resp-section-label">Respostas</div>
              {answers.length === 0
                ? <p style={{ color: 'var(--ink-400)', fontSize: 13 }}>Nenhuma resposta registrada.</p>
                : answers.map((a) => <AnswerRow key={a.id} answer={a} />)
              }
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function Responses() {
  const { responses, loading, total, page, setPage, pageSize, remove, removeAll } = useResponses()
  const [confirm, setConfirm]     = useState(null)  // id | 'all'
  const [deleting, setDeleting]   = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  async function handleDelete() {
    setDeleting(true)
    try {
      if (confirm === 'all') await removeAll()
      else await remove(confirm)
    } finally {
      setDeleting(false)
      setConfirm(null)
    }
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Registros de Respostas</h1>
          <p>Todas as pesquisas enviadas. Exclua registros de teste antes de iniciar a avaliação oficial.</p>
        </div>
        {total > 0 && (
          <button className="adm-btn-danger" onClick={() => setConfirm('all')}>
            Limpar todos ({total})
          </button>
        )}
      </div>

      {total > 0 && (
        <div className="adm-alert-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="m10.29 3.86-7.9 13.7A2 2 0 0 0 4 20.56h15.82a2 2 0 0 0 1.61-3l-7.91-13.7a2 2 0 0 0-3.22 0Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Há <strong>{total} {total === 1 ? 'resposta' : 'respostas'}</strong> registradas. Se ainda está em fase de testes, limpe os dados antes de lançar a pesquisa oficial.</span>
        </div>
      )}

      {loading ? (
        <div className="adm-loading">Carregando…</div>
      ) : (
        <div className="adm-card">
          <div className="adm-card-head">
            <div className="adm-card-head-left">
              <span className="adm-card-eyebrow">Respostas</span>
              <span className="adm-card-title">{total} {total === 1 ? 'registro' : 'registros'}</span>
            </div>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Modo</th>
                  <th>Área / Unidade</th>
                  <th>Campanha</th>
                  <th>Enviado em</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {responses.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--ink-400)' }}>
                      Nenhuma resposta registrada ainda.
                    </td>
                  </tr>
                )}
                {responses.map((r) => (
                  <ResponseRow key={r.id} resp={r} onDelete={(id) => setConfirm(id)} />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="adm-pagination">
              <button className="adm-btn-sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                ← Anterior
              </button>
              <span className="adm-muted">Página {page + 1} de {totalPages} · {total} registros</span>
              <button className="adm-btn-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}>
                Próxima →
              </button>
            </div>
          )}
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm === 'all' ? 'Limpar todos os registros' : 'Excluir resposta'}
          message={
            confirm === 'all'
              ? `Todos os ${total} registros serão permanentemente excluídos. Esta ação não pode ser desfeita.`
              : 'Esta resposta e todas as suas respostas associadas serão excluídas permanentemente.'
          }
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
          disabled={deleting}
        />
      )}
    </div>
  )
}
