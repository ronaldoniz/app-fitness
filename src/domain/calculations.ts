import { civilDateToEpochDay } from "./civil-date";
import type {
  BmiClassification,
  CivilDate,
  Goal,
  Weighing,
} from "./types";

const BMI_CLASSIFICATIONS: ReadonlyArray<
  BmiClassification & { upperExclusive: number }
> = [
  { code: "underweight", label: "Baixo peso", upperExclusive: 18.5 },
  { code: "adequate", label: "Peso adequado", upperExclusive: 25 },
  { code: "overweight", label: "Sobrepeso", upperExclusive: 30 },
  { code: "obesity-1", label: "Obesidade grau I", upperExclusive: 35 },
  { code: "obesity-2", label: "Obesidade grau II", upperExclusive: 40 },
  {
    code: "obesity-3",
    label: "Obesidade grau III",
    upperExclusive: Number.POSITIVE_INFINITY,
  },
];

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function calculateBmi(
  weightKg: number,
  heightCm: number,
): number | null {
  if (!isPositiveFinite(weightKg) || !isPositiveFinite(heightCm)) {
    return null;
  }

  const heightM = heightCm / 100;
  return weightKg / heightM ** 2;
}

export function classifyAdultBmi(
  bmi: number,
): BmiClassification | null {
  if (!isPositiveFinite(bmi)) {
    return null;
  }

  const classification = BMI_CLASSIFICATIONS.find(
    ({ upperExclusive }) => bmi < upperExclusive,
  );

  if (!classification) {
    return null;
  }

  return {
    code: classification.code,
    label: classification.label,
  };
}

export function getCurrentWeighing(
  weighings: readonly Weighing[],
): Weighing | null {
  return weighings.reduce<Weighing | null>((latest, weighing) => {
    const weighingDay = civilDateToEpochDay(weighing.date);

    if (weighingDay === null) {
      return latest;
    }

    if (!latest) {
      return weighing;
    }

    const latestDay = civilDateToEpochDay(latest.date);
    return latestDay === null || weighingDay >= latestDay ? weighing : latest;
  }, null);
}

export function calculateLowestWeightKg(
  weighings: readonly Weighing[],
): number | null {
  const validWeights = weighings
    .map(({ weightKg }) => weightKg)
    .filter(isPositiveFinite);

  return validWeights.length > 0 ? Math.min(...validWeights) : null;
}

export function calculateTotalWeightLostKg(
  initialWeightKg: number,
  currentWeightKg: number,
): number | null {
  if (
    !isPositiveFinite(initialWeightKg) ||
    !isPositiveFinite(currentWeightKg)
  ) {
    return null;
  }

  return initialWeightKg - currentWeightKg;
}

export function calculateWeightVariationKg(
  currentWeightKg: number,
  previousWeightKg: number,
): number | null {
  if (
    !isPositiveFinite(currentWeightKg) ||
    !isPositiveFinite(previousWeightKg)
  ) {
    return null;
  }

  return currentWeightKg - previousWeightKg;
}

export interface SevenDayMovingAveragePoint {
  weighingId: string;
  date: CivilDate;
  weightKg: number;
  averageWeightKg: number;
  sampleSize: number;
}

export function calculateSevenDayMovingAverageSeriesKg(
  weighings: readonly Weighing[],
): SevenDayMovingAveragePoint[] {
  const validWeighings = weighings
    .map((weighing) => ({
      weighing,
      epochDay: civilDateToEpochDay(weighing.date),
    }))
    .filter(
      (
        item,
      ): item is {
        weighing: Weighing;
        epochDay: number;
      } => item.epochDay !== null && isPositiveFinite(item.weighing.weightKg),
    )
    .sort((left, right) => left.epochDay - right.epochDay);

  const result: SevenDayMovingAveragePoint[] = [];
  let windowStartIndex = 0;
  let windowSumKg = 0;
  let currentIndex = 0;

  while (currentIndex < validWeighings.length) {
    const referenceDay = validWeighings[currentIndex].epochDay;
    let sameDayEndIndex = currentIndex;

    while (
      sameDayEndIndex < validWeighings.length &&
      validWeighings[sameDayEndIndex].epochDay === referenceDay
    ) {
      windowSumKg += validWeighings[sameDayEndIndex].weighing.weightKg;
      sameDayEndIndex += 1;
    }

    const firstDayInWindow = referenceDay - 6;

    while (
      windowStartIndex < sameDayEndIndex &&
      validWeighings[windowStartIndex].epochDay < firstDayInWindow
    ) {
      windowSumKg -= validWeighings[windowStartIndex].weighing.weightKg;
      windowStartIndex += 1;
    }

    const sampleSize = sameDayEndIndex - windowStartIndex;
    const averageWeightKg = windowSumKg / sampleSize;

    for (let index = currentIndex; index < sameDayEndIndex; index += 1) {
      const weighing = validWeighings[index].weighing;
      result.push({
        weighingId: weighing.id,
        date: weighing.date,
        weightKg: weighing.weightKg,
        averageWeightKg,
        sampleSize,
      });
    }

    currentIndex = sameDayEndIndex;
  }

  return result;
}

export function calculateSevenDayMovingAverageKg(
  weighings: readonly Weighing[],
): number | null {
  return (
    calculateSevenDayMovingAverageSeriesKg(weighings).at(-1)
      ?.averageWeightKg ?? null
  );
}

export function calculateGoalProgressPercent(
  initialWeightKg: number,
  currentWeightKg: number,
  targetWeightKg: number,
): number | null {
  if (
    !isPositiveFinite(initialWeightKg) ||
    !isPositiveFinite(currentWeightKg) ||
    !isPositiveFinite(targetWeightKg)
  ) {
    return null;
  }

  const plannedLossKg = initialWeightKg - targetWeightKg;

  if (plannedLossKg <= 0) {
    return null;
  }

  const progress = ((initialWeightKg - currentWeightKg) / plannedLossKg) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function calculateWeightRemainingKg(
  currentWeightKg: number,
  targetWeightKg: number,
): number | null {
  if (
    !isPositiveFinite(currentWeightKg) ||
    !isPositiveFinite(targetWeightKg)
  ) {
    return null;
  }

  return Math.max(0, currentWeightKg - targetWeightKg);
}

export function evaluateGoalCompletion(
  goal: Goal,
  weighings: readonly Weighing[],
): Goal {
  const currentWeighing = getCurrentWeighing(weighings);

  if (
    !goal.isActive ||
    goal.completedOn !== null ||
    currentWeighing === null ||
    currentWeighing.weightKg > goal.targetWeightKg
  ) {
    return goal;
  }

  return {
    ...goal,
    isActive: false,
    completedOn: currentWeighing.date,
  };
}
