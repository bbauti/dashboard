import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, SUPABASE_JWT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { goto } from '$app/navigation';

import jwt from "jsonwebtoken"

async function authorization({ event, resolve }) {
  // si no esta logueado te obliga
  const session = await event.locals.getSession();
  if (!event.url.pathname.startsWith("/auth")) {
    if (!session) {
      throw redirect(303, "/auth");
    }
  } else {
    if (session) {
      console.log(session)
    }
  }

  return resolve(event);
}


export const handle = sequence(
  SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
    adapter: SupabaseAdapter({
        url: SUPABASE_URL,
        secret: SUPABASE_SERVICE_ROLE_KEY,
      }),
      callbacks: {
        async session({ session, user }) {
          const signingSecret = SUPABASE_JWT_SECRET
          if (signingSecret) {
            const payload = {
              aud: "authenticated",
              exp: Math.floor(new Date(session.expires).getTime() / 1000),
              sub: user.id,
              email: user.email,
              role: "authenticated",
            }
            session.supabaseAccessToken = jwt.sign(payload, signingSecret)
          }
          return session
        },
      },
  }),
  authorization
);
