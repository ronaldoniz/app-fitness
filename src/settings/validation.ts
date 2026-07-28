import { validateProfileInput } from "../domain/validation";
import type { ThemePreference } from "../domain/types";

const THEME_PREFERENCES = new Set<ThemePreference>([
  "dark",
  "light",
  "system",
]);

type SettingsValidationResult =
  | {
      valid: true;
      value: {
        heightCm: number;
        initialWeightKg: number;
        name: string;
        themePreference: ThemePreference;
      };
    }
  | {
      valid: false;
      message: string;
    };

function parseDecimal(value: string): number {
  return Number(value.trim().replace(",", "."));
}

export function validateProfileSettingsInput(input: {
  email: string;
  heightCm: string;
  initialWeightKg: string;
  name: string;
  themePreference: string;
}): SettingsValidationResult {
  if (!THEME_PREFERENCES.has(input.themePreference as ThemePreference)) {
    return {
      valid: false,
      message: "Selecione uma preferência de tema válida.",
    };
  }

  const themePreference = input.themePreference as ThemePreference;
  const profileResult = validateProfileInput({
    name: input.name,
    email: input.email,
    heightCm: parseDecimal(input.heightCm),
    initialWeightKg: parseDecimal(input.initialWeightKg),
    themePreference,
  });

  if (!profileResult.valid) {
    return {
      valid: false,
      message:
        profileResult.issues[0]?.message ??
        "Revise os dados das configurações.",
    };
  }

  return {
    valid: true,
    value: {
      name: profileResult.value.name,
      heightCm: profileResult.value.heightCm,
      initialWeightKg: profileResult.value.initialWeightKg,
      themePreference,
    },
  };
}

export function hasConfirmedAccountDeletion(value: string): boolean {
  return value.trim() === "EXCLUIR";
}
