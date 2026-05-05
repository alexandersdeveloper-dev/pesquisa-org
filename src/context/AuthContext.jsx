import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Encerra sessão após 2h de inatividade
const INACTIVITY_MS = 2 * 60 * 60 * 1000

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const timerRef = useRef(null)

  function resetTimer(currentSession) {
    clearTimeout(timerRef.current)
    if (!currentSession) return
    timerRef.current = setTimeout(() => {
      supabase.auth.signOut()
    }, INACTIVITY_MS)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      resetTimer(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      resetTimer(s)
    })

    const events = ['mousemove', 'keydown', 'pointerdown', 'scroll']
    const handleActivity = () => {
      supabase.auth.getSession().then(({ data }) => resetTimer(data.session))
    }
    events.forEach((ev) => window.addEventListener(ev, handleActivity, { passive: true }))

    return () => {
      subscription.unsubscribe()
      clearTimeout(timerRef.current)
      events.forEach((ev) => window.removeEventListener(ev, handleActivity))
    }
  }, [])

  function signOut() {
    clearTimeout(timerRef.current)
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
