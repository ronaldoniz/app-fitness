"use client";

import { useActionState } from "react";

import { loginAction } from "@/auth/actions";
import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";

export function LoginForm() {
  const [state, action] = useActionState(
    loginAction,
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
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Senha
        <input
          autoComplete="current-password"
          className="form-input"
          name="password"
          required
          type="password"
        />
      </label>
      <SubmitButton pendingLabel="Entrando…">Entrar</SubmitButton>
    </form>
  );
}
