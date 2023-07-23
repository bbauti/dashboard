import { redirect } from "@sveltejs/kit";

export const load = async ({ url, locals: { getSession } }) => {
  const session = await getSession();
  if (session) {
    throw redirect(303, '/app')
  }
  return { url: url.origin }
}