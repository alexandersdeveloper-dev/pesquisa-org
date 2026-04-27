const KEYS = {
  token:     'ps_token',
  submitted: 'ps_submitted',
  protocol:  'ps_protocol',
  tokenUsed: 'ps_token_used',
}

export function getToken() {
  try { return localStorage.getItem(KEYS.token) } catch { return null }
}

export function saveToken(token) {
  try { localStorage.setItem(KEYS.token, token) } catch {}
}

export function isSubmitted() {
  try { return localStorage.getItem(KEYS.submitted) === '1' } catch { return false }
}

export function saveSubmission(protocol, token) {
  try {
    localStorage.setItem(KEYS.submitted, '1')
    localStorage.setItem(KEYS.protocol, protocol)
    localStorage.setItem(KEYS.tokenUsed, token)
  } catch {}
}
