import { invalidate } from '$app/navigation'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    const { data: profile } = await supabase
    .from('profiles')
    .select(`first_name, last_name, avatar_url, stockNotifications`)
    .eq('id', session.user.id)
    .single()

    const { data: taxes } = await supabase
    .from('taxes')
    .select()
    .order('id', { ascending: true })
    return { supabase, session, profile, taxes }
  }

  return { supabase, session }
}