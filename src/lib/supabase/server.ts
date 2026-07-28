import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";
import { readSupabasePublicEnvironment } from "./env";

export async function createServerSupabaseClient() {
  const { url, publishableKey } = readSupabasePublicEnvironment();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components não podem escrever cookies. O Proxy renova a
          // sessão antes da renderização; ações e rotas podem persistir cookies.
        }
      },
    },
  });
}
