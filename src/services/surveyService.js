import { supabase } from '../lib/supabase'

export async function persistResponse({ campaign, protocol, modo, identify, profileFields, questions, answers }) {
  const profile = {}
  profileFields.forEach((f) => {
    if (identify[f.id]) profile[f.label] = identify[f.id]
  })

  const answersArray = questions
    .filter((q) => answers[q.id] != null && answers[q.id] !== '')
    .map((q) => ({ question_id: q.id, value: answers[q.id] }))

  const { data, error } = await supabase.rpc('insert_survey_response', {
    p_campaign_id:    campaign?.id           ?? null,
    p_area_id:        identify.area_id       || null,
    p_area_option_id: identify.area_option_id || null,
    p_modo:           modo,
    p_protocol:       protocol,
    p_profile:        profile,
    p_answers:        answersArray,
  })

  if (error) throw error
  return data
}
