const FEATURES = [
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    strong: '100% anônima',
    sub: 'Nenhum dado pessoal é coletado ou armazenado',
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    strong: 'Leva menos de 3 minutos',
    sub: '10 questões objetivas e abertas',
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    strong: 'Usada para melhorar serviços',
    sub: 'Resultados publicados no portal municipal',
  },
]

export default function InfoCard() {
  return (
    <div className="token-card">
      <div className="tc-head">
        <div className="lbl">Pesquisa de Satisfação · 2026</div>
        <span className="pill">
          <span className="dt" />
          Em andamento
        </span>
      </div>
      <div className="tc-body">
        <div className="ic-title">Sobre a pesquisa</div>
        <div className="ic-list">
          {FEATURES.map((f, i) => (
            <div key={i} className="ic-item">
              <div className="ic-ico">{f.icon}</div>
              <div className="ic-txt">
                <strong>{f.strong}</strong>
                <span>{f.sub}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="tc-meta" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="row" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
            <span className="k">Encerramento</span>
            <span className="v">31/12/2026</span>
          </div>
          <div className="row" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="k">Situação</span>
            <span className="v">Aberta</span>
          </div>
          <div className="row" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
            <span className="k">Anonimato</span>
            <span className="v">Garantido</span>
          </div>
        </div>
      </div>
    </div>
  )
}
