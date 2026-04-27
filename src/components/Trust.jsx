const PATTERN = [
  'b','muted','muted','o','muted','y','muted',
  'muted','r','muted','muted','b','muted','muted',
  'y','muted','b','muted','muted','muted','r',
  'muted','muted','muted','y','o','muted','muted',
]

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Trust() {
  return (
    <section className="trust">
      <div className="trust-card">
        <h3>Por que sua opinião é importante?</h3>
        <p>
          Os resultados desta pesquisa são consolidados em um relatório técnico apresentado à
          liderança municipal, tornando-se base para o Plano de Ação de Melhoria dos Serviços
          Públicos do exercício seguinte.
        </p>
        <ul className="checks">
          <li><CheckIcon /> Os resultados são tratados de forma agregada — nunca individual.</li>
          <li><CheckIcon /> Relatório consolidado divulgado a todos os cidadãos após o ciclo.</li>
          <li><CheckIcon /> Plano de ação publicado no portal institucional após análise.</li>
        </ul>
      </div>

      <div className="trust-vis">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 6 }}>
              Cobertura prevista
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, letterSpacing: '-.02em', color: 'var(--ink-900)' }}>
              Todos os serviços
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-500)', letterSpacing: '.1em' }}>
              PMPin · 2026
            </div>
          </div>
        </div>
        <div className="vis-grid">
          {PATTERN.map((c, i) => (
            <div key={i} className={'cell ' + c} />
          ))}
        </div>
        <div className="vis-cap">
          <span>Múltiplos serviços</span>
          <span>· · ·</span>
          <span>Anônimo</span>
        </div>
      </div>
    </section>
  )
}
