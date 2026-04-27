import ColorStripe from './ColorStripe'

export default function Header() {
  return (
    <div className="header-wrap">
      <header className="header">
        <div className="header-left">
          <img
            src="/assets/logo.png"
            alt="Prefeitura de Parintins · Eu Amo PIN"
            className="header-logo"
          />
          <div className="header-divider" />
          <div className="header-meta">
            <span className="eyebrow">Prefeitura Municipal de Parintins</span>
            <span className="title">Pesquisa de Satisfação</span>
          </div>
        </div>
        <a href="#" className="btn-services" onClick={(e) => e.preventDefault()}>
          <span className="dot" />
          <span className="services-label">Serviços Integrados</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </a>
      </header>
      <ColorStripe />
    </div>
  )
}
