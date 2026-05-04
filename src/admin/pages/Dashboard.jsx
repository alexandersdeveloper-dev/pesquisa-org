import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const IC = {
  responses: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></svg>,
  campaign:  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:     <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  users:     <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
}

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: totalResponses },
        { data: campaigns },
        { data: lastResponse },
      ] = await Promise.all([
        supabase.from('responses').select('*', { count: 'exact', head: true }),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('responses').select('submitted_at, modo').order('submitted_at', { ascending: false }).limit(1),
      ])

      const active = campaigns?.find((c) => c.active) ?? null

      let anonCount = 0, idCount = 0
      if (totalResponses > 0) {
        const [{ count: a }, { count: b }] = await Promise.all([
          supabase.from('responses').select('*', { count: 'exact', head: true }).eq('modo', 'anonimo'),
          supabase.from('responses').select('*', { count: 'exact', head: true }).eq('modo', 'identificado'),
        ])
        anonCount = a ?? 0
        idCount   = b ?? 0
      }

      setStats({
        totalResponses: totalResponses ?? 0,
        activeCampaign: active,
        totalCampaigns: campaigns?.length ?? 0,
        lastAt: lastResponse?.[0]?.submitted_at ?? null,
        anonPct: totalResponses > 0 ? Math.round((anonCount / totalResponses) * 100) : 0,
        idPct:   totalResponses > 0 ? Math.round((idCount   / totalResponses) * 100) : 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="adm-loading">Carregando…</div>

  const fmt = (iso) => iso
    ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : '—'

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Visão Geral</h1>
          <p>Acompanhe os resultados da pesquisa de satisfação.</p>
        </div>
      </div>

      <div className="adm-kpis">
        <div className="adm-kpi adm-kpi-b">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Total de respostas</span>
            <span className="adm-kpi-icon">{IC.responses}</span>
          </div>
          <div className="adm-kpi-num">{stats.totalResponses}</div>
          <div className="adm-kpi-sub">todas as campanhas</div>
        </div>

        <div className="adm-kpi adm-kpi-o">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Campanha ativa</span>
            <span className="adm-kpi-icon">{IC.campaign}</span>
          </div>
          <div className="adm-kpi-num" style={{ fontSize: stats.activeCampaign ? '22px' : '34px' }}>
            {stats.activeCampaign ? stats.activeCampaign.title : '—'}
          </div>
          <div className="adm-kpi-sub">
            {stats.activeCampaign
              ? (stats.activeCampaign.ends_at ? `até ${stats.activeCampaign.ends_at}` : 'em andamento')
              : 'nenhuma ativa'}
          </div>
        </div>

        <div className="adm-kpi adm-kpi-y">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Última resposta</span>
            <span className="adm-kpi-icon">{IC.clock}</span>
          </div>
          <div className="adm-kpi-num" style={{ fontSize: '20px', marginTop: '16px' }}>
            {fmt(stats.lastAt)}
          </div>
          <div className="adm-kpi-sub">{stats.lastAt ? 'horário de Brasília' : 'sem respostas ainda'}</div>
        </div>

        <div className="adm-kpi adm-kpi-r">
          <div className="adm-kpi-header">
            <span className="adm-kpi-label">Anônimas / Identificadas</span>
            <span className="adm-kpi-icon">{IC.users}</span>
          </div>
          <div className="adm-kpi-num">{stats.anonPct}<span style={{ fontSize: '20px', fontWeight: 400 }}>%</span></div>
          <div className="adm-kpi-sub">
            anônimas · {stats.idPct}% identificadas
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <div className="adm-card-head-left">
            <span className="adm-card-eyebrow">Campanhas</span>
            <span className="adm-card-title">
              {stats.totalCampaigns} {stats.totalCampaigns === 1 ? 'ciclo' : 'ciclos'} cadastrados
            </span>
          </div>
        </div>
        <div className="adm-card-body">
          {stats.activeCampaign ? (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-700)', lineHeight: 1.6 }}>
              Campanha ativa: <strong>{stats.activeCampaign.title}</strong>
              {stats.activeCampaign.starts_at && ` — de ${stats.activeCampaign.starts_at}`}
              {stats.activeCampaign.ends_at   && ` até ${stats.activeCampaign.ends_at}`}
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-500)' }}>
              Nenhuma campanha ativa. Acesse a página <strong>Campanhas</strong> para ativar uma.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
