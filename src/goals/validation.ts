import {
  type GoalInput,
  validateGoalInput,
} from "../domain";

type GoalFormValidationResult =
  | {
      valid: true;
      value: GoalInput;
    }
  | {
      valid: false;
      message: string;
    };

export function validateGoalFormInput(
  input: {
    targetWeightKg: string;
  },
  context: {
    displayOrder: number;
    referenceWeightKg: number;
  },
): GoalFormValidationResult {
  const result = validateGoalInput(
    {
      targetWeightKg: Number(
        input.targetWeightKg.trim().replace(",", "."),
      ),
      displayOrder: context.displayOrder,
      isActive: false,
    },
    context.referenceWeightKg,
  );

  if (!result.valid) {
    return {
      valid: false,
      message:
        result.issues[0]?.message ?? "Revise os dados da meta.",
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function isGoalId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
