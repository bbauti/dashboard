import { Response } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    return new Response('Authentication successful!', {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}