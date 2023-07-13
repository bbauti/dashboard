import { fail } from '@sveltejs/kit'

export const actions = {
  register: async ({ request, url, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get("confirmPassword")
    
    if (!email || !password) {
      return fail(500, { message: 'Debes introducir el correo y contraseñas.', success: false, email })
    }

    if (confirmPassword !== password) {
      return fail(500, { message: 'Las contraseñas deben ser las mismas.', success: false, email })
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`,
      },
    })

    if (error) {
      return fail(500, { message: 'Error en el servidor.', success: false, email })
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

    if (!email || !password) {
      return fail(500, { message: 'Debes introducir el correo y contraseñas.', success: false, email })
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.log(error)
      return fail(500, { message: 'Error en el servidor.', success: false, email })
    }

    return {
      message: 'logueado',
      success: true,
    }
  },
}