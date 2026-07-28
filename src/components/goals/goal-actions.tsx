"use client";

import { useActionState } from "react";

import { initialFormActionState } from "@/auth/form-state";
import {
  activateGoalAction,
  deleteGoalAction,
  moveGoalAction,
} from "@/goals/actions";

function ActionError({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  if (!visible) {
    return null;
  }

  return (
    <span
      aria-live="polite"
      className="text-xs leading-5 text-red-200"
      role="alert"
    >
      {message}
    </span>
  );
}

export function ActivateGoalForm({ goalId }: { goalId: string }) {
  const actionWithId = activateGoalAction.bind(null, goalId);
  const [state, action, pending] = useActionState(
    actionWithId,
    initialFormActionState,
  );

  return (
    <form
      action={action}
      className="grid gap-2"
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Ativar esta meta? A meta ativa atual será desativada e a conclusão será reavaliada pelo peso mais recente.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Ativando…" : "Ativar"}
      </button>
      <ActionError
        message={state.message}
        visible={state.status === "error"}
      />
    </form>
  );
}

export function DeleteGoalForm({
  completed,
  goalId,
}: {
  completed: boolean;
  goalId: string;
}) {
  const actionWithId = deleteGoalAction.bind(null, goalId);
  const [state, action, pending] = useActionState(
    actionWithId,
    initialFormActionState,
  );

  return (
    <form
      action={action}
      className="grid gap-2"
      onSubmit={(event) => {
        const message = completed
          ? "Excluir este marco concluído? Essa ação não poderá ser desfeita."
          : "Excluir esta meta? Essa ação não poderá ser desfeita.";

        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-300/20 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-300/10 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Excluindo…" : "Excluir"}
      </button>
      <ActionError
        message={state.message}
        visible={state.status === "error"}
      />
    </form>
  );
}

function MoveGoalForm({
  direction,
  disabled,
  goalId,
  label,
}: {
  direction: "up" | "down";
  disabled: boolean;
  goalId: string;
  label: string;
}) {
  const actionWithGoal = moveGoalAction.bind(null, goalId, direction);
  const [state, action, pending] = useActionState(
    actionWithGoal,
    initialFormActionState,
  );

  return (
    <form action={action} className="grid gap-1">
      <button
        aria-label={label}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 text-base font-semibold text-slate-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        disabled={disabled || pending}
        title={label}
        type="submit"
      >
        {direction === "up" ? "↑" : "↓"}
      </button>
      <ActionError
        message={state.message}
        visible={state.status === "error"}
      />
    </form>
  );
}

export function GoalOrderControls({
  canMoveDown,
  canMoveUp,
  goalId,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  goalId: string;
}) {
  return (
    <div aria-label="Ordenar meta" className="flex gap-2" role="group">
      <MoveGoalForm
        direction="up"
        disabled={!canMoveUp}
        goalId={goalId}
        label="Mover meta para cima"
      />
      <MoveGoalForm
        direction="down"
        disabled={!canMoveDown}
        goalId={goalId}
        label="Mover meta para baixo"
      />
    </div>
  );
}
