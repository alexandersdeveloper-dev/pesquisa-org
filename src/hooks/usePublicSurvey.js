import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePublicSurvey() {
  const [profileFields, setProfileFields] = useState([])
  const [sections, setSections]           = useState([])
  const [questions, setQuestions]         = useState([])
  const [areas, setAreas]                 = useState([])
  const [campaign, setCampaign]           = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [
          { data: camp },
          { data: fields },
          { data: opts },
          { data: secs },
          { data: qs },
          { data: qopts },
          { data: areasData },
        ] = await Promise.all([
          supabase.from('campaigns').select('*').eq('active', true).maybeSingle(),
          supabase.from('profile_fields').select('*').eq('active', true).order('sort_order'),
          supabase.from('profile_field_options').select('*').order('sort_order'),
          supabase.from('survey_sections').select('*').eq('active', true).order('sort_order'),
          supabase.from('survey_questions').select('*').eq('active', true).order('sort_order'),
          supabase.from('question_options').select('*').order('sort_order'),
          supabase.from('service_areas').select('*').eq('active', true).order('sort_order'),
        ])

        if (cancelled) return

        const fieldsWithOpts = (fields ?? []).map((f) => ({
          ...f,
          options: (opts ?? []).filter((o) => o.field_id === f.id).map((o) => o.label),
        }))

        const questionsWithOpts = (qs ?? []).map((q) => ({
          ...q,
          options:   (qopts ?? []).filter((o) => o.question_id === q.id).map((o) => o.label),
          section:   (secs ?? []).find((s) => s.id === q.section_id)?.label ?? '',
          sectionId: q.section_id,
        }))

        setCampaign(camp)
        setProfileFields(fieldsWithOpts)
        setSections(secs ?? [])
        setQuestions(questionsWithOpts)
        setAreas(areasData ?? [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { profileFields, sections, questions, areas, campaign, loading, error }
}
