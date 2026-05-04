import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Analytics() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState('all')
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    supabase.from('campaigns').select('id, title').order('created_at', { ascending: false })
      .then(({ data: c }) => setCampaigns(c ?? []))
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)

      const [{ data: questions }, { data: answers }, { data: responses }] = await Promise.all([
        supabase
          .from('survey_questions')
          .select('id, text, type, question_options(id, label, sort_order)')
          .in('type', ['likert', 'multi'])
          .eq('active', true)
          .order('sort_order'),
        (campaign === 'all'
          ? supabase.from('response_answers').select('question_id, value, response_id')
          : supabase.from('response_answers').select('question_id, value, response_id')
              .in('response_id',
                supabase.from('responses').select('id').eq('campaign_id', campaign)
              )
        ),
        (campaign === 'all'
          ? supabase.from('responses').select('id, modo')
          : supabase.from('responses').select('id, modo').eq('campaign_id', campaign)
        ),
      ])

      const responseSet = new Set((responses ?? []).map((r) => r.id))
      const filtered = (answers ?? []).filter((a) => responseSet.has(a.response_id))

      const byQuestion = {}
      for (const q of (questions ?? [])) {
        byQuestion[q.id] = { question: q, answers: [] }
      }
      for (const a of filtered) {
        if (byQuestion[a.question_id]) byQuestion[a.question_id].answers.push(a.value)
      }

      setData({ byQuestion, totalResponses: responses?.length ?? 0 })
      setLoading(false)
    }
    load()
  }, [campaign])

  function exportCSV() {
    if (!data) return
    const rows = [['question_id', 'question_text', 'type', 'answer_value']]
    for (const { question, answers } of Object.values(data.byQuestion)) {
      for (const val of answers) {
        const v = Array.isArray(val) ? val.join(' | ') : String(val ?? '')
        rows.push([question.id, `"${question.text.replace(/"/g, '""')}"`, question.type, `"${v}"`])
      }
    }
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'analytics.csv' })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Analytics</h1>
          <p>Médias e distribuições das respostas coletadas.</p>
        </div>
        <div className="adm-head-actions">
          <select className="adm-select-sm" value={campaign} onChange={(e) => setCampaign(e.target.value)}>
            <option value="all">Todas as campanhas</option>
            {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button className="adm-btn-primary" onClick={exportCSV} disabled={loading}>
            ↓ Exportar CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="adm-loading">Carregando…</div>
      ) : (
        <>
          <p className="adm-muted" style={{ marginBottom: 24 }}>
            {data.totalResponses} {data.totalResponses === 1 ? 'resposta' : 'respostas'} no período selecionado.
          </p>
          {Object.values(data.byQuestion).map(({ question, answers }) => (
            <div key={question.id} className="adm-card adm-analytics-card">
              <p className="adm-analytics-q">{question.text}</p>
              <p className="adm-badge">{question.type}</p>

              {question.type === 'likert' && (
                <LikertSummary answers={answers} />
              )}
              {question.type === 'multi' && (
                <MultiSummary answers={answers} options={question.question_options ?? []} />
              )}
            </div>
          ))}
          {Object.keys(data.byQuestion).length === 0 && (
            <p className="adm-muted">Nenhuma resposta registrada ainda.</p>
          )}
        </>
      )}
    </div>
  )
}

function LikertSummary({ answers }) {
  const nums = answers.map(Number).filter((n) => n >= 1 && n <= 5)
  if (nums.length === 0) return <p className="adm-muted">Sem respostas.</p>
  const avg  = nums.reduce((s, n) => s + n, 0) / nums.length
  const dist = [1, 2, 3, 4, 5].map((v) => ({ v, count: nums.filter((n) => n === v).length }))
  const max  = Math.max(...dist.map((d) => d.count), 1)

  return (
    <div className="adm-lik-wrap">
      <p className="adm-lik-avg">Média: <strong>{avg.toFixed(2)}</strong> <span className="adm-muted">({nums.length} resp.)</span></p>
      <div className="adm-bar-chart">
        {dist.map(({ v, count }) => (
          <div key={v} className="adm-bar-col">
            <span className="adm-bar-val">{count}</span>
            <div className="adm-bar" style={{ height: Math.max(4, (count / max) * 80) + 'px' }} />
            <span className="adm-bar-lbl">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MultiSummary({ answers, options }) {
  const sorted = [...options].sort((a, b) => a.sort_order - b.sort_order)
  const flat   = answers.flat()
  const total  = flat.length

  const counts = {}
  for (const label of flat) counts[label] = (counts[label] ?? 0) + 1

  if (total === 0) return <p className="adm-muted">Sem respostas.</p>

  return (
    <div className="adm-multi-wrap">
      {sorted.map((opt) => {
        const count = counts[opt.label] ?? 0
        const pct   = Math.round((count / (answers.length || 1)) * 100)
        return (
          <div key={opt.id} className="adm-multi-row">
            <span className="adm-multi-label">{opt.label}</span>
            <div className="adm-multi-bar-wrap">
              <div className="adm-multi-bar" style={{ width: pct + '%' }} />
            </div>
            <span className="adm-multi-pct">{count} ({pct}%)</span>
          </div>
        )
      })}
    </div>
  )
}
