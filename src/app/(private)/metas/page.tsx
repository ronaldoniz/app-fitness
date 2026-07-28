import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import {
  ActivateGoalForm,
  DeleteGoalForm,
  GoalOrderControls,
} from "@/components/goals/goal-actions";
import { getProfile, listGoals, listWeighIns } from "@/data";
import {
  calculateGoalProgressPercent,
  calculateWeightRemainingKg,
  formatCivilDatePtBr,
  getCurrentWeighing,
} from "@/domain";
import {
  getGoalReferenceWeightKg,
  groupGoals,
} from "@/goals/goals";

export const metadata: Metadata = {
  title: "Metas",
};

function formatDecimal(value: number): string {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });
}

function formatKg(value: number | null): string {
  return value === null ? "—" : `${formatDecimal(value)} kg`;
}

function EmptyGroup({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-white/15 px-5 py-6 text-sm leading-6 text-slate-400">
      {children}
    </p>
  );
}

export default async function GoalsPage() {
  const { client, user } = await requireCompletedProfile();
  const [profile, weighings, goals] = await Promise.all([
    getProfile(client, user.id),
    listWeighIns(client, user.id),
    listGoals(client, user.id),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  const groups = groupGoals(goals);
  const currentWeighing = getCurrentWeighing(weighings);
  const referenceWeightKg = getGoalReferenceWeightKg(profile, weighings);
  const activeProgress =
    groups.active && currentWeighing
      ? calculateGoalProgressPercent(
          profile.initialWeightKg,
          currentWeighing.weightKg,
          groups.active.targetWeightKg,
        )
      : null;
  const activeRemaining =
    groups.active && currentWeighing
      ? calculateWeightRemainingKg(
          currentWeighing.weightKg,
          groups.active.targetWeightKg,
        )
      : null;

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Planejamento
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              Metas de peso
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Organize metas exclusivas de perda de peso. Apenas uma pode
              permanecer ativa por vez.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            href="/metas/nova"
          >
            Criar meta
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-slate-300">
            Peso de referência:{" "}
            <strong className="text-white">
              {formatKg(referenceWeightKg)}
            </strong>
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-slate-300">
            {currentWeighing
              ? `Pesagem atual de ${formatCivilDatePtBr(currentWeighing.date)}`
              : "Referência do peso inicial"}
          </span>
        </div>

        <section aria-labelledby="active-goal-title" className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2
              className="text-xl font-semibold text-white"
              id="active-goal-title"
            >
              Meta ativa
            </h2>
            <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {groups.active ? "1 ativa" : "Nenhuma ativa"}
            </span>
          </div>

          {groups.active ? (
            <article className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    Alvo atual
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatKg(groups.active.targetWeightKg)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    A conclusão será registrada automaticamente quando a
                    pesagem mais recente atingir ou ficar abaixo deste valor.
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Falta</dt>
                    <dd className="mt-1 font-semibold text-white">
                      {formatKg(activeRemaining)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Progresso</dt>
                    <dd className="mt-1 font-semibold text-white">
                      {activeProgress === null
                        ? "—"
                        : `${formatDecimal(activeProgress)}%`}
                    </dd>
                  </div>
                </dl>
              </div>

              {activeProgress !== null ? (
                <div
                  aria-label={`${formatDecimal(activeProgress)}% da meta`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={activeProgress}
                  className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                >
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${activeProgress}%` }}
                  />
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3 border-t border-emerald-300/15 pt-5">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                  href={`/metas/${groups.active.id}/editar`}
                >
                  Editar
                </Link>
                <DeleteGoalForm
                  completed={false}
                  goalId={groups.active.id}
                />
              </div>
            </article>
          ) : (
            <EmptyGroup>
              Não há meta ativa. Ative uma meta pendente para acompanhar o
              progresso no Dashboard.
            </EmptyGroup>
          )}
        </section>

        <section aria-labelledby="pending-goals-title" className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2
              className="text-xl font-semibold text-white"
              id="pending-goals-title"
            >
              Metas pendentes
            </h2>
            <span className="text-sm text-slate-500">
              {groups.pending.length}{" "}
              {groups.pending.length === 1 ? "meta" : "metas"}
            </span>
          </div>

          {groups.pending.length > 0 ? (
            <div className="grid gap-4">
              {groups.pending.map((goal, index) => (
                <article
                  className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center"
                  key={goal.id}
                >
                  <GoalOrderControls
                    canMoveDown={index < groups.pending.length - 1}
                    canMoveUp={index > 0}
                    goalId={goal.id}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Meta pendente {index + 1}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {formatKg(goal.targetWeightKg)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      A ativação não altera nem revalida o alvo antigo; ela
                      reavalia a conclusão usando o peso atual.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                    <ActivateGoalForm goalId={goal.id} />
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                      href={`/metas/${goal.id}/editar`}
                    >
                      Editar
                    </Link>
                    <DeleteGoalForm completed={false} goalId={goal.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyGroup>
              Não há metas pendentes. Você pode criar uma nova meta de perda de
              peso.
            </EmptyGroup>
          )}
        </section>

        <section aria-labelledby="completed-goals-title" className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2
                className="text-xl font-semibold text-white"
                id="completed-goals-title"
              >
                Marcos concluídos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Permanecem somente para leitura enquanto não forem excluídos.
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {groups.completed.length}
            </span>
          </div>

          {groups.completed.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.completed.map((goal) => (
                <article
                  className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.045] p-5"
                  key={goal.id}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">
                    Meta concluída
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {formatKg(goal.targetWeightKg)}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Concluída em{" "}
                    {goal.completedOn
                      ? formatCivilDatePtBr(goal.completedOn)
                      : "—"}
                  </p>
                  <div className="mt-5 border-t border-sky-300/10 pt-4">
                    <DeleteGoalForm completed goalId={goal.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyGroup>
              Nenhum marco concluído ainda. Metas alcançadas serão preservadas
              aqui automaticamente.
            </EmptyGroup>
          )}
        </section>
      </div>
    </main>
  );
}
