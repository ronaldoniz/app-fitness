import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  getAuthenticatedDestination,
  getVerifiedUser,
  hasCompletedProfile,
} from "./session";

export async function requireAuthenticatedUser() {
  const client = await createServerSupabaseClient();
  const user = await getVerifiedUser(client);

  if (!user) {
    redirect("/login");
  }

  return { client, user };
}

export async function redirectAuthenticatedUser(): Promise<void> {
  const client = await createServerSupabaseClient();
  const user = await getVerifiedUser(client);

  if (user) {
    redirect(await getAuthenticatedDestination(client, user.id));
  }
}

export async function requirePendingOnboarding() {
  const authenticated = await requireAuthenticatedUser();

  if (await hasCompletedProfile(authenticated.client, authenticated.user.id)) {
    redirect("/dashboard");
  }

  return authenticated;
}

export async function requireCompletedProfile() {
  const authenticated = await requireAuthenticatedUser();

  if (
    !(await hasCompletedProfile(
      authenticated.client,
      authenticated.user.id,
    ))
  ) {
    redirect("/onboarding");
  }

  return authenticated;
}
