export default function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <i style={{ width: `${value}%` }} />
    </div>
  )
}
