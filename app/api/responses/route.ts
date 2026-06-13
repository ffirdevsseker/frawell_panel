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
        travel_companions: body.travel_companions,
        outings_per_week: body.outings_per_week,
        app_count: body.app_count,
        apps_used: body.apps_used,
        travel_motivations: body.travel_motivations,
        memorable_moment: body.memorable_moment,
        decision_method: body.decision_method,
        route_problems: body.route_problems,
        transport_pref: body.transport_pref,
        venue_quit: body.venue_quit,
        missing_filters: body.missing_filters,
        experience_note: body.experience_note,
        top_problems: body.top_problems,
        ai_guide_appeal: body.ai_guide_appeal,
        personalization_appeal: body.personalization_appeal,
        gamification_appeal: body.gamification_appeal,
        avatar_quest_appeal: body.avatar_quest_appeal,
        local_deals_appeal: body.local_deals_appeal,
        feature_ranking: body.feature_ranking,
        magic_wand_wish: body.magic_wand_wish,
        email: body.email || null,
        traveler_persona: body.traveler_persona,
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
