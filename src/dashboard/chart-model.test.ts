import { describe, expect, it } from "vitest";

import type { CivilDate, Weighing } from "../domain/types";
import { buildWeightChartModel } from "./chart-model";

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
    createdAt: "2026-07-27T12:00:00.000Z",
    updatedAt: "2026-07-27T12:00:00.000Z",
  };
}

describe("modelo do gráfico de evolução", () => {
  it("representa corretamente os estados vazio, único e histórico", () => {
    expect(buildWeightChartModel([]).state).toBe("empty");
    expect(
      buildWeightChartModel([
        weighing("1", "2026-07-27", 80),
      ]).state,
    ).toBe("single");
    expect(
      buildWeightChartModel([
        weighing("1", "2026-07-26", 81),
        weighing("2", "2026-07-27", 80),
      ]).state,
    ).toBe("history");
  });

  it("ordena pelas datas civis sem alterar a entrada", () => {
    const values = [
      weighing("3", "2026-07-27", 80),
      weighing("1", "2026-07-10", 84),
      weighing("2", "2026-07-26", 81),
    ];

    const model = buildWeightChartModel(values);

    expect(model.points.map(({ weighingId }) => weighingId)).toEqual([
      "1",
      "2",
      "3",
    ]);
    expect(model.lowestWeightKg).toBe(80);
    expect(model.variationKg).toBe(-4);
    expect(values.map(({ id }) => id)).toEqual(["3", "1", "2"]);
  });

  it("leva ao gráfico a média da janela de sete dias civis de cada ponto", () => {
    const model = buildWeightChartModel([
      weighing("1", "2026-07-01", 90),
      weighing("2", "2026-07-20", 84),
      weighing("3", "2026-07-26", 82),
      weighing("4", "2026-07-27", 81),
    ]);

    expect(
      model.points.map(
        ({ date, movingAverageKg, movingAverageSampleSize }) => ({
          date,
          movingAverageKg,
          movingAverageSampleSize,
        }),
      ),
    ).toEqual([
      {
        date: "2026-07-01",
        movingAverageKg: 90,
        movingAverageSampleSize: 1,
      },
      {
        date: "2026-07-20",
        movingAverageKg: 84,
        movingAverageSampleSize: 1,
      },
      {
        date: "2026-07-26",
        movingAverageKg: 83,
        movingAverageSampleSize: 2,
      },
      {
        date: "2026-07-27",
        movingAverageKg: 81.5,
        movingAverageSampleSize: 2,
      },
    ]);
  });
});
