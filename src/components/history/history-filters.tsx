"use client";

import Link from "next/link";
import { useState } from "react";

import type { CivilDate } from "@/domain";
import type { HistoryPeriod } from "@/history/history";

export function HistoryFilters({
  initialFrom,
  initialPeriod,
  initialTo,
  today,
}: {
  initialFrom: CivilDate | null;
  initialPeriod: HistoryPeriod;
  initialTo: CivilDate | null;
  today: CivilDate;
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const isCustom = period === "custom";

  return (
    <form
      action="/historico"
      className="grid gap-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_auto_auto] lg:items-end"
      method="get"
    >
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Período
        <select
          className="form-input"
          name="period"
          onChange={(event) =>
            setPeriod(event.target.value as HistoryPeriod)
          }
          value={period}
        >
          <option value="30-days">30 dias</option>
          <option value="90-days">90 dias</option>
          <option value="last-year">Último ano</option>
          <option value="custom">Período personalizado</option>
          <option value="all">Todo o histórico</option>
        </select>
      </label>

      {isCustom ? (
        <>
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Data inicial
            <input
              className="form-input"
              defaultValue={initialFrom ?? ""}
              max={today}
              name="from"
              required
              type="date"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Data final
            <input
              className="form-input"
              defaultValue={initialTo ?? ""}
              max={today}
              name="to"
              required
              type="date"
            />
          </label>
        </>
      ) : (
        <div className="hidden lg:block lg:col-span-2" />
      )}

      <button
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
        type="submit"
      >
        Aplicar filtro
      </button>
      <Link
        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
        href="/historico?period=30-days"
      >
        Limpar
      </Link>
    </form>
  );
}
