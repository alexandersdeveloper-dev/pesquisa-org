import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { logAudit } from '../services/auditService'

export function useSections() {
  const [sections, setSections] = useState([])
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('survey_sections').select('*').order('sort_order')
    setSections(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create(values) {
    const { data, error } = await supabase.from('survey_sections').insert(values).select().single()
    if (error) throw error
    await logAudit('create', 'survey_sections', data.id, null, values)
    await load()
    return data
  }

  async function update(id, values) {
    const { error } = await supabase.from('survey_sections').update(values).eq('id', id)
    if (error) throw error
    await logAudit('update', 'survey_sections', id, null, values)
    await load()
  }

  async function remove(id) {
    const { error } = await supabase.from('survey_sections').update({ active: false }).eq('id', id)
    if (error) throw error
    await logAudit('delete', 'survey_sections', id, null, null)
    await load()
  }

  async function reorder(ids) {
    await Promise.all(ids.map((id, i) => supabase.from('survey_sections').update({ sort_order: i }).eq('id', id)))
    await load()
  }

  return { sections, loading, create, update, remove, reorder, reload: load }
}
