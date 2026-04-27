import { useState } from 'react'
import { isSubmitted } from './services/storage'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

export default function App() {
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
        blocked={blocked}
        onStart={start}
        showSurvey={showSurvey}
        onClose={() => setShowSurvey(false)}
        onComplete={complete}
      />
    </MainLayout>
  )
}
