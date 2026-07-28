import { describe, expect, it } from "vitest";

import type { CivilDate, Weighing } from "@/domain";

import {
  buildHistoryRows,
  resolveHistoryFilter,
} from "./history";

function weighing(
  id: string,
  date: CivilDate,
  weightKg: number,
): Weighing {
  return {
    id,
    userId: "user-1",
    date,
    weightKg,
    waistCm: null,
    notes: null,
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T12:00:00.000Z`,
  };
}

describe("filtros do histórico", () => {
  const today = "2026-07-26" as const;

  it("calcula janelas inclusivas de 30 e 90 datas civis", () => {
    expect(resolveHistoryFilter({ period: "30-days" }, today)).toEqual({
      period: "30-days",
      from: "2026-06-27",
      to: "2026-07-26",
      message: null,
    });
    expect(resolveHistoryFilter({ period: "90-days" }, today).from).toBe(
      "2026-04-28",
    );
  });

  it("usa o mesmo dia civil do ano anterior para o último ano", () => {
    expect(resolveHistoryFilter({ period: "last-year" }, today).from).toBe(
      "2025-07-26",
    );
  });

  it("valida o período personalizado", () => {
    expect(
      resolveHistoryFilter(
        {
          period: "custom",
          from: "2026-07-20",
          to: "2026-07-10",
        },
        today,
      ).message,
    ).toBe("A data inicial não pode ser posterior à data final.");
    expect(
      resolveHistoryFilter({ period: "custom" }, today).message,
    ).toBe("Informe as datas inicial e final do período.");
  });
});

describe("linhas calculadas do histórico", () => {
  const weighings = [
    weighing("older", "2026-06-20", 90),
    weighing("newest", "2026-07-26", 87),
    weighing("middle", "2026-07-20", 88),
  ];

  it("ordena da mais recente e calcula os indicadores por registro", () => {
    const rows = buildHistoryRows(weighings, {
      filter: {
        period: "all",
        from: null,
        to: null,
        message: null,
      },
      heightCm: 180,
      initialWeightKg: 95,
    });

    expect(rows.map(({ weighing: item }) => item.id)).toEqual([
      "newest",
      "middle",
      "older",
    ]);
    expect(rows[0]).toMatchObject({
      variationKg: -1,
      totalLostKg: 8,
    });
    expect(rows[0]?.bmi).toBeCloseTo(26.85, 2);
    expect(rows[2]?.variationKg).toBeNull();
  });

  it("mantém a variação contra o registro anterior mesmo fora do filtro", () => {
    const rows = buildHistoryRows(weighings, {
      filter: {
        period: "custom",
        from: "2026-07-20",
        to: "2026-07-20",
        message: null,
      },
      heightCm: 180,
      initialWeightKg: 95,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.weighing.id).toBe("middle");
    expect(rows[0]?.variationKg).toBe(-2);
  });

  it("não retorna registros quando o filtro é inválido", () => {
    expect(
      buildHistoryRows(weighings, {
        filter: {
          period: "custom",
          from: null,
          to: null,
          message: "Período inválido.",
        },
        heightCm: 180,
        initialWeightKg: 95,
      }),
    ).toEqual([]);
  });
});
