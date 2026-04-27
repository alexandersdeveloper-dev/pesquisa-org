import { useState } from 'react'
import { genToken } from './utils/helpers'
import { getToken, saveToken, isSubmitted } from './services/storage'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

export default function App() {
  const [token] = useState(() => {
    const existing = getToken()
    if (existing) return existing
    const t = genToken()
    saveToken(t)
    return t
  })

  const [blocked, setBlocked]       = useState(() => isSubmitted())
  const [showSurvey, setShowSurvey] = useState(false)

  function start() {
    if (!blocked) setShowSurvey(true)
  }

  function complete() {
    setShowSurvey(false)
    setBlocked(true)
  }

  return (
    <MainLayout>
      <Home
        token={token}
        blocked={blocked}
        onStart={start}
        showSurvey={showSurvey}
        onClose={() => setShowSurvey(false)}
        onComplete={complete}
      />
    </MainLayout>
  )
}
