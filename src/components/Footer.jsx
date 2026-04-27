import ColorStripe from './ColorStripe'

export default function Footer() {
  return (
    <footer>
      <ColorStripe />
      <div className="footer-inner">
        <div className="f-brand">
          <img src="/assets/logpmp.png" alt="Prefeitura de Parintins" />
          <p>
            Portal da Pesquisa de Satisfação da Prefeitura Municipal de Parintins, dedicado à
            escuta ativa dos cidadãos e à melhoria contínua dos serviços públicos municipais.
          </p>
        </div>
        <div className="f-col">
          <h5>Acesso rápido</h5>
          <ul>
            <li><a href="#">Notícias</a></li>
            <li><a href="#">Vídeos</a></li>
            <li><a href="#">Galeria de Fotos</a></li>
            <li><a href="#">Agenda</a></li>
            <li><a href="#">Transparência</a></li>
          </ul>
        </div>
        <div className="f-col">
          <h5>Contato institucional</h5>
          <div className="f-contact">
            <div className="item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Parintins · AM</span>
            </div>
            <div className="item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Canais digitais e atendimento institucional</span>
            </div>
            <div className="item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>Atendimento em horário administrativo</span>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        © 2026 Todos os direitos reservados — Prefeitura Municipal de Parintins · CNPJ
        04.329.736/0001-69 · Rua Jhonathas Pedrosa, s/n Centro · Parintins · Amazonas · CEP
        69151-030
      </div>
    </footer>
  )
}
