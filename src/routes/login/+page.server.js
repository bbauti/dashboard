import { fail } from '@sveltejs/kit'
import { LOGIN_CODE } from '$env/static/private'

export const load = async ({ cookies, locals: { getSession } }) => {
  const code = cookies.get('code')
  if (LOGIN_CODE === code) {
    return {code: true, session: await getSession()}
  }
  return {
    session: await getSession(),
  }
}

export const actions = {
  register: async ({ request, url, locals: { supabase, getSession } }) => {
    const session = await getSession()
    const formData = await request.formData()
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')
    const email = formData.get('emailInput')
    const password = formData.get('passwordInput')
    const confirmPassword = formData.get("confirmPassword")
    
    if (!email || !password || !firstName || !lastName) {
      return fail(500, { message: 'Debes introducir todos los campos.', success: false, email })
    }

    if (confirmPassword !== password) {
      return fail(500, { message: 'Las contraseñas deben ser las mismas', success: false, email })
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      return fail(500, { message: 'Datos incorrectos', success: false, email })
    }

    return {
      message: 'Registrado correctamente!',
      success: true,
    }
  },
  login: async ({ request, url, locals: { supabase, getSession } }) => {
    const session = await getSession()
    const formData = await request.formData()
    const email = formData.get('emailInput')
    const password = formData.get('passwordInput')

    if (!email || !password) {
      return fail(500, { message: 'Debes introducir el correo y contraseñas', success: false, email })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
      return fail(500, { message: 'Datos incorrectos. Comprobaste el correo electronico?', success: false, email })
    }

    return {
      message: 'Autenticado correctamente!',
      success: true,
      logged: true,
    }
  },
  sendCode: async ({ request, url, locals: { supabase, getSession } }) => {
    const formData = await request.formData()
    const code = formData.get('code')
    if (code === LOGIN_CODE) {
      return {code: true}
    }
    return {code: false}
  }
}