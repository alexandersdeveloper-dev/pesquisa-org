import { useSurvey } from '../hooks/useSurvey'
import { AREAS, FREQUENCIAS } from '../data/survey'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

export default function SatisfactionModal({ token, onClose, onComplete }) {
  const {
    flatQuestions,
    step,
    identify,
    setIdentify,
    answers,
    submitted,
    protocol,
    bodyRef,
    progress,
    canAdvance,
    setAns,
    toggleMulti,
    next,
    back,
  } = useSurvey(token)

  function close() {
    if (submitted) {
      onComplete(protocol)
    } else if (confirm('Tem certeza que deseja fechar a pesquisa? Suas respostas até aqui serão perdidas.')) {
      onClose()
    }
  }

  const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )

  let content, stepInfo, nextLbl, showArrow

  if (submitted) {
    stepInfo  = 'Concluído'
    nextLbl   = 'Fechar'
    showArrow = false
    content = (
      <div className="done">
        <div className="check">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h4>Pesquisa enviada com sucesso.</h4>
        <p>
          Sua contribuição foi registrada de forma <strong>totalmente anônima</strong>. Obrigado
          por dedicar seu tempo à melhoria dos serviços públicos de Parintins.
        </p>
        <p>Os resultados consolidados serão publicados no portal da Prefeitura Municipal.</p>
        <div className="protocol">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Protocolo {protocol}
        </div>
      </div>
    )
  } else if (step === 0) {
    stepInfo  = 'Verificação de acesso'
    nextLbl   = 'Iniciar pesquisa'
    showArrow = true
    content = (
      <div className="token-gate">
        <div className="lock">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h4>Confirme o uso do seu token</h4>
        <p>
          Este token é exclusivo desta sessão e será marcado como utilizado após o envio. Você
          poderá responder a pesquisa <strong>uma única vez</strong>.
        </p>
        <div className="tk-display">{token}</div>
        <div className="id-note" style={{ textAlign: 'left', marginTop: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Ao clicar em <strong>Iniciar pesquisa</strong> você confirma que suas respostas serão
            tratadas de forma agregada e anônima, conforme a política da Prefeitura Municipal de
            Parintins.
          </span>
        </div>
      </div>
    )
  } else if (step === 1) {
    stepInfo  = `Etapa 1 de ${flatQuestions.length + 1}`
    nextLbl   = 'Continuar'
    showArrow = true
    content = (
      <div>
        <div className="qheader">
          <div className="qmeta">Informações gerais</div>
          <h3 className="qtxt">Conte-nos um pouco sobre sua relação com os serviços da Prefeitura.</h3>
          <p className="qsub">Estes dados são utilizados apenas para análise por grupos, de forma anônima.</p>
        </div>
        <div className="id-form">
          <div className="id-field">
            <label>Área / Serviço utilizado</label>
            <select
              value={identify.area}
              onChange={(e) => setIdentify((i) => ({ ...i, area: e.target.value }))}
            >
              <option value="">Selecione...</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="id-field">
            <label>Frequência de uso</label>
            <select
              value={identify.frequencia}
              onChange={(e) => setIdentify((i) => ({ ...i, frequencia: e.target.value }))}
            >
              <option value="">Selecione...</option>
              {FREQUENCIAS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="id-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V5l-8-3z" />
          </svg>
          <span>
            Estas informações <strong>não identificam</strong> você individualmente. São utilizadas
            apenas para análise estatística.
          </span>
        </div>
      </div>
    )
  } else {
    const qIdx = step - 2
    const q    = flatQuestions[qIdx]
    stepInfo   = `Pergunta ${qIdx + 1} de ${flatQuestions.length} · ${q.section}`
    nextLbl    = qIdx === flatQuestions.length - 1 ? 'Enviar pesquisa' : 'Continuar'
    showArrow  = true
    content    = (
      <QuestionCard
        question={q}
        answers={answers}
        onSetAns={setAns}
        onToggleMulti={toggleMulti}
      />
    )
  }

  const modalTitle = submitted
    ? 'Obrigado pela sua participação.'
    : step === 0
    ? 'Antes de começar'
    : step === 1
    ? 'Perfil do respondente'
    : 'Sua opinião conta'

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target.classList.contains('overlay')) close() }}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="lbl">Pesquisa de Satisfação · Prefeitura de Parintins</div>
            <h3>{modalTitle}</h3>
          </div>
          <button className="modal-close" onClick={close} aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ProgressBar value={progress()} />

        <div className="modal-body" ref={bodyRef}>
          {content}
        </div>

        <div className="modal-foot">
          <div className="step-info">{stepInfo}</div>
          <div className="actions">
            {!submitted && step > 0 && (
              <button className="btn-back" onClick={back}>Voltar</button>
            )}
            <button
              className="btn-next"
              onClick={submitted ? () => onComplete(protocol) : next}
              disabled={!canAdvance()}
            >
              {nextLbl}
              {showArrow && <ArrowIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
