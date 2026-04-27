import { useState } from 'react'
import { nowDateStr, deadlineStr } from '../../utils/helpers'

export default function TokenCard({ token, blocked }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    try {
      navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const segs = token.split('-')

  return (
    <div className="token-card">
      <div className="tc-head">
        <div className="lbl">Token único de acesso</div>
        <span className="pill">
          <span className="dt" />
          Válido
        </span>
      </div>
      <div className="tc-body">
        <div className="token-display" aria-label="Token de acesso">
          {segs.map((s, i) => (
            <span key={i} className="seg">{s}</span>
          ))}
        </div>
        <div className="token-actions">
          <button className={'ta-btn' + (copied ? ' copied' : '')} onClick={copy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copiado
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar token
              </>
            )}
          </button>
          <button className="ta-btn" onClick={() => window.print()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimir
          </button>
        </div>
        <div className="tc-meta">
          <div className="row">
            <span className="k">Gerado em</span>
            <span className="v">{nowDateStr()}</span>
          </div>
          <div className="row">
            <span className="k">Encerramento</span>
            <span className="v">{deadlineStr()}</span>
          </div>
          <div className="row">
            <span className="k">Vínculo</span>
            <span className="v">Anônimo</span>
          </div>
          <div className="row">
            <span className="k">Tentativas</span>
            <span className="v">{blocked ? '0 disponíveis' : '1 disponível'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
