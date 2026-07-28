import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import { HistoryFilters } from "@/components/history/history-filters";
import { DeleteWeighInForm } from "@/components/weigh-ins/delete-weigh-in-form";
import { getProfile, listWeighIns } from "@/data";
import {
  formatCivilDatePtBr,
  formatLocalCivilDate,
} from "@/domain";
import {
  buildHistoryRows,
  resolveHistoryFilter,
  type HistoryRow,
} from "@/history/history";

export const metadata: Metadata = {
  title: "Histórico de pesagens",
};

type HistorySearchParams = Promise<{
  from?: string | string[];
  period?: string | string[];
  to?: string | string[];
}>;

function singleValue(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function formatDecimal(
  value: number,
  maximumFractionDigits = 1,
): string {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

function formatKg(value: number | null): string {
  return value === null ? "—" : `${formatDecimal(value)} kg`;
}

function formatVariation(value: number | null): string {
  if (value === null) {
    return "—";
  }

  if (value > 0) {
    return `+${formatDecimal(value)} kg`;
  }

  return `${formatDecimal(value)} kg`;
}

function HistoryActions({ row }: { row: HistoryRow }) {
  return (
    <div className="flex items-start justify-end gap-2">
      <Link
        className="inline-flex min-h-11 items-center rounded-lg px-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-300/10 hover:text-emerald-200"
        href={`/pesagens/${row.weighing.id}/editar?retorno=historico`}
      >
        Editar
      </Link>
      <DeleteWeighInForm
        returnTo="/historico"
        weighInId={row.weighing.id}
      />
    </div>
  );
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: HistorySearchParams;
}) {
  const { client, user } = await requireCompletedProfile();
  const query = await searchParams;
  const today = formatLocalCivilDate(new Date());
  const filter = resolveHistoryFilter(
    {
      period: singleValue(query.period),
      from: singleValue(query.from),
      to: singleValue(query.to),
    },
    today,
  );
  const [profile, weighings] = await Promise.all([
    getProfile(client, user.id),
    listWeighIns(client, user.id),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  const rows = buildHistoryRows(weighings, {
    filter,
    heightCm: profile.heightCm,
    initialWeightKg: profile.initialWeightKg,
  });
  const hasAnyWeighing = weighings.length > 0;

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Evolução
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              Histórico de pesagens
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Consulte cada registro com indicadores calculados a partir do
              seu perfil e da sequência cronológica completa.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            href="/pesagens/nova"
          >
            Registrar pesagem
          </Link>
        </div>

        <section
          aria-labelledby="filter-title"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"
        >
          <h2
            className="mb-5 text-lg font-semibold text-white"
            id="filter-title"
          >
            Filtrar histórico
          </h2>
          <HistoryFilters
            initialFrom={filter.from}
            initialPeriod={filter.period}
            initialTo={filter.to}
            today={today}
          />
        </section>

        {filter.message ? (
          <p
            aria-live="polite"
            className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100"
            role="alert"
          >
            {filter.message}
          </p>
        ) : null}

        <section aria-labelledby="results-title" className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              className="text-xl font-semibold text-white"
              id="results-title"
            >
              Pesagens
            </h2>
            <p className="text-sm text-slate-500">
              {rows.length} {rows.length === 1 ? "registro" : "registros"}
            </p>
          </div>

          {rows.length > 0 ? (
            <>
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
                <table className="w-full min-w-[74rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Histórico de pesagens com indicadores e ações por registro
                  </caption>
                  <thead className="bg-white/[0.045] text-xs uppercase tracking-[0.1em] text-slate-500">
                    <tr>
                      <th className="px-4 py-4 font-semibold" scope="col">Data</th>
                      <th className="px-4 py-4 font-semibold" scope="col">Peso</th>
                      <th className="px-4 py-4 font-semibold" scope="col">IMC</th>
                      <th className="px-4 py-4 font-semibold" scope="col">Variação</th>
                      <th className="px-4 py-4 font-semibold" scope="col">
                        Total perdido
                      </th>
                      <th className="px-4 py-4 font-semibold" scope="col">Cintura</th>
                      <th className="px-4 py-4 font-semibold" scope="col">
                        Observações
                      </th>
                      <th className="px-4 py-4 text-right font-semibold" scope="col">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {rows.map((row) => (
                      <tr
                        className="bg-slate-950/20 align-top transition hover:bg-white/[0.025]"
                        key={row.weighing.id}
                      >
                        <td className="whitespace-nowrap px-4 py-5 font-medium text-white">
                          {formatCivilDatePtBr(row.weighing.date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 font-semibold text-white">
                          {formatKg(row.weighing.weightKg)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 text-slate-300">
                          {row.bmi === null
                            ? "—"
                            : formatDecimal(row.bmi, 2)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 text-slate-300">
                          {formatVariation(row.variationKg)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 text-slate-300">
                          {formatKg(row.totalLostKg)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 text-slate-300">
                          {row.weighing.waistCm === null
                            ? "—"
                            : `${formatDecimal(row.weighing.waistCm)} cm`}
                        </td>
                        <td className="max-w-72 break-words px-4 py-5 leading-6 text-slate-400">
                          {row.weighing.notes ?? "—"}
                        </td>
                        <td className="px-4 py-5">
                          <HistoryActions row={row} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid gap-4 md:hidden">
                {rows.map((row) => (
                  <article
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                    key={row.weighing.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          {formatCivilDatePtBr(row.weighing.date)}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-white">
                          {formatKg(row.weighing.weightKg)}
                        </p>
                      </div>
                      <HistoryActions row={row} />
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
                      <div>
                        <dt className="text-slate-500">IMC</dt>
                        <dd className="mt-1 font-medium text-slate-200">
                          {row.bmi === null
                            ? "—"
                            : formatDecimal(row.bmi, 2)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Variação</dt>
                        <dd className="mt-1 font-medium text-slate-200">
                          {formatVariation(row.variationKg)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Total perdido</dt>
                        <dd className="mt-1 font-medium text-slate-200">
                          {formatKg(row.totalLostKg)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Cintura</dt>
                        <dd className="mt-1 font-medium text-slate-200">
                          {row.weighing.waistCm === null
                            ? "—"
                            : `${formatDecimal(row.weighing.waistCm)} cm`}
                        </dd>
                      </div>
                    </dl>

                    {row.weighing.notes ? (
                      <div className="mt-5 border-t border-white/10 pt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Observações
                        </p>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                          {row.weighing.notes}
                        </p>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">
                {hasAnyWeighing
                  ? "Nenhuma pesagem encontrada nesse período"
                  : "Nenhuma pesagem registrada"}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {hasAnyWeighing
                  ? "Altere o filtro para consultar outros registros."
                  : "Registre sua primeira pesagem para iniciar o histórico."}
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/10"
                href={
                  hasAnyWeighing
                    ? "/historico?period=all"
                    : "/pesagens/nova"
                }
              >
                {hasAnyWeighing
                  ? "Ver todo o histórico"
                  : "Registrar pesagem"}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
