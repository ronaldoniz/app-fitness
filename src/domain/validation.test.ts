import { describe, expect, it } from "vitest";
import type {
  CivilDate,
  Goal,
  ProfileInput,
  Weighing,
} from "./types";
import {
  validateGoalCanBeActivated,
  validateGoalCanBeChanged,
  validateGoalInput,
  validateProfileInput,
  validateSingleActiveGoal,
  validateWeighingInput,
} from "./validation";

function weighing(id: string, date: CivilDate): Weighing {
  return {
    id,
    userId: "user-1",
    date,
    weightKg: 90,
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
    isActive: false,
    completedOn: null,
    createdAt: "2026-07-26T12:00:00.000Z",
    updatedAt: "2026-07-26T12:00:00.000Z",
    ...overrides,
  };
}

describe("validação de perfil", () => {
  it("normaliza dados válidos", () => {
    const input: ProfileInput = {
      name: "  Ana  ",
      email: " ANA@EXAMPLE.COM ",
      heightCm: 165,
      initialWeightKg: 90,
      themePreference: "dark",
    };
    const result = validateProfileInput(input);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.name).toBe("Ana");
      expect(result.value.email).toBe("ana@example.com");
    }
  });

  it("rejeita dados obrigatórios e valores não positivos", () => {
    const result = validateProfileInput({
      name: " ",
      email: "email-inválido",
      heightCm: 0,
      initialWeightKg: -1,
      themePreference: "dark",
    });

    expect(result.valid).toBe(false);
    expect(result.issues).toHaveLength(4);
  });
});

describe("validação de pesagem", () => {
  it("aceita campos opcionais ausentes sem interpretá-los como zero", () => {
    const result = validateWeighingInput(
      {
        date: "2026-07-26",
        weightKg: 89.4,
      },
      { today: "2026-07-26" },
    );

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.waistCm).toBeNull();
      expect(result.value.notes).toBeNull();
    }
  });

  it("rejeita data futura, duplicidade e valores não positivos", () => {
    const future = validateWeighingInput(
      {
        date: "2026-07-27",
        weightKg: 0,
        waistCm: -10,
      },
      {
        today: "2026-07-26",
      },
    );
    const duplicate = validateWeighingInput(
      {
        date: "2026-07-26",
        weightKg: 90,
      },
      {
        today: "2026-07-26",
        existingWeighings: [weighing("existing", "2026-07-26")],
      },
    );

    expect(future.valid).toBe(false);
    expect(future.issues.map(({ code }) => code)).toEqual([
      "future_date",
      "must_be_positive",
      "must_be_positive",
    ]);
    expect(duplicate.valid).toBe(false);
    expect(duplicate.issues[0]?.code).toBe("duplicate_date");
  });

  it("permite manter a data da própria pesagem durante edição", () => {
    const result = validateWeighingInput(
      {
        date: "2026-07-26",
        weightKg: 89,
      },
      {
        today: "2026-07-26",
        editingId: "existing",
        existingWeighings: [weighing("existing", "2026-07-26")],
      },
    );

    expect(result.valid).toBe(true);
  });
});

describe("validação de metas", () => {
  it("exige alvo positivo e menor que o peso de referência", () => {
    expect(
      validateGoalInput(
        { targetWeightKg: 89, displayOrder: 0, isActive: true },
        90,
      ).valid,
    ).toBe(true);
    expect(
      validateGoalInput(
        { targetWeightKg: 90, displayOrder: 0, isActive: true },
        90,
      ).valid,
    ).toBe(false);
  });

  it("impede múltiplas metas ativas", () => {
    const result = validateSingleActiveGoal([
      goal({ id: "1", isActive: true }),
      goal({ id: "2", isActive: true }),
    ]);

    expect(result.valid).toBe(false);
    expect(result.issues[0]?.code).toBe("multiple_active_goals");
  });

  it("mantém metas concluídas somente para leitura", () => {
    const result = validateGoalCanBeChanged(
      goal({ completedOn: "2026-07-20" }),
    );

    expect(result.valid).toBe(false);
    expect(result.issues[0]?.code).toBe("completed_goal_read_only");
  });

  it("permite ativar uma meta não concluída sem revalidar seu alvo antigo", () => {
    expect(
      validateGoalCanBeActivated(
        goal({ targetWeightKg: 90, completedOn: null }),
      ).valid,
    ).toBe(true);
    expect(
      validateGoalCanBeActivated(
        goal({ completedOn: "2026-07-20" }),
      ).valid,
    ).toBe(false);
  });
});
