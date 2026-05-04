export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="adm-dialog-overlay" onClick={onCancel}>
      <div className="adm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="adm-dialog-inner">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="adm-dialog-foot">
          <button className="adm-btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="adm-btn-danger" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}
