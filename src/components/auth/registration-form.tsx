"use client";

import { useActionState } from "react";

import { registerAction } from "@/auth/actions";
import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";

export function RegistrationForm() {
  const [state, action] = useActionState(
    registerAction,
    initialFormActionState,
  );

  return (
    <form action={action} className="grid gap-5">
      <FormMessage state={state} />
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Nome
        <input
          autoComplete="name"
          className="form-input"
          name="name"
          required
          type="text"
        />
      </label>
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
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Senha
          <input
            autoComplete="new-password"
            className="form-input"
            name="password"
            required
            type="password"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Confirmar senha
          <input
            autoComplete="new-password"
            className="form-input"
            name="passwordConfirmation"
            required
            type="password"
          />
        </label>
      </div>
      <SubmitButton pendingLabel="Criando conta…">
        Criar conta
      </SubmitButton>
    </form>
  );
}
