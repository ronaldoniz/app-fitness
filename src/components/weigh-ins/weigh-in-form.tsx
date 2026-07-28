"use client";

import Link from "next/link";
import { useActionState } from "react";

import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import type { CivilDate, Weighing } from "@/domain";
import {
  createWeighInAction,
  type WeighInReturnPath,
  updateWeighInAction,
} from "@/weigh-ins/actions";

export function WeighInForm({
  returnTo = "/dashboard",
  today,
  weighing,
}: {
  returnTo?: WeighInReturnPath;
  today: CivilDate;
  weighing?: Weighing;
}) {
  const serverAction = weighing
    ? updateWeighInAction.bind(null, weighing.id, returnTo)
    : createWeighInAction;
  const [state, action] = useActionState(
    serverAction,
    initialFormActionState,
  );
  const isEditing = Boolean(weighing);

  return (
    <form action={action} className="grid gap-6">
      <FormMessage state={state} />

      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Data
        <input
          className="form-input"
          defaultValue={weighing?.date ?? today}
          max={today}
          name="date"
          required
          type="date"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Peso em quilogramas
        <input
          className="form-input"
          defaultValue={weighing?.weightKg}
          inputMode="decimal"
          min="0.1"
          name="weightKg"
          required
          step="0.1"
          type="number"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Circunferência da cintura em centímetros
        <input
          className="form-input"
          defaultValue={weighing?.waistCm ?? ""}
          inputMode="decimal"
          min="0.1"
          name="waistCm"
          step="0.1"
          type="number"
        />
        <span className="text-xs font-normal text-slate-500">Opcional</span>
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Observação
        <textarea
          className="form-input min-h-28 resize-y"
          defaultValue={weighing?.notes ?? ""}
          name="notes"
          rows={4}
        />
        <span className="text-xs font-normal text-slate-500">Opcional</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SubmitButton
          pendingLabel={isEditing ? "Salvando…" : "Registrando…"}
        >
          {isEditing ? "Salvar alterações" : "Registrar pesagem"}
        </SubmitButton>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
          href={returnTo}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
