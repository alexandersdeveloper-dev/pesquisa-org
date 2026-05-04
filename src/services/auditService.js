import { supabase } from '../lib/supabase'

export async function logAudit(action, tableName, recordId, before, after) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const diff = before || after
    ? { before: before ?? null, after: after ?? null }
    : null

  await supabase.from('audit_log').insert({
    admin_id:   user.id,
    action,
    table_name: tableName,
    record_id:  recordId,
    diff,
  })
}
