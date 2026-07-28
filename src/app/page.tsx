import { redirect } from "next/navigation";

import {
  getAuthenticatedDestination,
  getVerifiedUser,
} from "@/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const client = await createServerSupabaseClient();
  const user = await getVerifiedUser(client);

  if (!user) {
    redirect("/login");
  }

  redirect(await getAuthenticatedDestination(client, user.id));
}
