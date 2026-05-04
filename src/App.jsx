import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { isSubmitted } from './services/storage'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './router/AdminRoute'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import AdminApp from './admin/AdminApp'
import Login from './admin/pages/Login'

function PublicSurvey() {
  const [blocked, setBlocked]       = useState(() => isSubmitted())
  const [showSurvey, setShowSurvey] = useState(false)

  function start() { if (!blocked) setShowSurvey(true) }
  function complete() { setShowSurvey(false); setBlocked(true) }

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSurvey />} />
          <Route path="/admin/login" element={<Login />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminApp />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
