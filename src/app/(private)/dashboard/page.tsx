import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import { WeightEvolutionChart } from "@/components/dashboard/weight-evolution-chart";
import { DeleteWeighInForm } from "@/components/weigh-ins/delete-weigh-in-form";
import { getProfile, listGoals, listWeighIns } from "@/data";
import {
  calculateBmi,
  calculateGoalProgressPercent,
  calculateLowestWeightKg,
  calculateSevenDayMovingAverageKg,
  calculateTotalWeightLostKg,
  calculateWeightRemainingKg,
  classifyAdultBmi,
  formatCivilDatePtBr,
  getCurrentWeighing,
} from "@/domain";

export const metadata: Metadata = {
  title: "Dashboard",
};

function formatDecimal(value: number, maximumFractionDigits = 1): string {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

function formatKg(value: number | null): string {
  return value === null ? "—" : `${formatDecimal(value)} kg`;
}

function formatTotalLost(value: number | null): string {
  if (value === null) {
    return "—";
  }

  if (value < 0) {
    return `${formatDecimal(Math.abs(value))} kg acima do inicial`;
  }

  return `${formatDecimal(value)} kg`;
}

export default async function DashboardPage() {
  const { client, user } = await requireCompletedProfile();
  const [profile, goals, weighings] = await Promise.all([
    getProfile(client, user.id),
    listGoals(client, user.id),
    listWeighIns(client, user.id),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  const activeGoal = goals.find(({ isActive }) => isActive);
  const currentWeighing = getCurrentWeighing(weighings);
  const currentWeightKg = currentWeighing?.weightKg ?? null;
  const bmi =
    currentWeightKg === null
      ? null
      : calculateBmi(currentWeightKg, profile.heightCm);
  const bmiClassification = bmi === null ? null : classifyAdultBmi(bmi);
  const totalLost =
    currentWeightKg === null
      ? null
      : calculateTotalWeightLostKg(
          profile.initialWeightKg,
          currentWeightKg,
        );
  const lowestWeight = calculateLowestWeightKg(weighings);
  const movingAverage = calculateSevenDayMovingAverageKg(weighings);
  const goalProgress =
    activeGoal && currentWeightKg !== null
      ? calculateGoalProgressPercent(
          profile.initialWeightKg,
          currentWeightKg,
          activeGoal.targetWeightKg,
        )
      : null;
  const weightRemaining =
    activeGoal && currentWeightKg !== null
      ? calculateWeightRemainingKg(
          currentWeightKg,
          activeGoal.targetWeightKg,
        )
      : null;
  const recentWeighings = weighings.slice(0, 5);
  const hasSingleWeighing = weighings.length === 1;

  return (
    <main className="min-w-0 flex-1 overflow-x-clip px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Sua evolução
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              Olá, {profile.name}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Acompanhe os indicadores calculados a partir da sua pesagem mais
              recente.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            href="/pesagens/nova"
          >
            Registrar pesagem
          </Link>
        </div>

        {weighings.length === 0 ? (
          <section className="mt-10 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              Registre sua primeira pesagem
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              O peso inicial permanece como referência do perfil. A primeira
              pesagem começará o histórico e permitirá calcular os indicadores
              atuais.
            </p>
          </section>
        ) : null}

        {hasSingleWeighing ? (
          <section
            aria-label="Estado do histórico"
            className="mt-10 rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-5 text-sm leading-6 text-slate-300"
          >
            Há uma pesagem registrada. Os indicadores atuais estão
            disponíveis, mas ainda não existe variação histórica entre
            registros.
          </section>
        ) : null}

        <section
          aria-labelledby="indicators-title"
          className="mt-10"
        >
          <h2
            className="text-xl font-semibold text-white"
            id="indicators-title"
          >
            Indicadores
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="min-w-0 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                Peso atual
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatKg(currentWeightKg)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {currentWeighing
                  ? formatCivilDatePtBr(currentWeighing.date)
                  : "Sem pesagens"}
              </p>
            </article>
            <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Peso inicial
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatKg(profile.initialWeightKg)}
              </p>
            </article>
            <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total perdido
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatTotalLost(totalLost)}
              </p>
            </article>
            <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Menor peso
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatKg(lowestWeight)}
              </p>
            </article>
            <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                IMC atual
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {bmi === null ? "—" : formatDecimal(bmi, 2)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {bmiClassification?.label ?? "Aguardando pesagem"}
              </p>
            </article>
            <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Média móvel de 7 dias
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatKg(movingAverage)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Janela encerrada na pesagem mais recente
              </p>
            </article>
            <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Referência de IMC
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Classificação geral de IMC adulto da OMS, apresentada como
                referência não médica.
              </p>
            </article>
          </div>
        </section>

        <section
          aria-labelledby="evolution-title"
          className="mt-10 min-w-0"
        >
          <div className="mb-4">
            <h2
              className="text-xl font-semibold text-white"
              id="evolution-title"
            >
              Evolução do peso
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Peso registrado e média móvel calculada em cada data de
              pesagem.
            </p>
          </div>
          <WeightEvolutionChart weighings={weighings} />
        </section>

        <section
          aria-labelledby="goal-title"
          className="mt-10 min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                Meta ativa
              </p>
              <h2
                className="mt-2 text-2xl font-semibold text-white"
                id="goal-title"
              >
                {activeGoal
                  ? formatKg(activeGoal.targetWeightKg)
                  : "Sem meta ativa"}
              </h2>
            </div>
            {activeGoal ? (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <dt className="text-slate-500">Falta</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {formatKg(weightRemaining)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Progresso</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {goalProgress === null
                      ? "—"
                      : `${formatDecimal(goalProgress)}%`}
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>
          {activeGoal && goalProgress !== null ? (
            <div
              aria-label={`${formatDecimal(goalProgress)}% da meta`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={goalProgress}
              className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          ) : null}
          <div className="mt-6 border-t border-white/10 pt-5">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
              href="/metas"
            >
              Gerenciar metas
            </Link>
          </div>
        </section>

        <section aria-labelledby="recent-title" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2
              className="text-xl font-semibold text-white"
              id="recent-title"
            >
              Últimas pesagens
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-4">
              <span className="text-xs text-slate-500">
                Até 5 registros recentes
              </span>
              <Link
                className="text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                href="/historico"
              >
                Ver histórico completo
              </Link>
            </div>
          </div>

          {recentWeighings.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {recentWeighings.map((weighing) => (
                <article
                  className="grid min-w-0 gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  key={weighing.id}
                >
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-lg font-semibold text-white">
                        {formatKg(weighing.weightKg)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatCivilDatePtBr(weighing.date)}
                      </p>
                    </div>
                    {weighing.waistCm !== null || weighing.notes ? (
                      <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                        {weighing.waistCm !== null
                          ? `Cintura: ${formatDecimal(weighing.waistCm)} cm`
                          : null}
                        {weighing.waistCm !== null && weighing.notes
                          ? " · "
                          : null}
                        {weighing.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-start justify-end gap-4">
                    <Link
                      className="text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                      href={`/pesagens/${weighing.id}/editar`}
                    >
                      Editar
                    </Link>
                    <DeleteWeighInForm weighInId={weighing.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-sm leading-6 text-slate-400">
              Nenhuma pesagem registrada.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
