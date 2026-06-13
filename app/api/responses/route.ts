import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { SurveyData } from '@/types/survey'

export async function POST(request: NextRequest) {
  try {
    const body: SurveyData = await request.json()

    const { error } = await supabase.from('responses').insert([
      {
        age_range: body.age_range,
        gender: body.gender,
        city: body.city,
        outings_per_week: body.outings_per_week,
        app_count: body.app_count,
        apps_used: body.apps_used,
        decision_method: body.decision_method,
        route_problems: body.route_problems,
        venue_quit: body.venue_quit,
        transport_pref: body.transport_pref,
        missing_filters: body.missing_filters,
        experience_note: body.experience_note,
        top_problems: body.top_problems,
        feature_ranking: body.feature_ranking,
        open_feedback: body.open_feedback,
        email: body.email || null,
      },
    ])

    if (error) {
      console.error('Supabase error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('API error:', err)
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
