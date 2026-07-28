"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateOnboardingInput } from "@/onboarding/validation";

import { getAuthErrorMessage } from "./errors";
import type { FormActionState } from "./form-state";
import {
  getAuthenticatedDestination,
  getVerifiedUser,
  hasCompletedProfile,
} from "./session";
import { getApplicationOrigin } from "./urls";
import {
  validateEmail,
  validateLoginCredentials,
  validateNewPassword,
  validateRegistrationCredentials,
} from "./validation";

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function errorState(message: string): FormActionState {
  return { status: "error", message };
}

export async function registerAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const validation = validateRegistrationCredentials({
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    password: formString(formData, "password"),
    passwordConfirmation: formString(formData, "passwordConfirmation"),
  });

  if (!validation.valid) {
    return errorState(validation.message);
  }

  const client = await createServerSupabaseClient();
  const origin = await getApplicationOrigin();
  const { data, error } = await client.auth.signUp({
    email: validation.value.email,
    password: validation.value.password,
    options: {
      data: {
        name: validation.value.name,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return errorState(
      getAuthErrorMessage(
        error.code,
        "Não foi possível concluir o cadastro.",
      ),
    );
  }

  if (data.session) {
    redirect("/onboarding");
  }

  redirect(
    `/confirmar-email?email=${encodeURIComponent(validation.value.email)}`,
  );
}

export async function loginAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const validation = validateLoginCredentials({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });

  if (!validation.valid) {
    return errorState(validation.message);
  }

  const client = await createServerSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword(
    validation.value,
  );

  if (error) {
    return errorState(
      getAuthErrorMessage(error.code, "Não foi possível entrar."),
    );
  }

  redirect(await getAuthenticatedDestination(client, data.user.id));
}

export async function requestPasswordResetAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const validation = validateEmail(formString(formData, "email"));

  if (!validation.valid) {
    return errorState(validation.message);
  }

  const client = await createServerSupabaseClient();
  const origin = await getApplicationOrigin();
  const { error } = await client.auth.resetPasswordForEmail(
    validation.value,
    {
      redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
    },
  );

  if (error?.code === "over_email_send_rate_limit") {
    return errorState(
      getAuthErrorMessage(error.code, "Aguarde antes de tentar novamente."),
    );
  }

  return {
    status: "success",
    message:
      "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir a senha.",
  };
}

export async function updatePasswordAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const validation = validateNewPassword({
    password: formString(formData, "password"),
    passwordConfirmation: formString(formData, "passwordConfirmation"),
  });

  if (!validation.valid) {
    return errorState(validation.message);
  }

  const client = await createServerSupabaseClient();
  const user = await getVerifiedUser(client);

  if (!user) {
    return errorState(
      "O link de redefinição expirou. Solicite uma nova mensagem.",
    );
  }

  const { error } = await client.auth.updateUser({
    password: validation.value,
  });

  if (error) {
    return errorState(
      getAuthErrorMessage(
        error.code,
        "Não foi possível atualizar a senha.",
      ),
    );
  }

  await client.auth.signOut();
  redirect("/login?senha=atualizada");
}

export async function logoutAction(): Promise<void> {
  const client = await createServerSupabaseClient();
  await client.auth.signOut();
  redirect("/login");
}

export async function completeOnboardingAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const client = await createServerSupabaseClient();
  const user = await getVerifiedUser(client);

  if (!user?.email) {
    return errorState("Sua sessão expirou. Entre novamente.");
  }

  if (await hasCompletedProfile(client, user.id)) {
    redirect("/dashboard");
  }

  const validation = validateOnboardingInput({
    email: user.email,
    name: formString(formData, "name"),
    heightCm: formString(formData, "heightCm"),
    initialWeightKg: formString(formData, "initialWeightKg"),
    targetWeightKg: formString(formData, "targetWeightKg"),
  });

  if (!validation.valid) {
    return errorState(validation.message);
  }

  const { error } = await client.rpc("complete_onboarding", {
    p_name: validation.value.name,
    p_height_cm: validation.value.heightCm,
    p_initial_weight_kg: validation.value.initialWeightKg,
    p_target_weight_kg: validation.value.targetWeightKg,
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/dashboard");
    }

    return errorState("Não foi possível concluir o onboarding.");
  }

  redirect("/dashboard");
}
