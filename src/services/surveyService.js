import { supabase } from '../lib/supabase'

export async function persistResponse({ campaign, protocol, modo, identify, profileFields, questions, answers }) {
  // Monta dados de perfil sem PII (nunca persiste CPF ou nome)
  const profile = {}
  profileFields.forEach((f) => {
    if (identify[f.id]) profile[f.label] = identify[f.id]
  })

  const { data: resp, error: respErr } = await supabase
    .from('responses')
    .insert({
      campaign_id: campaign?.id ?? null,
      area_id:        identify.area_id        || null,
      area_option_id: identify.area_option_id || null,
      modo,
      protocol,
      profile,
    })
    .select('id')
    .single()

  if (respErr) throw respErr

  const answerRows = questions
    .filter((q) => answers[q.id] != null && answers[q.id] !== '')
    .map((q) => ({
      response_id: resp.id,
      question_id: q.id,
      value:       answers[q.id],
    }))

  if (answerRows.length > 0) {
    const { error: ansErr } = await supabase.from('response_answers').insert(answerRows)
    if (ansErr) throw ansErr
  }

  return resp.id
}
