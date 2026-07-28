"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormActionState } from "@/auth/form-state";
import { requireCompletedProfile } from "@/auth/guards";
import {
  activateGoal,
  createGoal,
  DataAccessError,
  deleteGoal,
  getGoal,
  getProfile,
  listGoals,
  listWeighIns,
  movePendingGoal,
  type GoalMoveDirection,
  updateGoal,
} from "@/data";
import {
  validateGoalCanBeActivated,
  validateGoalCanBeChanged,
} from "@/domain";

import {
  getGoalReferenceWeightKg,
  nextGoalDisplayOrder,
} from "./goals";
import {
  isGoalId,
  validateGoalFormInput,
} from "./validation";

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function errorState(message: string): FormActionState {
  return { status: "error", message };
}

function goalMutationErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof DataAccessError) {
    if (error.code === "P0002") {
      return "Meta não encontrada ou indisponível para esta ação.";
    }

    if (error.code === "23505") {
      return "Já existe uma meta ativa. Atualize a página e tente novamente.";
    }

    if (error.code === "23514") {
      if (error.message.includes("completed goal")) {
        return "Uma meta concluída não pode ser alterada ou reativada.";
      }

      if (error.message.includes("target weight")) {
        return "O peso-alvo deve ser menor que o peso atual.";
      }

      return "A meta não atende às regras de perda de peso.";
    }
  }

  return fallback;
}

function refreshGoalViews(): void {
  revalidatePath("/metas");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
}

export async function createGoalAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { client, user } = await requireCompletedProfile();

  try {
    const [profile, weighings, goals] = await Promise.all([
      getProfile(client, user.id),
      listWeighIns(client, user.id),
      listGoals(client, user.id),
    ]);

    if (!profile) {
      return errorState("Perfil não encontrado.");
    }

    const validation = validateGoalFormInput(
      {
        targetWeightKg: formString(formData, "targetWeightKg"),
      },
      {
        displayOrder: nextGoalDisplayOrder(goals),
        referenceWeightKg: getGoalReferenceWeightKg(profile, weighings),
      },
    );

    if (!validation.valid) {
      return errorState(validation.message);
    }

    await createGoal(client, user.id, validation.value);
  } catch (error) {
    return errorState(
      goalMutationErrorMessage(error, "Não foi possível criar a meta."),
    );
  }

  refreshGoalViews();
  redirect("/metas");
}

export async function updateGoalAction(
  goalId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { client, user } = await requireCompletedProfile();

  if (!isGoalId(goalId)) {
    return errorState("Meta não encontrada.");
  }

  try {
    const [goal, profile, weighings] = await Promise.all([
      getGoal(client, user.id, goalId),
      getProfile(client, user.id),
      listWeighIns(client, user.id),
    ]);

    if (!goal || !profile) {
      return errorState("Meta não encontrada.");
    }

    const changeValidation = validateGoalCanBeChanged(goal);

    if (!changeValidation.valid) {
      return errorState(changeValidation.issues[0].message);
    }

    const validation = validateGoalFormInput(
      {
        targetWeightKg: formString(formData, "targetWeightKg"),
      },
      {
        displayOrder: goal.displayOrder,
        referenceWeightKg: getGoalReferenceWeightKg(profile, weighings),
      },
    );

    if (!validation.valid) {
      return errorState(validation.message);
    }

    await updateGoal(client, user.id, goalId, {
      targetWeightKg: validation.value.targetWeightKg,
      displayOrder: goal.displayOrder,
    });
  } catch (error) {
    return errorState(
      goalMutationErrorMessage(error, "Não foi possível atualizar a meta."),
    );
  }

  refreshGoalViews();
  redirect("/metas");
}

export async function activateGoalAction(
  goalId: string,
  _previousState: FormActionState,
  _formData: FormData,
): Promise<FormActionState> {
  void _previousState;
  void _formData;

  const { client, user } = await requireCompletedProfile();

  if (!isGoalId(goalId)) {
    return errorState("Meta não encontrada.");
  }

  try {
    const goal = await getGoal(client, user.id, goalId);

    if (!goal) {
      return errorState("Meta não encontrada.");
    }

    const activationValidation = validateGoalCanBeActivated(goal);

    if (!activationValidation.valid) {
      return errorState(activationValidation.issues[0].message);
    }

    if (!goal.isActive) {
      await activateGoal(client, goalId);
    }
  } catch (error) {
    return errorState(
      goalMutationErrorMessage(error, "Não foi possível ativar a meta."),
    );
  }

  refreshGoalViews();
  redirect("/metas");
}

export async function deleteGoalAction(
  goalId: string,
  _previousState: FormActionState,
  _formData: FormData,
): Promise<FormActionState> {
  void _previousState;
  void _formData;

  const { client, user } = await requireCompletedProfile();

  if (!isGoalId(goalId)) {
    return errorState("Meta não encontrada.");
  }

  try {
    const goal = await getGoal(client, user.id, goalId);

    if (!goal) {
      return errorState("Meta não encontrada.");
    }

    await deleteGoal(client, user.id, goalId);
  } catch (error) {
    return errorState(
      goalMutationErrorMessage(error, "Não foi possível excluir a meta."),
    );
  }

  refreshGoalViews();
  redirect("/metas");
}

export async function moveGoalAction(
  goalId: string,
  direction: GoalMoveDirection,
  _previousState: FormActionState,
  _formData: FormData,
): Promise<FormActionState> {
  void _previousState;
  void _formData;

  const { client } = await requireCompletedProfile();

  if (
    !isGoalId(goalId) ||
    (direction !== "up" && direction !== "down")
  ) {
    return errorState("Não foi possível reordenar essa meta.");
  }

  try {
    await movePendingGoal(client, goalId, direction);
  } catch (error) {
    return errorState(
      goalMutationErrorMessage(error, "Não foi possível reordenar a meta."),
    );
  }

  refreshGoalViews();
  redirect("/metas");
}
