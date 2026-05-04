import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { logAudit } from '../services/auditService'

export function useServiceAreas() {
  const [areas, setAreas]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('service_areas')
      .select('*, service_area_options(id, label, sort_order)')
      .order('sort_order')
    setAreas((data ?? []).map((a) => ({
      ...a,
      options: (a.service_area_options ?? []).sort((x, y) => x.sort_order - y.sort_order),
    })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create(values) {
    const { data, error } = await supabase.from('service_areas').insert(values).select().single()
    if (error) throw error
    await logAudit('create', 'service_areas', data.id, null, values)
    await load()
    return data
  }

  async function update(id, values) {
    const { error } = await supabase.from('service_areas').update(values).eq('id', id)
    if (error) throw error
    await logAudit('update', 'service_areas', id, null, values)
    await load()
  }

  async function remove(id) {
    const { error } = await supabase.from('service_areas').update({ active: false }).eq('id', id)
    if (error) throw error
    await logAudit('delete', 'service_areas', id, null, null)
    await load()
  }

  async function reorder(ids) {
    await Promise.all(ids.map((id, i) =>
      supabase.from('service_areas').update({ sort_order: i }).eq('id', id)
    ))
    await load()
  }

  async function addOption(areaId, label) {
    const { error } = await supabase
      .from('service_area_options')
      .insert({ area_id: areaId, label, sort_order: 999 })
    if (error) throw error
    await load()
  }

  async function updateOption(optionId, label) {
    const { error } = await supabase.from('service_area_options').update({ label }).eq('id', optionId)
    if (error) throw error
    await load()
  }

  async function removeOption(optionId) {
    const { error } = await supabase.from('service_area_options').delete().eq('id', optionId)
    if (error) throw error
    await load()
  }

  return { areas, loading, create, update, remove, reorder, addOption, updateOption, removeOption, reload: load }
}
