import { fail } from '@sveltejs/kit'
import { LOGIN_CODE } from '$env/static/private'
import { redirect } from '@sveltejs/kit'


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
  sendCode: async ({ request }) => {
    const formData = await request.formData()
    const code = formData.get('code')
    if (code === LOGIN_CODE) {
      return {code: true}
    }
    return {code: false}
  }
}