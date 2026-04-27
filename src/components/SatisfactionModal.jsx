import { useEffect, useState } from 'react'
import { useSurvey } from '../hooks/useSurvey'
import { AREAS, FREQUENCIAS } from '../data/survey'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

export default function SatisfactionModal({ onClose, onComplete }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

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
  } = useSurvey()

  const [showConfirm, setShowConfirm] = useState(false)

  function close() {
    if (submitted) {
      onComplete(protocol)
    } else if (step === 0) {
      onClose()
    } else {
      setShowConfirm(true)
    }
  }

  function confirmClose() {
    setShowConfirm(false)
    onClose()
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
          Sua contribuição foi registrada. Obrigado por dedicar seu tempo à melhoria
          dos serviços públicos de Parintins.
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
    stepInfo  = 'Identificação'
    nextLbl   = 'Continuar'
    showArrow = true
    content = (
      <div>
        <div className="qheader">
          <h3 className="qtxt">Como você prefere participar?</h3>
          <p className="qsub">Sua escolha determina quais informações serão coletadas. Ambas as formas são igualmente válidas.</p>
        </div>
        <div className="id-choice-grid">
          <button
            type="button"
            className={'id-choice-card' + (identify.modo === 'identificado' ? ' sel' : '')}
            onClick={() => setIdentify((i) => ({ ...i, modo: 'identificado' }))}
          >
            <div className="choice-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <strong>Identificado</strong>
            <p>Informar nome, CPF e cargo. Sua participação será registrada nominalmente.</p>
          </button>
          <button
            type="button"
            className={'id-choice-card' + (identify.modo === 'anonimo' ? ' sel' : '')}
            onClick={() => setIdentify((i) => ({ ...i, modo: 'anonimo' }))}
          >
            <div className="choice-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V5l-8-3z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <strong>Anônimo</strong>
            <p>Participar sem informar dados pessoais. Respostas analisadas de forma agregada.</p>
          </button>
        </div>
        <div className="id-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Em ambos os casos, suas respostas são tratadas conforme a política de privacidade
            da Prefeitura Municipal de Parintins e a LGPD.
          </span>
        </div>
      </div>
    )
  } else if (step === 1) {
    stepInfo  = `Etapa 1 de ${flatQuestions.length + 1}`
    nextLbl   = 'Continuar'
    showArrow = true

    if (identify.modo === 'identificado') {
      content = (
        <div>
          <div className="qheader">
            <div className="qmeta">Identificação</div>
            <h3 className="qtxt">Preencha seus dados de identificação.</h3>
            <p className="qsub">Estas informações são necessárias para o registro nominal da sua participação.</p>
          </div>
          <div className="id-form" style={{ gridTemplateColumns: '1fr' }}>
            <div className="id-field">
              <label>Nome completo</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={identify.nome}
                onChange={(e) => setIdentify((i) => ({ ...i, nome: e.target.value }))}
              />
            </div>
            <div className="id-field">
              <label>CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={identify.cpf}
                onChange={(e) => setIdentify((i) => ({ ...i, cpf: e.target.value }))}
              />
            </div>
            <div className="id-field">
              <label>Cargo / Função</label>
              <input
                type="text"
                placeholder="Seu cargo ou função"
                value={identify.cargo}
                onChange={(e) => setIdentify((i) => ({ ...i, cargo: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )
    } else {
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
    }
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

  const confirmContent = (
    <div className="confirm-exit">
      <div className="warn-ico">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.29 3.86-7.9 13.7A2 2 0 0 0 4 20.56h15.82a2 2 0 0 0 1.61-3l-7.91-13.7a2 2 0 0 0-3.22 0Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <h4>Tem certeza que deseja sair?</h4>
      <p>Suas respostas até aqui serão perdidas e não poderão ser recuperadas.</p>
    </div>
  )

  const modalTitle = showConfirm
    ? 'Sair da pesquisa'
    : submitted
    ? 'Obrigado pela sua participação.'
    : step === 0
    ? 'Antes de começar'
    : step === 1
    ? identify.modo === 'identificado' ? 'Seus dados de identificação' : 'Perfil do respondente'
    : 'Sua opinião conta'

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (!e.target.classList.contains('overlay')) return
        if (showConfirm) setShowConfirm(false)
        else close()
      }}
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
          {showConfirm ? confirmContent : content}
        </div>

        <div className="modal-foot">
          {showConfirm ? (
            <>
              <div className="step-info">Confirmação necessária</div>
              <div className="actions">
                <button className="btn-back" onClick={() => setShowConfirm(false)}>
                  Continuar respondendo
                </button>
                <button className="btn-danger" onClick={confirmClose}>
                  Sair da pesquisa
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
