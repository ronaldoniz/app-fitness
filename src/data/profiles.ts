import type { Profile, ProfileInput } from "@/domain";
import type { AppSupabaseClient } from "@/lib/supabase/types";

import { throwDataAccessError } from "./errors";
import {
  mapProfileRow,
  toProfileUpdate,
} from "./mappers";

export async function getProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  throwDataAccessError("carregar o perfil", error);
  return data ? mapProfileRow(data) : null;
}

export async function updateProfile(
  client: AppSupabaseClient,
  userId: string,
  input: ProfileInput,
): Promise<Profile> {
  const { data, error } = await client
    .from("profiles")
    .update(toProfileUpdate(input))
    .eq("user_id", userId)
    .select("*")
    .single();

  throwDataAccessError("atualizar o perfil", error);
  return mapProfileRow(data);
}

export async function deleteOwnAccount(
  client: AppSupabaseClient,
): Promise<void> {
  const { error } = await client.rpc("delete_own_account");
  throwDataAccessError("excluir a conta", error);
}
