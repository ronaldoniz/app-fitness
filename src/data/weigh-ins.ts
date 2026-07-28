import type { Weighing, WeighingInput } from "@/domain";
import type { AppSupabaseClient } from "@/lib/supabase/types";

import { throwDataAccessError } from "./errors";
import {
  mapWeighInRow,
  toWeighInInsert,
  toWeighInUpdate,
} from "./mappers";

export interface WeighInListFilters {
  from?: Weighing["date"];
  to?: Weighing["date"];
}

export async function getWeighIn(
  client: AppSupabaseClient,
  userId: string,
  weighInId: string,
): Promise<Weighing | null> {
  const { data, error } = await client
    .from("weigh_ins")
    .select("*")
    .eq("id", weighInId)
    .eq("user_id", userId)
    .maybeSingle();

  throwDataAccessError("carregar a pesagem", error);
  return data ? mapWeighInRow(data) : null;
}

export async function listWeighIns(
  client: AppSupabaseClient,
  userId: string,
  filters: WeighInListFilters = {},
): Promise<Weighing[]> {
  let query = client
    .from("weigh_ins")
    .select("*")
    .eq("user_id", userId)
    .order("weighed_on", { ascending: false });

  if (filters.from) {
    query = query.gte("weighed_on", filters.from);
  }

  if (filters.to) {
    query = query.lte("weighed_on", filters.to);
  }

  const { data, error } = await query;

  throwDataAccessError("listar as pesagens", error);
  return data.map(mapWeighInRow);
}

export async function createWeighIn(
  client: AppSupabaseClient,
  userId: string,
  input: WeighingInput,
): Promise<Weighing> {
  const { data, error } = await client
    .from("weigh_ins")
    .insert(toWeighInInsert(userId, input))
    .select("*")
    .single();

  throwDataAccessError("criar a pesagem", error);
  return mapWeighInRow(data);
}

export async function updateWeighIn(
  client: AppSupabaseClient,
  userId: string,
  weighInId: string,
  input: WeighingInput,
): Promise<Weighing> {
  const { data, error } = await client
    .from("weigh_ins")
    .update(toWeighInUpdate(input))
    .eq("id", weighInId)
    .eq("user_id", userId)
    .select("*")
    .single();

  throwDataAccessError("atualizar a pesagem", error);
  return mapWeighInRow(data);
}

export async function deleteWeighIn(
  client: AppSupabaseClient,
  userId: string,
  weighInId: string,
): Promise<void> {
  const { error } = await client
    .from("weigh_ins")
    .delete()
    .eq("id", weighInId)
    .eq("user_id", userId);

  throwDataAccessError("excluir a pesagem", error);
}
