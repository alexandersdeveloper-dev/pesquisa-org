import { LIKERT } from '../data/survey'

const FACES = {
  1: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 9.5l3-1"/>
      <path d="M13 8.5l3 1"/>
      <circle cx="9.5" cy="11.5" r=".75" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="11.5" r=".75" fill="currentColor" stroke="none"/>
      <path d="M8.5 16Q12 13 15.5 16"/>
    </svg>
  ),
  2: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9.5" cy="11" r=".75" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="11" r=".75" fill="currentColor" stroke="none"/>
      <path d="M9 15.5Q12 14 15 15.5"/>
    </svg>
  ),
  3: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9.5" cy="11" r=".75" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="11" r=".75" fill="currentColor" stroke="none"/>
      <line x1="9" y1="15.5" x2="15" y2="15.5"/>
    </svg>
  ),
  4: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9.5" cy="11" r=".75" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="11" r=".75" fill="currentColor" stroke="none"/>
      <path d="M9 15Q12 17 15 15"/>
    </svg>
  ),
  5: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9.5" cy="10.5" r=".75" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="10.5" r=".75" fill="currentColor" stroke="none"/>
      <path d="M8 14.5Q12 18 16 14.5"/>
    </svg>
  ),
}

export default function QuestionCard({ question, answers, onSetAns, onToggleMulti }) {
  const { id, type, text, sub, section, options, max } = question
  const value = answers[id]

  return (
    <div>
      <div className="qheader">
        <div className="qmeta">{section}</div>
        <h3 className="qtxt">{text}</h3>
        {sub && <p className="qsub">{sub}</p>}
      </div>

      {type === 'likert' && (
        <div className="likert">
          {LIKERT.map((l) => (
            <button
              key={l.v}
              className={'lik' + (value === l.v ? ' sel' : '')}
              onClick={() => onSetAns(id, l.v)}
            >
              <span className="face">{FACES[l.v]}</span>
              <span className="v">0{l.v}</span>
              <span className="lbl">{l.lbl}</span>
            </button>
          ))}
        </div>
      )}

      {type === 'multi' && (() => {
        const sel = Array.isArray(value) ? value : []
        return (
          <div className="choice-list">
            {options.map((opt) => {
              const isSel = sel.includes(opt)
              const disabled = !isSel && max && sel.length >= max
              return (
                <div
                  key={opt}
                  className={'choice' + (isSel ? ' sel' : '')}
                  style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  onClick={() => !disabled && onToggleMulti(id, opt, max)}
                >
                  <div className="box">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="lbl">{opt}</div>
                </div>
              )
            })}
          </div>
        )
      })()}

      {type === 'text' && (() => {
        const v = value || ''
        return (
          <>
            <textarea
              className="tx"
              maxLength={1000}
              value={v}
              onChange={(e) => onSetAns(id, e.target.value)}
              placeholder="Compartilhe sua opinião livremente. Sua resposta é anônima."
            />
            <div className="char-count">{v.length} / 1000</div>
          </>
        )
      })()}
    </div>
  )
}
