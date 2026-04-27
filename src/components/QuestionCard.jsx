import { LIKERT } from '../data/survey'

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
              <span className="face">{l.face}</span>
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
