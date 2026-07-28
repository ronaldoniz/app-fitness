"use client";

import { useActionState } from "react";

import { updatePasswordAction } from "@/auth/actions";
import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";

export function UpdatePasswordForm() {
  const [state, action] = useActionState(
    updatePasswordAction,
    initialFormActionState,
  );

  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Nova senha
        <input
          autoComplete="new-password"
          className="form-input"
          name="password"
          required
          type="password"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Confirmar nova senha
        <input
          autoComplete="new-password"
          className="form-input"
          name="passwordConfirmation"
          required
          type="password"
        />
      </label>
      <SubmitButton pendingLabel="Atualizando…">
        Atualizar senha
      </SubmitButton>
    </form>
  );
}
