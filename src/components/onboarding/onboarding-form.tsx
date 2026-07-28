"use client";

import { useActionState } from "react";

import { completeOnboardingAction } from "@/auth/actions";
import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [state, action] = useActionState(
    completeOnboardingAction,
    initialFormActionState,
  );

  return (
    <form action={action} className="grid gap-6">
      <FormMessage state={state} />

      <fieldset className="grid gap-5">
        <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
          Seu perfil
        </legend>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Nome
          <input
            autoComplete="name"
            className="form-input"
            defaultValue={defaultName}
            name="name"
            required
            type="text"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Altura em centímetros
          <input
            className="form-input"
            inputMode="decimal"
            min="0.1"
            name="heightCm"
            required
            step="0.1"
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Peso inicial em quilogramas
          <input
            className="form-input"
            inputMode="decimal"
            min="0.1"
            name="initialWeightKg"
            required
            step="0.1"
            type="number"
          />
          <span className="text-xs font-normal leading-5 text-slate-500">
            Esse valor será uma referência e não criará uma pesagem no
            histórico.
          </span>
        </label>
      </fieldset>

      <fieldset className="grid gap-5 border-t border-white/10 pt-6">
        <legend className="pr-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
          Primeira meta
        </legend>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Peso-alvo em quilogramas
          <input
            className="form-input"
            inputMode="decimal"
            min="0.1"
            name="targetWeightKg"
            required
            step="0.1"
            type="number"
          />
          <span className="text-xs font-normal leading-5 text-slate-500">
            O alvo deve ser menor que o peso inicial informado.
          </span>
        </label>
      </fieldset>

      <SubmitButton pendingLabel="Salvando perfil…">
        Concluir configuração
      </SubmitButton>
    </form>
  );
}
