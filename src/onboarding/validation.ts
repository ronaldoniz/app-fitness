import {
  validateGoalInput,
  validateProfileInput,
} from "../domain";

type OnboardingValidationResult =
  | {
      valid: true;
      value: {
        heightCm: number;
        initialWeightKg: number;
        name: string;
        targetWeightKg: number;
      };
    }
  | { valid: false; message: string };

function parseDecimal(value: string): number {
  return Number(value.trim().replace(",", "."));
}

export function validateOnboardingInput(input: {
  email: string;
  heightCm: string;
  initialWeightKg: string;
  name: string;
  targetWeightKg: string;
}): OnboardingValidationResult {
  const heightCm = parseDecimal(input.heightCm);
  const initialWeightKg = parseDecimal(input.initialWeightKg);
  const targetWeightKg = parseDecimal(input.targetWeightKg);
  const profileResult = validateProfileInput({
    name: input.name,
    email: input.email,
    heightCm,
    initialWeightKg,
    themePreference: "dark",
  });

  if (!profileResult.valid) {
    return {
      valid: false,
      message: profileResult.issues[0]?.message ?? "Revise os dados do perfil.",
    };
  }

  const goalResult = validateGoalInput(
    {
      targetWeightKg,
      displayOrder: 0,
      isActive: true,
    },
    initialWeightKg,
  );

  if (!goalResult.valid) {
    return {
      valid: false,
      message: goalResult.issues[0]?.message ?? "Revise a primeira meta.",
    };
  }

  return {
    valid: true,
    value: {
      name: profileResult.value.name,
      heightCm,
      initialWeightKg,
      targetWeightKg,
    },
  };
}
