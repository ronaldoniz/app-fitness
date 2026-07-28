import { describe, expect, it } from "vitest";

import {
  isGoalId,
  validateGoalFormInput,
} from "./validation";

describe("formulário de meta", () => {
  it("aceita alvo positivo e menor que o peso de referência", () => {
    expect(
      validateGoalFormInput(
        { targetWeightKg: "79,5" },
        { displayOrder: 2, referenceWeightKg: 80 },
      ),
    ).toEqual({
      valid: true,
      value: {
        targetWeightKg: 79.5,
        displayOrder: 2,
        isActive: false,
      },
    });
  });

  it("rejeita alvo não positivo ou igual ao peso de referência", () => {
    expect(
      validateGoalFormInput(
        { targetWeightKg: "0" },
        { displayOrder: 0, referenceWeightKg: 80 },
      ).valid,
    ).toBe(false);
    expect(
      validateGoalFormInput(
        { targetWeightKg: "80" },
        { displayOrder: 0, referenceWeightKg: 80 },
      ),
    ).toMatchObject({
      valid: false,
      message: "O peso-alvo deve ser menor que o peso de referência.",
    });
  });

  it("reconhece identificadores UUID completos", () => {
    expect(
      isGoalId("019f9c55-b97b-7503-af2d-c7148730a584"),
    ).toBe(true);
    expect(isGoalId("meta-1")).toBe(false);
  });
});
