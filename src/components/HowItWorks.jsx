const STEPS = [
  {
    n: 'Etapa 01',
    title: 'Acesse o portal',
    body: 'Um token único é gerado automaticamente ao abrir esta página. Não é necessário login ou cadastro.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    n: 'Etapa 02',
    title: 'Inicie a pesquisa',
    body: 'Clique em iniciar e responda as perguntas em sequência. Você pode revisar antes do envio final.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    n: 'Etapa 03',
    title: 'Responda com sinceridade',
    body: 'São 10 questões sobre os serviços da Prefeitura — objetivas, múltipla escolha e abertas. Leva cerca de 8 minutos.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    ),
  },
  {
    n: 'Etapa 04',
    title: 'Envie e receba protocolo',
    body: 'Ao finalizar, você recebe um número de protocolo anônimo confirmando sua participação.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="como">
      <div className="section-head">
        <div className="left">
          <div className="eyebrow">Como funciona</div>
          <h2>Quatro etapas, total transparência.</h2>
        </div>
        <div className="right">
          A jornada foi desenhada para ser rápida, segura e respeitosa com seu tempo.
        </div>
      </div>
      <div className="steps">
        {STEPS.map((s, i) => (
          <div className="step" key={i}>
            <div className="n">{s.n}</div>
            <div className="ico-line">{s.icon}</div>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
