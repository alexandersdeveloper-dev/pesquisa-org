import { useState } from 'react'
import ColorStripe from './ColorStripe'

const NAV_LINKS = [
  { label: 'Início',                  href: '/' },
  { label: 'Portal da Transparência', href: 'https://transparencia.parintins.am.gov.br/' },
  { label: 'Ouvidoria',               href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8546-ouvidoria' },
  { label: 'SIC',                     href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8317-servico-de-informacao-ao-cidadao-e-sic' },
  { label: 'Relatório',               href: '#' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('ps_theme') === 'dark' } catch { return false }
  })

  function toggleDark() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('ps_theme', next ? 'dark' : 'light') } catch {}
    setDark(next)
  }

  return (
    <div className="header-wrap">
      <header className="header">
        <div className="header-left">
          <img
            src="/assets/logo.png"
            alt="Prefeitura de Parintins · Eu Amo PIN"
            className="header-logo"
            style={{ height: 'clamp(22px, 4vw, 44px)' }}
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7" /><path d="M8 7h9v9" />
          </svg>
        </a>
      </header>

      <ColorStripe />

      <nav className="site-nav">
        <div className="site-nav-inner">
          <div className={'site-nav-links' + (open ? ' open' : '')}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="site-nav-link"
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </div>

          <button className="btn-dark-toggle" onClick={toggleDark}
            aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}>
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button className="site-nav-burger" onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
              </svg>
            )}
          </button>
        </div>
      </nav>
    </div>
  )
}
