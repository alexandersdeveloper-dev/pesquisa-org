import { useState } from 'react'

export default function OptionsList({ options = [], onChange }) {
  const [newLabel, setNewLabel] = useState('')

  function add() {
    const label = newLabel.trim()
    if (!label) return
    onChange([...options, label])
    setNewLabel('')
  }

  function remove(idx) {
    onChange(options.filter((_, i) => i !== idx))
  }

  return (
    <div className="adm-options-list">
      {options.map((opt, i) => (
        <div key={i} className="adm-options-item">
          <span style={{ flex: 1, fontSize: 13 }}>{opt}</span>
          <button type="button" className="adm-btn-icon" onClick={() => remove(i)} aria-label="Remover">✕</button>
        </div>
      ))}
      <div className="adm-options-add">
        <input
          type="text"
          placeholder="Nova opção..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button type="button" className="adm-btn-ghost" onClick={add}>Adicionar</button>
      </div>
    </div>
  )
}
