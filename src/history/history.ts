import {
  addCivilDays,
  calculateBmi,
  calculateTotalWeightLostKg,
  calculateWeightVariationKg,
  civilDateToEpochDay,
  compareCivilDates,
  isCivilDate,
  subtractCivilYears,
  type CivilDate,
  type Weighing,
} from "../domain";

export type HistoryPeriod =
  | "30-days"
  | "90-days"
  | "last-year"
  | "custom"
  | "all";

export interface HistoryFilter {
  period: HistoryPeriod;
  from: CivilDate | null;
  to: CivilDate | null;
  message: string | null;
}

export interface HistoryRow {
  weighing: Weighing;
  bmi: number | null;
  variationKg: number | null;
  totalLostKg: number | null;
}

const HISTORY_PERIODS = new Set<HistoryPeriod>([
  "30-days",
  "90-days",
  "last-year",
  "custom",
  "all",
]);

function isHistoryPeriod(value: string | undefined): value is HistoryPeriod {
  return Boolean(value && HISTORY_PERIODS.has(value as HistoryPeriod));
}

function fixedPeriodFilter(
  period: Exclude<HistoryPeriod, "custom" | "all">,
  today: CivilDate,
): HistoryFilter {
  const from =
    period === "30-days"
      ? addCivilDays(today, -29)
      : period === "90-days"
        ? addCivilDays(today, -89)
        : subtractCivilYears(today, 1);

  return {
    period,
    from,
    to: today,
    message: null,
  };
}

export function resolveHistoryFilter(
  input: {
    period?: string;
    from?: string;
    to?: string;
  },
  today: CivilDate,
): HistoryFilter {
  const period = isHistoryPeriod(input.period)
    ? input.period
    : "30-days";

  if (period === "all") {
    return { period, from: null, to: null, message: null };
  }

  if (period !== "custom") {
    return fixedPeriodFilter(period, today);
  }

  if (!input.from || !input.to) {
    return {
      period,
      from: null,
      to: null,
      message: "Informe as datas inicial e final do período.",
    };
  }

  if (!isCivilDate(input.from) || !isCivilDate(input.to)) {
    return {
      period,
      from: null,
      to: null,
      message: "Informe um período com datas válidas.",
    };
  }

  const comparison = compareCivilDates(input.from, input.to);

  if (comparison === null || comparison > 0) {
    return {
      period,
      from: input.from,
      to: input.to,
      message: "A data inicial não pode ser posterior à data final.",
    };
  }

  return {
    period,
    from: input.from,
    to: input.to,
    message: null,
  };
}

function sortNewestFirst(
  weighings: readonly Weighing[],
): Weighing[] {
  return [...weighings].sort((left, right) => {
    const leftDay = civilDateToEpochDay(left.date) ?? 0;
    const rightDay = civilDateToEpochDay(right.date) ?? 0;
    return rightDay - leftDay;
  });
}

function isInsideFilter(
  weighing: Weighing,
  filter: HistoryFilter,
): boolean {
  if (filter.message || filter.period === "all") {
    return !filter.message;
  }

  const day = civilDateToEpochDay(weighing.date);
  const fromDay = filter.from
    ? civilDateToEpochDay(filter.from)
    : null;
  const toDay = filter.to ? civilDateToEpochDay(filter.to) : null;

  return (
    day !== null &&
    fromDay !== null &&
    toDay !== null &&
    day >= fromDay &&
    day <= toDay
  );
}

export function buildHistoryRows(
  weighings: readonly Weighing[],
  context: {
    filter: HistoryFilter;
    heightCm: number;
    initialWeightKg: number;
  },
): HistoryRow[] {
  const sortedWeighings = sortNewestFirst(weighings);

  return sortedWeighings
    .map((weighing, index): HistoryRow => {
      const previousWeighing = sortedWeighings[index + 1];

      return {
        weighing,
        bmi: calculateBmi(weighing.weightKg, context.heightCm),
        variationKg: previousWeighing
          ? calculateWeightVariationKg(
              weighing.weightKg,
              previousWeighing.weightKg,
            )
          : null,
        totalLostKg: calculateTotalWeightLostKg(
          context.initialWeightKg,
          weighing.weightKg,
        ),
      };
    })
    .filter(({ weighing }) =>
      isInsideFilter(weighing, context.filter),
    );
}
