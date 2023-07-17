import { fail, redirect } from '@sveltejs/kit'

import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_ROLE_KEY } from '$env/static/private'


import { createClient } from '@supabase/supabase-js'


export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession()

  if (!session) {
    throw redirect(303, '/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`first_name, last_name, avatar_url`)
    .eq('id', session.user.id)
    .single()

  console.log(profile)

  return { session, profile }
}

export const actions = {
  editPersonal: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData()
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')

    const session = await getSession()

    const email = session.user.email

    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date(),
    })

    if (error) {
      console.log(error)
      return fail(500, {
        firstName,
        lastName,
        email
      })
    }

    return {
      firstName,
      lastName,
      email
    }
  },
  editProfile: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData()
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')

    const session = await getSession()

    const email = session.user.email

    console.log(firstName)
    console.log(lastName)
    console.log(email)

    // const { error } = await supabase.from('profiles').upsert({
    //   id: session.user.id,
    //   first_name: firstName,
    //   last_name: lastName,
    //   updated_at: new Date(),
    // })

    // if (error) {
    //   console.log(error)
    //   return fail(500, {
    //     firstName,
    //     lastName,
    //     email
    //   })
    // }

    // return {
    //   firstName,
    //   lastName,
    //   email
    // }
  },
  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession()
    if (session) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
  deleteAccount: async ({ request, locals: { getSession } }) => {

    const formData = await request.formData()
    const userId = formData.get('userId')

    const session = await getSession()

    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase.auth.admin.deleteUser(
      userId
    )
    
  },
  changePassword: async ({ request, locals: {supabase, getSession } }) => {

    const formData = await request.formData()
    const password = formData.get('password')
    const passwordConfirm = formData.get('passwordConfirm')

    const session = await getSession()

    if (password.length < 8) {
      console.log('muy corta')
      return fail(500, { message: 'Las contraseña debe ser mayor a 8 caracteres', success: false })
    }

    if (password !== passwordConfirm) {
      console.log('no es igual')
      return fail(500, { message: 'Las contraseñas deben ser iguales', success: false })
    }
    
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })    
    console.log(error)
    if (error) {
      return fail(500, { message: 'Hubo un error', success: false })
    }
    console.log(data)
    return { message: "contraseña cambiada correctamente", success: true }

  },
}