import type { CivilDate } from "./types";

const CIVIL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 86_400_000;

interface CivilDateParts {
  year: number;
  month: number;
  day: number;
}

export function parseCivilDate(value: string): CivilDateParts | null {
  const match = CIVIL_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function isCivilDate(value: string): value is CivilDate {
  return parseCivilDate(value) !== null;
}

export function civilDateToEpochDay(value: string): number | null {
  const parts = parseCivilDate(value);

  if (!parts) {
    return null;
  }

  return Math.floor(
    Date.UTC(parts.year, parts.month - 1, parts.day) / MILLISECONDS_PER_DAY,
  );
}

export function epochDayToCivilDate(epochDay: number): CivilDate | null {
  if (!Number.isInteger(epochDay)) {
    return null;
  }

  const date = new Date(epochDay * MILLISECONDS_PER_DAY);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}` as CivilDate;
}

export function addCivilDays(
  value: string,
  amount: number,
): CivilDate | null {
  const epochDay = civilDateToEpochDay(value);

  if (epochDay === null || !Number.isInteger(amount)) {
    return null;
  }

  return epochDayToCivilDate(epochDay + amount);
}

export function subtractCivilYears(
  value: string,
  amount: number,
): CivilDate | null {
  const parts = parseCivilDate(value);

  if (!parts || !Number.isInteger(amount) || amount < 0) {
    return null;
  }

  const targetYear = parts.year - amount;
  const lastDayOfTargetMonth = new Date(
    Date.UTC(targetYear, parts.month, 0),
  ).getUTCDate();
  const targetDay = Math.min(parts.day, lastDayOfTargetMonth);
  const month = String(parts.month).padStart(2, "0");
  const day = String(targetDay).padStart(2, "0");

  return `${targetYear}-${month}-${day}` as CivilDate;
}

export function compareCivilDates(
  left: string,
  right: string,
): number | null {
  const leftDay = civilDateToEpochDay(left);
  const rightDay = civilDateToEpochDay(right);

  if (leftDay === null || rightDay === null) {
    return null;
  }

  return Math.sign(leftDay - rightDay);
}

export function daysBetweenCivilDates(
  start: string,
  end: string,
): number | null {
  const startDay = civilDateToEpochDay(start);
  const endDay = civilDateToEpochDay(end);

  if (startDay === null || endDay === null) {
    return null;
  }

  return endDay - startDay;
}

export function formatLocalCivilDate(date: Date): CivilDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` as CivilDate;
}

export function formatCivilDatePtBr(value: string): string | null {
  const parts = parseCivilDate(value);

  if (!parts) {
    return null;
  }

  const day = String(parts.day).padStart(2, "0");
  const month = String(parts.month).padStart(2, "0");
  return `${day}/${month}/${parts.year}`;
}
