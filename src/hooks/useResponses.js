import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 20

export function useResponses() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(0)

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    const from = p * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    const [{ count }, { data }] = await Promise.all([
      supabase.from('responses').select('*', { count: 'exact', head: true }),
      supabase.from('responses')
        .select(`
          id, protocol, modo, profile, submitted_at,
          campaigns(title),
          service_areas(title),
          service_area_options(label),
          response_answers(id, value, survey_questions(text, type))
        `)
        .order('submitted_at', { ascending: false })
        .range(from, to),
    ])

    setTotal(count ?? 0)
    setResponses(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load(page) }, [load, page])

  async function remove(id) {
    const { error } = await supabase.from('responses').delete().eq('id', id)
    if (error) throw error
    await load(page)
  }

  async function removeAll() {
    const { error } = await supabase.from('responses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) throw error
    setPage(0)
    await load(0)
  }

  return { responses, loading, total, page, setPage, pageSize: PAGE_SIZE, remove, removeAll }
}
