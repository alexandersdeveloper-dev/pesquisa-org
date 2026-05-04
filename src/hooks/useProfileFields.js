import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { logAudit } from '../services/auditService'

export function useProfileFields() {
  const [fields, setFields]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('profile_fields')
      .select('*, profile_field_options(id, label, sort_order)')
      .order('sort_order')
    if (err) { setError(err.message); setLoading(false); return }
    setFields(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create(values) {
    const { data, error: err } = await supabase.from('profile_fields').insert(values).select().single()
    if (err) throw err
    await logAudit('create', 'profile_fields', data.id, null, values)
    await load()
    return data
  }

  async function update(id, values) {
    const { error: err } = await supabase.from('profile_fields').update(values).eq('id', id)
    if (err) throw err
    await logAudit('update', 'profile_fields', id, null, values)
    await load()
  }

  async function remove(id) {
    // Soft delete
    const { error: err } = await supabase.from('profile_fields').update({ active: false }).eq('id', id)
    if (err) throw err
    await logAudit('delete', 'profile_fields', id, null, null)
    await load()
  }

  async function reorder(ids) {
    const updates = ids.map((id, i) => supabase.from('profile_fields').update({ sort_order: i }).eq('id', id))
    await Promise.all(updates)
    await load()
  }

  async function addOption(fieldId, label) {
    const { error: err } = await supabase.from('profile_field_options').insert({ field_id: fieldId, label, sort_order: 999 })
    if (err) throw err
    await load()
  }

  async function removeOption(optionId) {
    const { error: err } = await supabase.from('profile_field_options').delete().eq('id', optionId)
    if (err) throw err
    await load()
  }

  return { fields, loading, error, create, update, remove, reorder, addOption, removeOption, reload: load }
}
