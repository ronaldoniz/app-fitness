import { describe, expect, it } from "vitest";

import type {
  CivilDate,
  Goal,
  Profile,
  Weighing,
} from "@/domain";

import {
  getGoalReferenceWeightKg,
  groupGoals,
  nextGoalDisplayOrder,
} from "./goals";

function goal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "goal-1",
    userId: "user-1",
    targetWeightKg: 80,
    displayOrder: 0,
    isActive: false,
    completedOn: null,
    createdAt: "2026-07-20T12:00:00.000Z",
    updatedAt: "2026-07-20T12:00:00.000Z",
    ...overrides,
  };
}

function weighing(date: CivilDate, weightKg: number): Weighing {
  return {
    id: date,
    userId: "user-1",
    date,
    weightKg,
    waistCm: null,
    notes: null,
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T12:00:00.000Z`,
  };
}

const profile: Profile = {
  id: "profile-1",
  userId: "user-1",
  name: "Ana",
  email: "ana@example.com",
  heightCm: 165,
  initialWeightKg: 90,
  themePreference: "dark",
  createdAt: "2026-07-20T12:00:00.000Z",
  updatedAt: "2026-07-20T12:00:00.000Z",
};

describe("organização das metas", () => {
  it("separa meta ativa, pendentes e marcos concluídos", () => {
    const groups = groupGoals([
      goal({ id: "completed", completedOn: "2026-07-25" }),
      goal({ id: "pending", displayOrder: 2 }),
      goal({ id: "active", displayOrder: 1, isActive: true }),
    ]);

    expect(groups.active?.id).toBe("active");
    expect(groups.pending.map(({ id }) => id)).toEqual(["pending"]);
    expect(groups.completed.map(({ id }) => id)).toEqual(["completed"]);
  });

  it("posiciona novas metas depois da maior ordem existente", () => {
    expect(
      nextGoalDisplayOrder([
        goal({ displayOrder: 2 }),
        goal({ displayOrder: 7 }),
      ]),
    ).toBe(8);
    expect(nextGoalDisplayOrder([])).toBe(0);
  });
});

describe("peso de referência da meta", () => {
  it("usa a pesagem cronologicamente mais recente", () => {
    expect(
      getGoalReferenceWeightKg(profile, [
        weighing("2026-07-26", 84),
        weighing("2026-07-20", 82),
      ]),
    ).toBe(84);
  });

  it("usa o peso inicial quando ainda não há pesagens", () => {
    expect(getGoalReferenceWeightKg(profile, [])).toBe(90);
  });
});
