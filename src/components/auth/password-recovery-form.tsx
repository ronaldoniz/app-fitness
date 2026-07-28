"use client";

import { useActionState } from "react";

import { requestPasswordResetAction } from "@/auth/actions";
import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";

export function PasswordRecoveryForm() {
  const [state, action] = useActionState(
    requestPasswordResetAction,
    initialFormActionState,
  );

  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        E-mail
        <input
          autoComplete="email"
          className="form-input"
          name="email"
          required
          type="email"
        />
      </label>
      <SubmitButton pendingLabel="Enviando…">
        Enviar instruções
      </SubmitButton>
    </form>
  );
}
