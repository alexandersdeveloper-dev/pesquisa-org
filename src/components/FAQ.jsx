import { useState } from 'react'

const ITEMS = [
  {
    q: 'Minhas respostas podem ser identificadas?',
    a: 'Não. O sistema não coleta nome, CPF, e-mail, IP ou qualquer outro identificador pessoal. Os dados de serviço utilizado e frequência de uso são analisados apenas de forma agregada para preservar o anonimato.',
  },
  {
    q: 'Posso responder pelo celular?',
    a: 'Sim. O portal foi desenhado para funcionar em qualquer dispositivo — computador, tablet ou celular —, com ou sem Wi-Fi da Prefeitura.',
  },
  {
    q: 'Posso pausar e voltar mais tarde?',
    a: 'As respostas são mantidas no seu navegador enquanto você não fecha a aba. Recomendamos concluir em uma única sessão para garantir que sua participação seja registrada.',
  },
  {
    q: 'Como recebo o resultado?',
    a: 'O relatório consolidado será publicado no portal da Prefeitura Municipal de Parintins e divulgado pelos canais oficiais de comunicação ao final do ciclo.',
  },
  {
    q: 'E se eu encontrar algum problema técnico?',
    a: 'Entre em contato com a Prefeitura pelos canais oficiais indicados no rodapé desta página. Você não precisa se identificar como participante da pesquisa.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={'faq-item' + (isOpen ? ' open' : '')}>
      <button className="faq-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="plus" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div className="faq-panel">
        <div className="ans">{item.a}</div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  function toggle(i) {
    setOpenIdx(openIdx === i ? null : i)
  }

  return (
    <section className="faq">
      <div className="faq-grid">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--c-blue)', marginBottom: 12 }}>
            Perguntas frequentes
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px,3vw,40px)', letterSpacing: '-.02em', margin: 0, color: 'var(--ink-900)' }}>
            Tudo o que você precisa saber antes de começar.
          </h2>
          <p style={{ color: 'var(--ink-500)', marginTop: 16, fontSize: 14.5, lineHeight: 1.6, maxWidth: '40ch' }}>
            Transparência também faz parte da escuta. Esclarecemos abaixo as principais dúvidas
            sobre confidencialidade, participação e uso dos resultados.
          </p>
        </div>
        <div className="faq-list">
          {ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIdx === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
