import InfoCard from './InfoCard'

export default function Hero({ onStart, blocked }) {
  return (
    <section className="hero">
      <div>
        <div className="crumbs">
          <span>Início</span>
          <span className="sep">/</span>
          <span>Prefeitura de Parintins</span>
          <span className="sep">/</span>
          <span className="now">Pesquisa de Satisfação</span>
        </div>

        <div className="h-eyebrow">
          <span className="pulse" />
          Pesquisa em andamento · Ciclo 2026
        </div>

        <h1 className="hero-title">
          Sua opinião transforma os{' '}
          <span className="accent">serviços públicos</span> de Parintins.
        </h1>

        <p className="hero-lead">
          A Prefeitura Municipal de Parintins realiza a Pesquisa de Satisfação 2026 para ouvir
          cada cidadão de forma <strong>totalmente anônima</strong>. Suas respostas orientam
          diretamente nossas ações e melhorias nos serviços públicos municipais.
        </p>

        {blocked ? (
          <div className="blocked-banner">
            <div className="ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="tx">
              <strong>Esta pesquisa já foi respondida neste dispositivo.</strong>
              <span>Cada cidadão pode participar uma única vez. Agradecemos sua contribuição.</span>
            </div>
          </div>
        ) : (
          <div className="hero-actions">
            <button className="btn-primary" onClick={onStart}>
              Iniciar pesquisa
              <svg
                className="arr"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <a href="#como" className="btn-ghost">
              Como funciona
            </a>
          </div>
        )}

      </div>

      <InfoCard />
    </section>
  )
}
