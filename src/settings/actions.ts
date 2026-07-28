"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormActionState } from "@/auth/form-state";
import { requireCompletedProfile } from "@/auth/guards";
import {
  DataAccessError,
  deleteOwnAccount,
  getProfile,
  updateProfile,
} from "@/data";

import {
  hasConfirmedAccountDeletion,
  validateProfileSettingsInput,
} from "./validation";

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function errorState(message: string): FormActionState {
  return { status: "error", message };
}

export async function updateProfileSettingsAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { client, user } = await requireCompletedProfile();
  const profile = await getProfile(client, user.id);

  if (!profile || !user.email) {
    return errorState("Não foi possível localizar seu perfil.");
  }

  const validation = validateProfileSettingsInput({
    email: user.email,
    name: formString(formData, "name"),
    heightCm: formString(formData, "heightCm"),
    initialWeightKg: formString(formData, "initialWeightKg"),
    themePreference: formString(formData, "themePreference"),
  });

  if (!validation.valid) {
    return errorState(validation.message);
  }

  try {
    await updateProfile(client, user.id, {
      ...validation.value,
      email: user.email,
    });
  } catch (error) {
    return errorState(
      error instanceof DataAccessError
        ? "Não foi possível salvar as configurações. Tente novamente."
        : "Ocorreu uma falha ao salvar as configurações.",
    );
  }

  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
  revalidatePath("/metas");

  return {
    status: "success",
    message: "Configurações salvas.",
  };
}

export async function deleteAccountAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  if (
    !hasConfirmedAccountDeletion(
      formString(formData, "accountDeletionConfirmation"),
    )
  ) {
    return errorState(
      "Digite EXCLUIR para confirmar a exclusão definitiva da conta.",
    );
  }

  const { client } = await requireCompletedProfile();

  try {
    await deleteOwnAccount(client);
  } catch {
    return errorState(
      "Não foi possível excluir a conta. Nenhuma confirmação de exclusão foi registrada.",
    );
  }

  await client.auth.signOut({ scope: "local" });
  redirect("/login?conta=excluida");
}
