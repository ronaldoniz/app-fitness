import type { User } from "@supabase/supabase-js";

import type { AppSupabaseClient } from "@/lib/supabase/types";

export async function getVerifiedUser(
  client: AppSupabaseClient,
): Promise<User | null> {
  const { data: claimsData, error: claimsError } =
    await client.auth.getClaims();
  const subject = claimsData?.claims?.sub;

  if (claimsError || !subject) {
    return null;
  }

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  return !userError && user?.id === subject ? user : null;
}

export async function hasCompletedProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}

export async function getAuthenticatedDestination(
  client: AppSupabaseClient,
  userId: string,
): Promise<"/dashboard" | "/onboarding"> {
  return (await hasCompletedProfile(client, userId))
    ? "/dashboard"
    : "/onboarding";
}
