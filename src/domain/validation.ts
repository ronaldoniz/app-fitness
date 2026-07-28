import {
  civilDateToEpochDay,
  isCivilDate,
} from "./civil-date";
import type {
  Goal,
  GoalInput,
  ProfileInput,
  ValidationIssue,
  ValidationResult,
  Weighing,
  WeighingInput,
} from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function failure<T>(issues: ValidationIssue[]): ValidationResult<T> {
  return {
    valid: false,
    issues,
  };
}

function success<T>(value: T): ValidationResult<T> {
  return {
    valid: true,
    value,
    issues: [],
  };
}

function positiveNumberIssue(
  field: string,
  value: number,
  label: string,
): ValidationIssue | null {
  if (Number.isFinite(value) && value > 0) {
    return null;
  }

  return {
    field,
    code: "must_be_positive",
    message: `${label} deve ser maior que zero.`,
  };
}

export function validateProfileInput(
  input: ProfileInput,
): ValidationResult<ProfileInput> {
  const issues: ValidationIssue[] = [];
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) {
    issues.push({
      field: "name",
      code: "required",
      message: "Informe o nome.",
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    issues.push({
      field: "email",
      code: "invalid_format",
      message: "Informe um e-mail válido.",
    });
  }

  const heightIssue = positiveNumberIssue(
    "heightCm",
    input.heightCm,
    "A altura",
  );
  const initialWeightIssue = positiveNumberIssue(
    "initialWeightKg",
    input.initialWeightKg,
    "O peso inicial",
  );

  if (heightIssue) {
    issues.push(heightIssue);
  }

  if (initialWeightIssue) {
    issues.push(initialWeightIssue);
  }

  if (issues.length > 0) {
    return failure(issues);
  }

  return success({
    ...input,
    name,
    email,
  });
}

interface WeighingValidationContext {
  today: string;
  existingWeighings?: readonly Weighing[];
  editingId?: string;
}

export function validateWeighingInput(
  input: WeighingInput,
  context: WeighingValidationContext,
): ValidationResult<WeighingInput> {
  const issues: ValidationIssue[] = [];

  if (!isCivilDate(input.date)) {
    issues.push({
      field: "date",
      code: "invalid_format",
      message: "Informe uma data válida.",
    });
  } else {
    const inputDay = civilDateToEpochDay(input.date);
    const todayDay = civilDateToEpochDay(context.today);

    if (inputDay !== null && todayDay !== null && inputDay > todayDay) {
      issues.push({
        field: "date",
        code: "future_date",
        message: "A data da pesagem não pode estar no futuro.",
      });
    }

    const duplicate = context.existingWeighings?.some(
      (weighing) =>
        weighing.date === input.date && weighing.id !== context.editingId,
    );

    if (duplicate) {
      issues.push({
        field: "date",
        code: "duplicate_date",
        message: "Já existe uma pesagem nessa data.",
      });
    }
  }

  const weightIssue = positiveNumberIssue(
    "weightKg",
    input.weightKg,
    "O peso",
  );

  if (weightIssue) {
    issues.push(weightIssue);
  }

  if (input.waistCm !== undefined && input.waistCm !== null) {
    const waistIssue = positiveNumberIssue(
      "waistCm",
      input.waistCm,
      "A circunferência da cintura",
    );

    if (waistIssue) {
      issues.push(waistIssue);
    }
  }

  if (issues.length > 0) {
    return failure(issues);
  }

  const notes = input.notes?.trim() || null;

  return success({
    ...input,
    waistCm: input.waistCm ?? null,
    notes,
  });
}

export function validateGoalInput(
  input: GoalInput,
  referenceWeightKg: number,
): ValidationResult<GoalInput> {
  const issues: ValidationIssue[] = [];
  const targetIssue = positiveNumberIssue(
    "targetWeightKg",
    input.targetWeightKg,
    "O peso-alvo",
  );

  if (targetIssue) {
    issues.push(targetIssue);
  } else if (
    !Number.isFinite(referenceWeightKg) ||
    referenceWeightKg <= 0 ||
    input.targetWeightKg >= referenceWeightKg
  ) {
    issues.push({
      field: "targetWeightKg",
      code: "target_must_be_lower",
      message: "O peso-alvo deve ser menor que o peso de referência.",
    });
  }

  if (!Number.isInteger(input.displayOrder) || input.displayOrder < 0) {
    issues.push({
      field: "displayOrder",
      code: "invalid_order",
      message: "A ordem da meta deve ser um número inteiro não negativo.",
    });
  }

  return issues.length > 0 ? failure(issues) : success(input);
}

export function validateSingleActiveGoal(
  goals: readonly Goal[],
): ValidationResult<readonly Goal[]> {
  const activeGoals = goals.filter(({ isActive }) => isActive);

  if (activeGoals.length <= 1) {
    return success(goals);
  }

  return failure([
    {
      field: "isActive",
      code: "multiple_active_goals",
      message: "Apenas uma meta pode estar ativa.",
    },
  ]);
}

export function validateGoalCanBeChanged(
  goal: Goal,
): ValidationResult<Goal> {
  if (goal.completedOn === null) {
    return success(goal);
  }

  return failure([
    {
      field: "goal",
      code: "completed_goal_read_only",
      message: "Uma meta concluída não pode ser editada nem reativada.",
    },
  ]);
}

export function validateGoalCanBeActivated(
  goal: Goal,
): ValidationResult<Goal> {
  return validateGoalCanBeChanged(goal);
}
