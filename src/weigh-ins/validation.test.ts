import { describe, expect, it } from "vitest";

import type { Weighing } from "@/domain";

import {
  isWeighInId,
  validateWeighInFormInput,
} from "./validation";

const existingWeighing: Weighing = {
  id: "019f9c55-b97b-7503-af2d-c7148730a584",
  userId: "user-1",
  date: "2026-07-25",
  weightKg: 81.5,
  waistCm: null,
  notes: null,
  createdAt: "2026-07-25T12:00:00.000Z",
  updatedAt: "2026-07-25T12:00:00.000Z",
};

describe("formulário de pesagem", () => {
  it("normaliza decimais, observação e campo opcional vazio", () => {
    const result = validateWeighInFormInput(
      {
        date: "2026-07-26",
        weightKg: "80,4",
        waistCm: "",
        notes: "  Após o treino  ",
      },
      { today: "2026-07-26" },
    );

    expect(result).toEqual({
      valid: true,
      value: {
        date: "2026-07-26",
        weightKg: 80.4,
        waistCm: null,
        notes: "Após o treino",
      },
    });
  });

  it("aplica as regras de data e duplicidade também na entrada do formulário", () => {
    const duplicate = validateWeighInFormInput(
      {
        date: "2026-07-25",
        weightKg: "80",
        waistCm: "",
        notes: "",
      },
      {
        today: "2026-07-26",
        existingWeighings: [existingWeighing],
      },
    );
    const future = validateWeighInFormInput(
      {
        date: "2026-07-27",
        weightKg: "80",
        waistCm: "",
        notes: "",
      },
      { today: "2026-07-26" },
    );

    expect(duplicate).toMatchObject({
      valid: false,
      message: "Já existe uma pesagem nessa data.",
    });
    expect(future).toMatchObject({
      valid: false,
      message: "A data da pesagem não pode estar no futuro.",
    });
  });

  it("permite preservar a própria data durante edição", () => {
    expect(
      validateWeighInFormInput(
        {
          date: existingWeighing.date,
          weightKg: "79.9",
          waistCm: "",
          notes: "",
        },
        {
          today: "2026-07-26",
          existingWeighings: [existingWeighing],
          editingId: existingWeighing.id,
        },
      ).valid,
    ).toBe(true);
  });

  it("reconhece apenas identificadores UUID completos", () => {
    expect(isWeighInId(existingWeighing.id)).toBe(true);
    expect(isWeighInId("pesagem-1")).toBe(false);
  });
});
