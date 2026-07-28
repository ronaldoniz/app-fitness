import type { Goal, GoalInput } from "@/domain";
import type { AppSupabaseClient } from "@/lib/supabase/types";

import { throwDataAccessError } from "./errors";
import {
  mapGoalRow,
  toGoalInsert,
  toGoalUpdate,
} from "./mappers";

export type GoalMoveDirection = "up" | "down";

export async function getGoal(
  client: AppSupabaseClient,
  userId: string,
  goalId: string,
): Promise<Goal | null> {
  const { data, error } = await client
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", userId)
    .maybeSingle();

  throwDataAccessError("carregar a meta", error);
  return data ? mapGoalRow(data) : null;
}

export async function listGoals(
  client: AppSupabaseClient,
  userId: string,
): Promise<Goal[]> {
  const { data, error } = await client
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  throwDataAccessError("listar as metas", error);
  return data.map(mapGoalRow);
}

export async function createGoal(
  client: AppSupabaseClient,
  userId: string,
  input: GoalInput,
): Promise<Goal> {
  const { data, error } = await client
    .from("goals")
    .insert(toGoalInsert(userId, input))
    .select("*")
    .single();

  throwDataAccessError("criar a meta", error);
  return mapGoalRow(data);
}

export async function updateGoal(
  client: AppSupabaseClient,
  userId: string,
  goalId: string,
  input: Pick<GoalInput, "targetWeightKg" | "displayOrder">,
): Promise<Goal> {
  const { data, error } = await client
    .from("goals")
    .update(toGoalUpdate(input))
    .eq("id", goalId)
    .eq("user_id", userId)
    .select("*")
    .single();

  throwDataAccessError("atualizar a meta", error);
  return mapGoalRow(data);
}

export async function activateGoal(
  client: AppSupabaseClient,
  goalId: string,
): Promise<Goal> {
  const { data, error } = await client.rpc("activate_goal", {
    p_goal_id: goalId,
  });

  throwDataAccessError("ativar a meta", error);
  return mapGoalRow(data);
}

export async function deactivateGoal(
  client: AppSupabaseClient,
  userId: string,
  goalId: string,
): Promise<Goal> {
  const { data, error } = await client
    .from("goals")
    .update({ is_active: false })
    .eq("id", goalId)
    .eq("user_id", userId)
    .select("*")
    .single();

  throwDataAccessError("desativar a meta", error);
  return mapGoalRow(data);
}

export async function deleteGoal(
  client: AppSupabaseClient,
  userId: string,
  goalId: string,
): Promise<void> {
  const { error } = await client
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  throwDataAccessError("excluir a meta", error);
}

export async function movePendingGoal(
  client: AppSupabaseClient,
  goalId: string,
  direction: GoalMoveDirection,
): Promise<void> {
  const { error } = await client.rpc("move_pending_goal", {
    p_goal_id: goalId,
    p_direction: direction,
  });

  throwDataAccessError("reordenar a meta", error);
}
