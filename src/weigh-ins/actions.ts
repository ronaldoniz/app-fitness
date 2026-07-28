"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormActionState } from "@/auth/form-state";
import { requireCompletedProfile } from "@/auth/guards";
import {
  createWeighIn,
  DataAccessError,
  deleteWeighIn,
  listWeighIns,
  updateWeighIn,
} from "@/data";
import { formatLocalCivilDate } from "@/domain";

import {
  isWeighInId,
  validateWeighInFormInput,
} from "./validation";

export type WeighInReturnPath = "/dashboard" | "/historico";

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function errorState(message: string): FormActionState {
  return { status: "error", message };
}

function mutationErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof DataAccessError) {
    if (error.code === "23505") {
      return "Já existe uma pesagem nessa data.";
    }

    if (error.code === "23514" || error.code === "22P02") {
      return "A pesagem contém um valor inválido.";
    }
  }

  return fallback;
}

function readForm(formData: FormData) {
  return {
    date: formString(formData, "date"),
    weightKg: formString(formData, "weightKg"),
    waistCm: formString(formData, "waistCm"),
    notes: formString(formData, "notes"),
  };
}

function refreshWeighInViews(): void {
  revalidatePath("/dashboard");
  revalidatePath("/historico");
}

function safeReturnPath(path: WeighInReturnPath): WeighInReturnPath {
  return path === "/historico" ? "/historico" : "/dashboard";
}

export async function createWeighInAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { client, user } = await requireCompletedProfile();

  try {
    const existingWeighings = await listWeighIns(client, user.id);
    const validation = validateWeighInFormInput(readForm(formData), {
      today: formatLocalCivilDate(new Date()),
      existingWeighings,
    });

    if (!validation.valid) {
      return errorState(validation.message);
    }

    await createWeighIn(client, user.id, validation.value);
  } catch (error) {
    return errorState(
      mutationErrorMessage(
        error,
        "Não foi possível registrar a pesagem.",
      ),
    );
  }

  refreshWeighInViews();
  redirect("/dashboard");
}

export async function updateWeighInAction(
  weighInId: string,
  returnTo: WeighInReturnPath,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { client, user } = await requireCompletedProfile();

  if (!isWeighInId(weighInId)) {
    return errorState("Pesagem não encontrada.");
  }

  try {
    const existingWeighings = await listWeighIns(client, user.id);

    if (!existingWeighings.some(({ id }) => id === weighInId)) {
      return errorState("Pesagem não encontrada.");
    }

    const validation = validateWeighInFormInput(readForm(formData), {
      today: formatLocalCivilDate(new Date()),
      existingWeighings,
      editingId: weighInId,
    });

    if (!validation.valid) {
      return errorState(validation.message);
    }

    await updateWeighIn(client, user.id, weighInId, validation.value);
  } catch (error) {
    return errorState(
      mutationErrorMessage(
        error,
        "Não foi possível atualizar a pesagem.",
      ),
    );
  }

  refreshWeighInViews();
  redirect(safeReturnPath(returnTo));
}

export async function deleteWeighInAction(
  weighInId: string,
  returnTo: WeighInReturnPath,
  _previousState: FormActionState,
  _formData: FormData,
): Promise<FormActionState> {
  void _previousState;
  void _formData;

  const { client, user } = await requireCompletedProfile();

  if (!isWeighInId(weighInId)) {
    return errorState("Pesagem não encontrada.");
  }

  try {
    await deleteWeighIn(client, user.id, weighInId);
  } catch (error) {
    return errorState(
      mutationErrorMessage(
        error,
        "Não foi possível excluir a pesagem.",
      ),
    );
  }

  refreshWeighInViews();
  redirect(safeReturnPath(returnTo));
}
