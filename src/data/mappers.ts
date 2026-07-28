import type {
  Goal,
  GoalInput,
  Profile,
  ProfileInput,
  Weighing,
  WeighingInput,
} from "@/domain";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";

export function mapProfileRow(row: Tables<"profiles">): Profile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    heightCm: row.height_cm,
    initialWeightKg: row.initial_weight_kg,
    themePreference: row.theme_preference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWeighInRow(row: Tables<"weigh_ins">): Weighing {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.weighed_on as Weighing["date"],
    weightKg: row.weight_kg,
    waistCm: row.waist_cm,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapGoalRow(row: Tables<"goals">): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    targetWeightKg: row.target_weight_kg,
    displayOrder: row.display_order,
    isActive: row.is_active,
    completedOn: row.completed_on as Goal["completedOn"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProfileUpdate(
  input: ProfileInput,
): TablesUpdate<"profiles"> {
  return {
    name: input.name,
    email: input.email,
    height_cm: input.heightCm,
    initial_weight_kg: input.initialWeightKg,
    theme_preference: input.themePreference,
  };
}

export function toWeighInInsert(
  userId: string,
  input: WeighingInput,
): TablesInsert<"weigh_ins"> {
  return {
    user_id: userId,
    weighed_on: input.date,
    weight_kg: input.weightKg,
    waist_cm: input.waistCm ?? null,
    notes: input.notes ?? null,
  };
}

export function toWeighInUpdate(
  input: WeighingInput,
): TablesUpdate<"weigh_ins"> {
  return {
    weighed_on: input.date,
    weight_kg: input.weightKg,
    waist_cm: input.waistCm ?? null,
    notes: input.notes ?? null,
  };
}

export function toGoalInsert(
  userId: string,
  input: GoalInput,
): TablesInsert<"goals"> {
  return {
    user_id: userId,
    target_weight_kg: input.targetWeightKg,
    display_order: input.displayOrder,
    is_active: input.isActive,
  };
}

export function toGoalUpdate(
  input: Pick<GoalInput, "targetWeightKg" | "displayOrder">,
): TablesUpdate<"goals"> {
  return {
    target_weight_kg: input.targetWeightKg,
    display_order: input.displayOrder,
  };
}
