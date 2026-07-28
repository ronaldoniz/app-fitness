import { describe, expect, it } from "vitest";

import { validateOnboardingInput } from "./validation";

describe("onboarding validation", () => {
  it("normalizes the confirmed name and decimal values", () => {
    expect(
      validateOnboardingInput({
        email: "ana@example.com",
        name: "  Ana  ",
        heightCm: "165,5",
        initialWeightKg: "80,4",
        targetWeightKg: "70",
      }),
    ).toEqual({
      valid: true,
      value: {
        name: "Ana",
        heightCm: 165.5,
        initialWeightKg: 80.4,
        targetWeightKg: 70,
      },
    });
  });

  it("rejects a first target that is not below the initial weight", () => {
    const result = validateOnboardingInput({
      email: "ana@example.com",
      name: "Ana",
      heightCm: "165",
      initialWeightKg: "80",
      targetWeightKg: "80",
    });

    expect(result).toEqual({
      valid: false,
      message: "O peso-alvo deve ser menor que o peso de referência.",
    });
  });

  it("rejects missing or non-positive profile values", () => {
    expect(
      validateOnboardingInput({
        email: "ana@example.com",
        name: "",
        heightCm: "0",
        initialWeightKg: "-1",
        targetWeightKg: "0",
      }).valid,
    ).toBe(false);
  });
});
