export type EntityId = string;
export type IsoDateTime = string;
export type CivilDate = `${number}-${number}-${number}`;

export type ThemePreference = "dark" | "light" | "system";

export interface Profile {
  id: EntityId;
  userId: EntityId;
  name: string;
  email: string;
  heightCm: number;
  initialWeightKg: number;
  themePreference: ThemePreference;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface Weighing {
  id: EntityId;
  userId: EntityId;
  date: CivilDate;
  weightKg: number;
  waistCm: number | null;
  notes: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface Goal {
  id: EntityId;
  userId: EntityId;
  targetWeightKg: number;
  displayOrder: number;
  isActive: boolean;
  completedOn: CivilDate | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ProfileInput {
  name: string;
  email: string;
  heightCm: number;
  initialWeightKg: number;
  themePreference: ThemePreference;
}

export interface WeighingInput {
  date: CivilDate;
  weightKg: number;
  waistCm?: number | null;
  notes?: string | null;
}

export interface GoalInput {
  targetWeightKg: number;
  displayOrder: number;
  isActive: boolean;
}

export type BmiClassificationCode =
  | "underweight"
  | "adequate"
  | "overweight"
  | "obesity-1"
  | "obesity-2"
  | "obesity-3";

export interface BmiClassification {
  code: BmiClassificationCode;
  label: string;
}

export type ValidationIssueCode =
  | "required"
  | "invalid_format"
  | "must_be_positive"
  | "future_date"
  | "duplicate_date"
  | "target_must_be_lower"
  | "invalid_order"
  | "multiple_active_goals"
  | "completed_goal_read_only";

export interface ValidationIssue {
  field: string;
  code: ValidationIssueCode;
  message: string;
}

export type ValidationResult<T> =
  | {
      valid: true;
      value: T;
      issues: [];
    }
  | {
      valid: false;
      issues: ValidationIssue[];
    };
