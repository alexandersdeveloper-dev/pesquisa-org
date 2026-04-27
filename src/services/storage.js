const KEYS = {
  submitted: 'ps_submitted',
  protocol:  'ps_protocol',
  modo:      'ps_modo',
}

export function isSubmitted() {
  try { return localStorage.getItem(KEYS.submitted) === '1' } catch { return false }
}

export function saveSubmission(protocol, modo) {
  try {
    localStorage.setItem(KEYS.submitted, '1')
    localStorage.setItem(KEYS.protocol, protocol)
    localStorage.setItem(KEYS.modo, modo)
  } catch {}
}
