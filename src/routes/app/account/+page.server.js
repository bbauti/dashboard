import { fail, redirect } from '@sveltejs/kit'

import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_ROLE_KEY } from '$env/static/private'


import { createClient } from '@supabase/supabase-js'


export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession()

  const { data: profile } = await supabase
    .from('profiles')
    .select(`first_name, last_name, avatar_url, stockNotifications`)
    .eq('id', session.user.id)
    .single()

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
    const avatar = formData.get('avatar')

    const session = await getSession()

    const email = session.user.email

    async function uploadAvatar(file) {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(`public/${session?.user.id}.png`, file, {
          upsert: true
        })
        return {data, error}
    }

    async function getAvatarUrl() {
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(`public/${session?.user.id}.png`)
      return data['publicUrl']
    }

    async function changeProfileAvatar(url) {
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        avatar_url: url,
        updated_at: new Date(),
      })
      return error
    }

    uploadAvatar(avatar)
    const url = await getAvatarUrl()
    changeProfileAvatar(url)

    return {
      url,
    }
  },
  editSettings: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData()
    const notifications = formData.get('notifications')

    const session = await getSession()

    console.log(notifications)

    const { data } = await supabase
      .from('profiles')
      .update({ stockNotifications: notifications })
      .eq('id', session.user.id)

    return {}
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
      return fail(500, { message: 'Las contraseña debe ser mayor a 8 caracteres', success: false })
    }

    if (password !== passwordConfirm) {
      return fail(500, { message: 'Las contraseñas deben ser iguales', success: false })
    }
    
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })    
    if (error) {
      return fail(500, { message: 'Hubo un error', success: false })
    }
    return { message: "contraseña cambiada correctamente", success: true }

  },
}