import { describe, expect, it } from "vitest";

import {
  hasConfirmedAccountDeletion,
  validateProfileSettingsInput,
} from "./validation";

describe("validação das configurações", () => {
  it("normaliza nome e números decimais sem alterar o tema escolhido", () => {
    expect(
      validateProfileSettingsInput({
        email: "ana@example.com",
        name: "  Ana Silva  ",
        heightCm: "165,5",
        initialWeightKg: "80,4",
        themePreference: "system",
      }),
    ).toEqual({
      valid: true,
      value: {
        name: "Ana Silva",
        heightCm: 165.5,
        initialWeightKg: 80.4,
        themePreference: "system",
      },
    });
  });

  it.each(["dark", "light", "system"])(
    "aceita a preferência de tema %s",
    (themePreference) => {
      expect(
        validateProfileSettingsInput({
          email: "ana@example.com",
          name: "Ana",
          heightCm: "165",
          initialWeightKg: "80",
          themePreference,
        }).valid,
      ).toBe(true);
    },
  );

  it("rejeita tema desconhecido e valores de perfil inválidos", () => {
    expect(
      validateProfileSettingsInput({
        email: "ana@example.com",
        name: "Ana",
        heightCm: "165",
        initialWeightKg: "80",
        themePreference: "automatic",
      }),
    ).toEqual({
      valid: false,
      message: "Selecione uma preferência de tema válida.",
    });

    expect(
      validateProfileSettingsInput({
        email: "ana@example.com",
        name: "",
        heightCm: "0",
        initialWeightKg: "-1",
        themePreference: "dark",
      }).valid,
    ).toBe(false);
  });

  it("exige a confirmação literal para excluir a conta", () => {
    expect(hasConfirmedAccountDeletion("EXCLUIR")).toBe(true);
    expect(hasConfirmedAccountDeletion("  EXCLUIR  ")).toBe(true);
    expect(hasConfirmedAccountDeletion("excluir")).toBe(false);
    expect(hasConfirmedAccountDeletion("")).toBe(false);
  });
});
