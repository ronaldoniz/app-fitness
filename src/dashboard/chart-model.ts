import { calculateSevenDayMovingAverageSeriesKg } from "../domain/calculations";
import { civilDateToEpochDay } from "../domain/civil-date";
import type { CivilDate, Weighing } from "../domain/types";

export interface WeightChartPoint {
  weighingId: string;
  date: CivilDate;
  epochDay: number;
  weightKg: number;
  movingAverageKg: number;
  movingAverageSampleSize: number;
}

export interface WeightChartModel {
  state: "empty" | "single" | "history";
  points: WeightChartPoint[];
  firstPoint: WeightChartPoint | null;
  latestPoint: WeightChartPoint | null;
  lowestWeightKg: number | null;
  variationKg: number | null;
}

export function buildWeightChartModel(
  weighings: readonly Weighing[],
): WeightChartModel {
  const points = calculateSevenDayMovingAverageSeriesKg(weighings).flatMap(
    (point) => {
      const epochDay = civilDateToEpochDay(point.date);

      return epochDay === null
        ? []
        : [
            {
              weighingId: point.weighingId,
              date: point.date,
              epochDay,
              weightKg: point.weightKg,
              movingAverageKg: point.averageWeightKg,
              movingAverageSampleSize: point.sampleSize,
            },
          ];
    },
  );
  const firstPoint = points.at(0) ?? null;
  const latestPoint = points.at(-1) ?? null;

  return {
    state:
      points.length === 0
        ? "empty"
        : points.length === 1
          ? "single"
          : "history",
    points,
    firstPoint,
    latestPoint,
    lowestWeightKg:
      points.length === 0
        ? null
        : Math.min(...points.map(({ weightKg }) => weightKg)),
    variationKg:
      firstPoint && latestPoint
        ? latestPoint.weightKg - firstPoint.weightKg
        : null,
  };
}
