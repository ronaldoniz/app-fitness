import {
  type CivilDate,
  type Weighing,
  type WeighingInput,
  validateWeighingInput,
} from "../domain";

type WeighInFormValidationResult =
  | {
      valid: true;
      value: WeighingInput;
    }
  | {
      valid: false;
      message: string;
    };

function parseOptionalDecimal(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  return Number(value.trim().replace(",", "."));
}

export function validateWeighInFormInput(
  input: {
    date: string;
    notes: string;
    waistCm: string;
    weightKg: string;
  },
  context: {
    today: string;
    existingWeighings?: readonly Weighing[];
    editingId?: string;
  },
): WeighInFormValidationResult {
  const result = validateWeighingInput(
    {
      date: input.date as CivilDate,
      weightKg: Number(input.weightKg.trim().replace(",", ".")),
      waistCm: parseOptionalDecimal(input.waistCm),
      notes: input.notes,
    },
    context,
  );

  if (!result.valid) {
    return {
      valid: false,
      message:
        result.issues[0]?.message ?? "Revise os dados informados.",
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function isWeighInId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
