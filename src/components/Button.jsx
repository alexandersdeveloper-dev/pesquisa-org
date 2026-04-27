const VARIANTS = {
  primary:  'btn-primary',
  ghost:    'btn-ghost',
  back:     'btn-back',
  next:     'btn-next',
  services: 'btn-services',
}

export default function Button({
  children,
  variant = 'primary',
  disabled,
  onClick,
  className = '',
  ...props
}) {
  const cls = VARIANTS[variant] ?? 'btn-primary'
  return (
    <button
      className={[cls, className].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
