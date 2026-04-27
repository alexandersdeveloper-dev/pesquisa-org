import { useState, useEffect, useMemo, useRef } from 'react'
import { SECTIONS } from '../data/survey'
import { saveSubmission } from '../services/storage'

export function useSurvey(token) {
  const flatQuestions = useMemo(() => {
    const arr = []
    SECTIONS.forEach((sec) =>
      sec.questions.forEach((q) => arr.push({ ...q, section: sec.label, sectionId: sec.id }))
    )
    return arr
  }, [])

  // gate(0) + identify(1) + questions
  const totalSteps = 2 + flatQuestions.length

  const [step, setStep]         = useState(0)
  const [identify, setIdentify] = useState({ area: '', frequencia: '' })
  const [answers, setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [protocol, setProtocol] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [step])

  function progress() {
    if (submitted) return 100
    if (step === 0) return 4
    if (step === 1) return 10
    const idx = step - 2
    return Math.min(95, 10 + Math.round(((idx + 1) / flatQuestions.length) * 85))
  }

  function canAdvance() {
    if (step === 0) return true
    if (step === 1) return Boolean(identify.area && identify.frequencia)
    const q = flatQuestions[step - 2]
    if (!q) return true
    if (q.type === 'likert') return answers[q.id] != null
    if (q.type === 'multi')  return Array.isArray(answers[q.id]) && answers[q.id].length > 0
    if (q.type === 'text')   return true
    return true
  }

  function setAns(qid, v) {
    setAnswers((a) => ({ ...a, [qid]: v }))
  }

  function toggleMulti(qid, opt, max) {
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? [...a[qid]] : []
      const i = cur.indexOf(opt)
      if (i > -1) cur.splice(i, 1)
      else if (!max || cur.length < max) cur.push(opt)
      return { ...a, [qid]: cur }
    })
  }

  function next() {
    if (step >= totalSteps - 1) {
      const proto = 'PS-' + Math.floor(100000 + Math.random() * 900000)
      setProtocol(proto)
      setSubmitted(true)
      saveSubmission(proto, token)
      return
    }
    setStep((s) => s + 1)
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  return {
    flatQuestions,
    step,
    identify,
    setIdentify,
    answers,
    submitted,
    protocol,
    bodyRef,
    progress,
    canAdvance,
    setAns,
    toggleMulti,
    next,
    back,
  }
}
