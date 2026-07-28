import type { Goal, Profile, ThemePreference, Weighing } from "../domain";
import { buildHistoryRows } from "../history/history";

const CSV_HEADERS = [
  "data",
  "peso_kg",
  "cintura_cm",
  "observacao",
  "imc",
  "variacao_kg",
  "total_perdido_kg",
] as const;

const THEME_LABELS: Record<ThemePreference, string> = {
  dark: "escuro",
  light: "claro",
  system: "sistema_operacional",
};

export interface FunctionalDataExport {
  metadados: {
    tipo_conteudo: "dados_funcionais_completos";
    versao_formato: "1.0";
    gerado_em: string;
    idioma: "pt-BR";
    datas_civis: "AAAA-MM-DD, sem conversão de fuso horário";
    unidades: {
      altura: "cm";
      cintura: "cm";
      peso: "kg";
    };
  };
  perfil: {
    nome: string;
    email: string;
    altura_cm: number;
    peso_inicial_kg: number;
    preferencia_tema: string;
    criado_em: string;
    atualizado_em: string;
  };
  pesagens: Array<{
    data: string;
    peso_kg: number;
    cintura_cm: number | null;
    observacao: string | null;
    criada_em: string;
    atualizada_em: string;
  }>;
  metas: Array<{
    peso_alvo_kg: number;
    ordem_exibicao: number;
    ativa: boolean;
    concluida_em: string | null;
    criada_em: string;
    atualizada_em: string;
  }>;
}

function chronologicalWeighings(
  weighings: readonly Weighing[],
): Weighing[] {
  return [...weighings].sort((left, right) =>
    left.date.localeCompare(right.date),
  );
}

function csvCell(value: string | number | null): string {
  if (value === null) {
    return "";
  }

  const text = String(value);

  return /[",\r\n]/.test(text)
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

function csvNumber(
  value: number | null,
  maximumFractionDigits: number,
): string {
  if (value === null || !Number.isFinite(value)) {
    return "";
  }

  const rounded = Number(value.toFixed(maximumFractionDigits));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

export function buildFunctionalDataExport(
  profile: Profile,
  weighings: readonly Weighing[],
  goals: readonly Goal[],
  generatedAt: Date,
): FunctionalDataExport {
  return {
    metadados: {
      tipo_conteudo: "dados_funcionais_completos",
      versao_formato: "1.0",
      gerado_em: generatedAt.toISOString(),
      idioma: "pt-BR",
      datas_civis: "AAAA-MM-DD, sem conversão de fuso horário",
      unidades: {
        altura: "cm",
        cintura: "cm",
        peso: "kg",
      },
    },
    perfil: {
      nome: profile.name,
      email: profile.email,
      altura_cm: profile.heightCm,
      peso_inicial_kg: profile.initialWeightKg,
      preferencia_tema: THEME_LABELS[profile.themePreference],
      criado_em: profile.createdAt,
      atualizado_em: profile.updatedAt,
    },
    pesagens: chronologicalWeighings(weighings).map((weighing) => ({
      data: weighing.date,
      peso_kg: weighing.weightKg,
      cintura_cm: weighing.waistCm,
      observacao: weighing.notes,
      criada_em: weighing.createdAt,
      atualizada_em: weighing.updatedAt,
    })),
    metas: goals.map((goal) => ({
      peso_alvo_kg: goal.targetWeightKg,
      ordem_exibicao: goal.displayOrder,
      ativa: goal.isActive,
      concluida_em: goal.completedOn,
      criada_em: goal.createdAt,
      atualizada_em: goal.updatedAt,
    })),
  };
}

export function serializeFunctionalDataJson(
  profile: Profile,
  weighings: readonly Weighing[],
  goals: readonly Goal[],
  generatedAt: Date,
): string {
  return `${JSON.stringify(
    buildFunctionalDataExport(profile, weighings, goals, generatedAt),
    null,
    2,
  )}\n`;
}

export function serializeWeighingHistoryCsv(
  profile: Profile,
  weighings: readonly Weighing[],
): string {
  const rows = buildHistoryRows(weighings, {
    filter: {
      period: "all",
      from: null,
      to: null,
      message: null,
    },
    heightCm: profile.heightCm,
    initialWeightKg: profile.initialWeightKg,
  });
  const lines = [
    CSV_HEADERS.join(","),
    ...rows.map(({ weighing, bmi, variationKg, totalLostKg }) =>
      [
        weighing.date,
        csvNumber(weighing.weightKg, 3),
        csvNumber(weighing.waistCm, 3),
        weighing.notes,
        csvNumber(bmi, 2),
        csvNumber(variationKg, 3),
        csvNumber(totalLostKg, 3),
      ]
        .map(csvCell)
        .join(","),
    ),
  ];

  return `${lines.join("\r\n")}\r\n`;
}

export function createExportFilename(
  format: "csv" | "json",
  generatedAt: Date,
): string {
  const date = generatedAt.toISOString().slice(0, 10);

  return format === "json"
    ? `evolucao-fitness-dados-completos-${date}.json`
    : `evolucao-fitness-historico-pesagens-${date}.csv`;
}
