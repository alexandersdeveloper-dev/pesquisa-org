const ITEMS = [
  {
    cls: 'b',
    tag: '01 / Confidencialidade',
    title: 'Anonimato absoluto',
    body: 'Nenhum dado pessoal — nome, CPF, IP — é coletado ou armazenado. Apenas respostas agregadas alimentam o relatório final.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    cls: 'y',
    tag: '02 / Acesso direto',
    title: 'Sem necessidade de cadastro',
    body: 'Ao acessar este portal, você pode iniciar a pesquisa imediatamente, sem login ou código de acesso. A participação é simples, rápida e acessível a todos os cidadãos.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="15" r="4" />
        <path d="m10.85 12.15 8.4-8.4M14 8l3 3M19 4l3 3" />
      </svg>
    ),
  },
  {
    cls: 'r',
    tag: '03 / Participação única',
    title: 'Uma resposta por cidadão',
    body: 'A pesquisa pode ser respondida apenas uma vez por dispositivo. Após o envio, sua participação é registrada para preservar a integridade dos resultados.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

export default function InfoCards() {
  return (
    <section className="pillars">
      {ITEMS.map((p, i) => (
        <div key={i} className={'pillar ' + p.cls}>
          <div className="ico">{p.icon}</div>
          <div className="num-tag">{p.tag}</div>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </div>
      ))}
    </section>
  )
}
