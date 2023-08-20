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
  resetPassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('emailInput')
    
    if (!email) {
      return fail(500, { message: 'Debes introducir todos los campos.', success: false, email })
    }

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://dash.bbauti.me/auth/callback?next=/password',
    })


    return {
      message: 'Correo enviado correctamente!',
      success: true,
    }
  },
  updatePassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const password = formData.get('passwordInput')
    const confirmPassword = formData.get("confirmPassword")

    if (!password) {
      return fail(500, { message: 'Debes ingresar una contraseña', success: false })
    }
    if (confirmPassword !== password) {
      return fail(500, { message: 'Las contraseñas deben ser las mismas', success: false })
    }

    await supabase.auth.updateUser({ password: password })

    return {
      message: 'Contraseña modificada correctamente!',
      success: true,
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