import { useEffect, useRef, useState } from 'react'
import { saveSubmission } from '../services/storage'
import { persistResponse } from '../services/surveyService'
import { isValidCPF } from '../utils/helpers'

export function useSurvey({ questions = [], profileFields = [], areas = [], campaign = null } = {}) {
  const [step, setStep]           = useState(0)
  const [identify, setIdentify]   = useState({ modo: '', cpf: '', nome: '', cargo: '', area_id: '', area_option_id: '' })
  const [answers, setAnswers]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [protocol, setProtocol]   = useState('')
  const bodyRef = useRef(null)

  // Identificado: 0=modo 1=identificação 2=contexto 3…=perguntas (offset=3)
  // Anônimo:      0=modo 1=contexto      2…=perguntas             (offset=2)
  const profileStep    = identify.modo === 'identificado' ? 2 : 1
  const questionOffset = identify.modo === 'identificado' ? 3 : 2

  // Perguntas filtradas: globais + específicas da área selecionada
  const activeQuestions = (areas.length > 0 && identify.area_id)
    ? questions.filter((q) => !q.area_id || q.area_id === identify.area_id)
    : questions

  const totalSteps = questionOffset + activeQuestions.length

  const initializedRef = useRef(false)
  useEffect(() => {
    if (profileFields.length === 0 || initializedRef.current) return
    initializedRef.current = true
    setIdentify((prev) => {
      const extra = {}
      profileFields.forEach((f) => { extra[f.id] = '' })
      return { ...prev, ...extra }
    })
  }, [profileFields])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [step])

  function progress() {
    if (submitted) return 100
    if (step === 0) return 4
    if (step === 1) return identify.modo === 'identificado' ? 10 : 18
    if (step === profileStep) return 22
    const idx = step - questionOffset
    return Math.min(95, 22 + Math.round(((idx + 1) / activeQuestions.length) * 73))
  }

  function canAdvance() {
    if (step === 0) return Boolean(identify.modo)

    if (step === 1 && identify.modo === 'identificado') {
      return Boolean(identify.nome && identify.cargo) && isValidCPF(identify.cpf)
    }

    if (step === profileStep) {
      const areaOk = areas.length === 0 || Boolean(identify.area_id)
      const selectedArea = areas.find((a) => a.id === identify.area_id)
      const optionOk = !selectedArea?.options?.length || Boolean(identify.area_option_id)
      const fieldsOk = profileFields.filter((f) => f.required).every((f) => Boolean(identify[f.id]))
      return areaOk && optionOk && fieldsOk
    }

    const q = activeQuestions[step - questionOffset]
    if (!q) return true
    if (q.type === 'likert') return answers[q.id] != null
    if (q.type === 'multi')  return Array.isArray(answers[q.id]) && answers[q.id].length > 0
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

  async function next() {
    if (step >= totalSteps - 1) {
      const buf = new Uint32Array(1)
      crypto.getRandomValues(buf)
      const proto = 'PS-' + (100000 + (buf[0] % 900000))
      setProtocol(proto)
      setSubmitted(true)
      saveSubmission(proto, identify.modo)
      persistResponse({ campaign, protocol: proto, modo: identify.modo, identify, profileFields, questions: activeQuestions, answers })
        .catch(console.error)
      return
    }
    setStep((s) => s + 1)
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  function reset() {
    initializedRef.current = false
    setStep(0)
    setIdentify({ modo: '', cpf: '', nome: '', cargo: '', area_id: '', area_option_id: '' })
    setAnswers({})
    setSubmitted(false)
    setProtocol('')
  }

  return {
    questions: activeQuestions,
    profileFields,
    areas,
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
    reset,
    questionOffset,
    profileStep,
  }
}
