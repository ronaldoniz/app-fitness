import { buildWeightChartModel } from "@/dashboard/chart-model";
import { formatCivilDatePtBr } from "@/domain";
import type { Weighing } from "@/domain";

interface WeightEvolutionChartProps {
  weighings: readonly Weighing[];
}

interface PositionedPoint {
  id: string;
  x: number;
  weightY: number;
  averageY: number;
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 320;
const PLOT_LEFT = 64;
const PLOT_RIGHT = 20;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 44;

function formatDecimal(value: number): string {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });
}

function formatKg(value: number): string {
  return `${formatDecimal(value)} kg`;
}

function buildPath(
  points: readonly PositionedPoint[],
  yKey: "weightY" | "averageY",
): string {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point[
          yKey
        ].toFixed(2)}`,
    )
    .join(" ");
}

export function WeightEvolutionChart({
  weighings,
}: WeightEvolutionChartProps) {
  const model = buildWeightChartModel(weighings);

  if (!model.firstPoint || !model.latestPoint) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm leading-6 text-slate-400">
        O gráfico será exibido após o registro da primeira pesagem.
      </div>
    );
  }

  const allValues = model.points.flatMap(
    ({ weightKg, movingAverageKg }) => [weightKg, movingAverageKg],
  );
  const rawMinimum = Math.min(...allValues);
  const rawMaximum = Math.max(...allValues);
  const visibleRange = Math.max(rawMaximum - rawMinimum, 1);
  const verticalPadding = Math.max(visibleRange * 0.12, 0.5);
  const minimum = rawMinimum - verticalPadding;
  const maximum = rawMaximum + verticalPadding;
  const firstDay = model.firstPoint.epochDay;
  const lastDay = model.latestPoint.epochDay;
  const dayRange = Math.max(lastDay - firstDay, 1);
  const plotWidth = CHART_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const plotHeight = CHART_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
  const positionedPoints = model.points.map((point) => ({
    id: point.weighingId,
    x:
      model.state === "single"
        ? PLOT_LEFT + plotWidth / 2
        : PLOT_LEFT +
          ((point.epochDay - firstDay) / dayRange) * plotWidth,
    weightY:
      PLOT_TOP + ((maximum - point.weightKg) / (maximum - minimum)) * plotHeight,
    averageY:
      PLOT_TOP +
      ((maximum - point.movingAverageKg) / (maximum - minimum)) * plotHeight,
  }));
  const yTicks = [maximum, (maximum + minimum) / 2, minimum];
  const variationText =
    model.state === "single" || model.variationKg === null
      ? "Ainda não há variação histórica."
      : model.variationKg < 0
        ? `Redução de ${formatKg(Math.abs(model.variationKg))} entre o primeiro e o último ponto.`
        : model.variationKg > 0
          ? `Aumento de ${formatKg(model.variationKg)} entre o primeiro e o último ponto.`
          : "Sem variação entre o primeiro e o último ponto.";
  const summary = `${model.points.length} ${
    model.points.length === 1 ? "pesagem" : "pesagens"
  } entre ${formatCivilDatePtBr(model.firstPoint.date)} e ${formatCivilDatePtBr(
    model.latestPoint.date,
  )}. ${variationText} Menor peso: ${formatKg(
    model.lowestWeightKg ?? model.latestPoint.weightKg,
  )}. Média móvel na data mais recente: ${formatKg(
    model.latestPoint.movingAverageKg,
  )}.`;
  const showAllPoints = positionedPoints.length <= 60;
  const visiblePoints = showAllPoints
    ? positionedPoints
    : [positionedPoints[0], positionedPoints.at(-1)!];

  return (
    <figure
      aria-describedby="weight-chart-summary"
      className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-6"
    >
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0.5 w-6 rounded-full bg-emerald-300"
          />
          Peso registrado
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0.5 w-6 border-t-2 border-dashed border-sky-300"
          />
          Média móvel de 7 dias
        </span>
      </div>

      <div className="mt-5 w-full min-w-0 overflow-hidden">
        <svg
          aria-hidden="true"
          className="block h-auto w-full max-w-full"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        >
          {yTicks.map((tick, index) => {
            const y =
              PLOT_TOP +
              ((maximum - tick) / (maximum - minimum)) * plotHeight;

            return (
              <g key={`${tick}-${index}`}>
                <line
                  stroke="var(--chart-grid)"
                  strokeWidth="1"
                  x1={PLOT_LEFT}
                  x2={CHART_WIDTH - PLOT_RIGHT}
                  y1={y}
                  y2={y}
                />
                <text
                  fill="#94a3b8"
                  fontSize="15"
                  textAnchor="end"
                  x={PLOT_LEFT - 10}
                  y={y + 5}
                >
                  {formatDecimal(tick)}
                </text>
              </g>
            );
          })}

          {positionedPoints.length > 1 ? (
            <>
              <path
                d={buildPath(positionedPoints, "weightY")}
                fill="none"
                stroke="#6ee7b7"
                strokeLinejoin="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={buildPath(positionedPoints, "averageY")}
                fill="none"
                stroke="#7dd3fc"
                strokeDasharray="7 6"
                strokeLinejoin="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : null}

          {visiblePoints.map((point) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.averageY}
                fill="var(--chart-point-background)"
                r="4"
                stroke="#7dd3fc"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={point.x}
                cy={point.weightY}
                fill="#6ee7b7"
                r="4"
                stroke="var(--chart-point-background)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-1 flex justify-between gap-4 text-xs text-slate-500">
        <span>{formatCivilDatePtBr(model.firstPoint.date)}</span>
        <span className="text-right">
          {formatCivilDatePtBr(model.latestPoint.date)}
        </span>
      </div>

      <figcaption
        className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300"
        id="weight-chart-summary"
      >
        {summary}
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          A média usa as pesagens existentes nos sete dias civis encerrados em
          cada ponto.
        </span>
      </figcaption>
    </figure>
  );
}
