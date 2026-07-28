import { describe, expect, it } from "vitest";
import type { CivilDate, Goal, Weighing } from "./types";
import {
  calculateBmi,
  calculateGoalProgressPercent,
  calculateLowestWeightKg,
  calculateSevenDayMovingAverageKg,
  calculateSevenDayMovingAverageSeriesKg,
  calculateTotalWeightLostKg,
  calculateWeightRemainingKg,
  calculateWeightVariationKg,
  classifyAdultBmi,
  evaluateGoalCompletion,
  getCurrentWeighing,
} from "./calculations";

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
    createdAt: "2026-07-26T12:00:00.000Z",
    updatedAt: "2026-07-26T12:00:00.000Z",
  };
}

function goal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "goal-1",
    userId: "user-1",
    targetWeightKg: 80,
    displayOrder: 0,
    isActive: true,
    completedOn: null,
    createdAt: "2026-07-26T12:00:00.000Z",
    updatedAt: "2026-07-26T12:00:00.000Z",
    ...overrides,
  };
}

describe("IMC adulto", () => {
  it("calcula o IMC a partir de quilogramas e centímetros", () => {
    expect(calculateBmi(80, 180)).toBeCloseTo(24.691, 3);
    expect(calculateBmi(0, 180)).toBeNull();
  });

  it.each([
    [18.49, "underweight"],
    [18.5, "adequate"],
    [25, "overweight"],
    [30, "obesity-1"],
    [35, "obesity-2"],
    [40, "obesity-3"],
  ])("classifica %s na faixa %s", (bmi, expectedCode) => {
    expect(classifyAdultBmi(bmi)?.code).toBe(expectedCode);
  });
});

describe("indicadores de peso", () => {
  const weighings = [
    weighing("2", "2026-07-20", 88),
    weighing("1", "2026-07-10", 90),
    weighing("3", "2026-07-26", 86),
  ];

  it("encontra peso atual e menor peso sem alterar a coleção", () => {
    expect(getCurrentWeighing(weighings)?.id).toBe("3");
    expect(calculateLowestWeightKg(weighings)).toBe(86);
    expect(weighings.map(({ id }) => id)).toEqual(["2", "1", "3"]);
  });

  it("calcula total perdido e variação com sinal", () => {
    expect(calculateTotalWeightLostKg(100, 92.5)).toBe(7.5);
    expect(calculateWeightVariationKg(92.5, 93)).toBe(-0.5);
  });

  it("usa uma janela de sete datas civis encerrada na pesagem mais recente", () => {
    const values = [
      weighing("1", "2026-07-10", 100),
      weighing("2", "2026-07-11", 90),
      weighing("3", "2026-07-16", 84),
      weighing("4", "2026-07-17", 81),
    ];

    expect(calculateSevenDayMovingAverageKg(values)).toBe(85);
  });

  it("calcula cada ponto da média pelos sete dias civis de referência", () => {
    const values = [
      weighing("4", "2026-07-17", 81),
      weighing("1", "2026-07-10", 100),
      weighing("3", "2026-07-16", 84),
      weighing("2", "2026-07-11", 90),
    ];

    const series = calculateSevenDayMovingAverageSeriesKg(values);

    expect(
      series.map(({ date, averageWeightKg, sampleSize }) => ({
        date,
        averageWeightKg,
        sampleSize,
      })),
    ).toEqual([
      {
        date: "2026-07-10",
        averageWeightKg: 100,
        sampleSize: 1,
      },
      {
        date: "2026-07-11",
        averageWeightKg: 95,
        sampleSize: 2,
      },
      {
        date: "2026-07-16",
        averageWeightKg: 274 / 3,
        sampleSize: 3,
      },
      {
        date: "2026-07-17",
        averageWeightKg: 85,
        sampleSize: 3,
      },
    ]);
    expect(values.map(({ id }) => id)).toEqual(["4", "1", "3", "2"]);
  });

  it("não confunde sete dias civis com as últimas sete pesagens", () => {
    const values = [
      weighing("1", "2026-01-01", 100),
      weighing("2", "2026-02-01", 98),
      weighing("3", "2026-03-01", 96),
      weighing("4", "2026-04-01", 94),
      weighing("5", "2026-05-01", 92),
      weighing("6", "2026-06-01", 90),
      weighing("7", "2026-07-01", 88),
      weighing("8", "2026-07-20", 86),
    ];

    expect(calculateSevenDayMovingAverageKg(values)).toBe(86);
  });

  it("retorna ausência quando não há dados válidos", () => {
    expect(calculateSevenDayMovingAverageKg([])).toBeNull();
    expect(calculateLowestWeightKg([])).toBeNull();
  });
});

describe("metas", () => {
  it("calcula e limita o progresso entre zero e cem", () => {
    expect(calculateGoalProgressPercent(100, 90, 80)).toBe(50);
    expect(calculateGoalProgressPercent(100, 105, 80)).toBe(0);
    expect(calculateGoalProgressPercent(100, 75, 80)).toBe(100);
    expect(calculateGoalProgressPercent(100, 90, 100)).toBeNull();
  });

  it("calcula quanto falta sem produzir valor negativo", () => {
    expect(calculateWeightRemainingKg(90, 80)).toBe(10);
    expect(calculateWeightRemainingKg(78, 80)).toBe(0);
  });

  it("conclui uma meta ativa com a data civil da pesagem mais recente", () => {
    const result = evaluateGoalCompletion(goal(), [
      weighing("mais-antiga", "2026-07-20", 70),
      weighing("1", "2026-07-26", 79.9),
    ]);

    expect(result).toMatchObject({
      isActive: false,
      completedOn: "2026-07-26",
    });
  });

  it("ignora peso antigo abaixo do alvo quando o peso atual ainda não atingiu", () => {
    expect(
      evaluateGoalCompletion(goal(), [
        weighing("antiga", "2026-07-20", 79),
        weighing("atual", "2026-07-26", 80.1),
      ]),
    ).toEqual(goal());
  });

  it("reavalia o histórico resultante de criação, edição ou exclusão", () => {
    const currentHistory = [
      weighing("antiga", "2026-07-20", 79),
      weighing("atual", "2026-07-26", 81),
    ];
    const historyAfterEdit = [
      weighing("antiga", "2026-07-20", 79),
      weighing("atual", "2026-07-26", 79.5),
    ];
    const historyAfterDelete = [
      weighing("antiga", "2026-07-20", 79),
    ];

    expect(evaluateGoalCompletion(goal(), currentHistory)).toEqual(goal());
    expect(
      evaluateGoalCompletion(goal(), historyAfterEdit).completedOn,
    ).toBe("2026-07-26");
    expect(
      evaluateGoalCompletion(goal(), historyAfterDelete).completedOn,
    ).toBe("2026-07-20");
  });

  it("não conclui meta inativa, já concluída, sem pesagens ou não atingida", () => {
    const currentWeighing = weighing("1", "2026-07-26", 79);

    expect(
      evaluateGoalCompletion(goal({ isActive: false }), [currentWeighing]),
    ).toEqual(goal({ isActive: false }));
    expect(
      evaluateGoalCompletion(
        goal({ isActive: false, completedOn: "2026-07-20" }),
        [currentWeighing],
      ),
    ).toEqual(goal({ isActive: false, completedOn: "2026-07-20" }));
    expect(evaluateGoalCompletion(goal(), [])).toEqual(goal());
    expect(
      evaluateGoalCompletion(goal(), [
        weighing("2", "2026-07-26", 80.1),
      ]),
    ).toEqual(goal());
  });
});
