import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { themes } from '$lib/themes'
import { redirect } from '@sveltejs/kit'


export const handle = async ({ event, resolve }) => {

  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event,
  })

  /**
   * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  if (!event.url.pathname.startsWith('/auth') && !event.url.pathname.startsWith('/login') && !event.url.pathname.startsWith('/?code') ) {
    const session = await event.locals.supabase.auth.getSession()
    if (!session) {
      // the user is not signed in
      throw redirect(303, '/login')
    }
  }

  const theme = event.cookies.get('theme')

  if (!theme || !themes.includes(theme)) {
		return await resolve(event, {
      filterSerializedResponseHeaders(name) {
        return name === 'content-range'
      },
    })
	}

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
		transformPageChunk: ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${theme}"`)
		},
  })
}