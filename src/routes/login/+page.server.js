import { fail } from '@sveltejs/kit'

export const actions = {
  register: async ({ request, url, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`,
      },
    })

    if (error) {
      return fail(500, { message: 'Server error. Try again later.', success: false, email })
    }

    return {
      message: 'registrado',
      success: true,
    }
  },
  login: async ({ request, url, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.log(error)
      return fail(500, { message: 'Server error. Try again later.', success: false, email })
    }

    return {
      message: 'logueado',
      success: true,
    }
  },
}