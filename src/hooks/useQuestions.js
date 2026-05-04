import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { logAudit } from '../services/auditService'

export function useQuestions() {
  const [questions, setQuestions] = useState([])
  const [sections, setSections]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: secs }, { data: qs }] = await Promise.all([
      supabase.from('survey_sections').select('*').order('sort_order'),
      supabase.from('survey_questions')
        .select('*, question_options(id, label, sort_order), survey_sections(label), service_areas(id, title)')
        .order('sort_order'),
    ])
    setSections(secs ?? [])
    setQuestions(qs ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create(values, options = []) {
    const { data, error: err } = await supabase.from('survey_questions').insert(values).select().single()
    if (err) throw err
    if (options.length > 0) {
      await supabase.from('question_options').insert(
        options.map((label, i) => ({ question_id: data.id, label, sort_order: i }))
      )
    }
    await logAudit('create', 'survey_questions', data.id, null, values)
    await load()
    return data
  }

  async function update(id, values, options) {
    const { error: err } = await supabase.from('survey_questions').update(values).eq('id', id)
    if (err) throw err
    if (options !== undefined) {
      await supabase.from('question_options').delete().eq('question_id', id)
      if (options.length > 0) {
        await supabase.from('question_options').insert(
          options.map((label, i) => ({ question_id: id, label, sort_order: i }))
        )
      }
    }
    await logAudit('update', 'survey_questions', id, null, values)
    await load()
  }

  async function remove(id) {
    const { error: err } = await supabase.from('survey_questions').update({ active: false }).eq('id', id)
    if (err) throw err
    await logAudit('delete', 'survey_questions', id, null, null)
    await load()
  }

  async function reorder(ids) {
    await Promise.all(ids.map((id, i) => supabase.from('survey_questions').update({ sort_order: i }).eq('id', id)))
    await load()
  }

  return { questions, sections, loading, error, create, update, remove, reorder, reload: load }
}
