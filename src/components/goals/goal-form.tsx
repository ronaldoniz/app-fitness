"use client";

import Link from "next/link";
import { useActionState } from "react";

import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import type { Goal } from "@/domain";
import {
  createGoalAction,
  updateGoalAction,
} from "@/goals/actions";

export function GoalForm({
  goal,
  referenceLabel,
  referenceWeightKg,
}: {
  goal?: Goal;
  referenceLabel: string;
  referenceWeightKg: number;
}) {
  const serverAction = goal
    ? updateGoalAction.bind(null, goal.id)
    : createGoalAction;
  const [state, action] = useActionState(
    serverAction,
    initialFormActionState,
  );
  const isEditing = Boolean(goal);

  return (
    <form action={action} className="grid gap-6">
      <FormMessage state={state} />

      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Peso-alvo em quilogramas
        <input
          className="form-input"
          defaultValue={goal?.targetWeightKg}
          inputMode="decimal"
          min="0.1"
          name="targetWeightKg"
          required
          step="0.1"
          type="number"
        />
        <span className="text-xs font-normal leading-5 text-slate-500">
          Deve ser maior que zero e menor que {referenceLabel} de{" "}
          {referenceWeightKg.toLocaleString("pt-BR")} kg.
        </span>
      </label>

      {!isEditing ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-slate-400">
          A nova meta será criada como pendente. Você poderá ativá-la na tela
          de metas.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SubmitButton
          pendingLabel={isEditing ? "Salvando…" : "Criando…"}
        >
          {isEditing ? "Salvar alterações" : "Criar meta"}
        </SubmitButton>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
          href="/metas"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
