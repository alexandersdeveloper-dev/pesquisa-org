import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const PAGE_SIZE = 25

export default function AuditLog() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const [total, setTotal]     = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const from = page * PAGE_SIZE
      const to   = from + PAGE_SIZE - 1

      const [{ count }, { data }] = await Promise.all([
        supabase.from('audit_log').select('*', { count: 'exact', head: true }),
        supabase.from('audit_log').select('*').order('created_at', { ascending: false }).range(from, to),
      ])
      setTotal(count ?? 0)
      setRows(data ?? [])
      setLoading(false)
    }
    load()
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const fmt = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  const ACTION_LABELS = { create: 'Criar', update: 'Editar', delete: 'Excluir' }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Auditoria</h1>
          <p>Histórico de alterações realizadas no painel.</p>
        </div>
      </div>

      {loading ? (
        <div className="adm-loading">Carregando…</div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Ação</th>
                  <th>Tabela</th>
                  <th>ID do registro</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={5} className="adm-empty">Nenhum registro encontrado.</td></tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="adm-mono">{fmt(r.created_at)}</td>
                    <td>
                      <span className={`adm-badge adm-badge--${r.action}`}>
                        {ACTION_LABELS[r.action] ?? r.action}
                      </span>
                    </td>
                    <td className="adm-mono">{r.table_name}</td>
                    <td className="adm-mono adm-text-clamp" style={{ maxWidth: 200 }}>
                      {r.record_id ?? '—'}
                    </td>
                    <td>
                      {r.diff ? (
                        <details className="adm-diff-details">
                          <summary>Ver dados</summary>
                          <pre className="adm-pre">{JSON.stringify(r.diff, null, 2)}</pre>
                        </details>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="adm-pagination">
            <button className="adm-btn-sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
              ← Anterior
            </button>
            <span className="adm-muted">Página {page + 1} de {totalPages} · {total} registros</span>
            <button className="adm-btn-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}>
              Próxima →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
