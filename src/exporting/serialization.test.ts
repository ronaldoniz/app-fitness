import { describe, expect, it } from "vitest";

import type { CivilDate, Goal, Profile, Weighing } from "../domain";
import {
  buildFunctionalDataExport,
  createExportFilename,
  serializeFunctionalDataJson,
  serializeWeighingHistoryCsv,
} from "./serialization";

const profile: Profile = {
  id: "profile-secret-id",
  userId: "user-secret-id",
  name: "Ana",
  email: "ana@example.com",
  heightCm: 160,
  initialWeightKg: 90,
  themePreference: "system",
  createdAt: "2026-07-01T10:00:00.000Z",
  updatedAt: "2026-07-20T10:00:00.000Z",
};

function weighing(
  id: string,
  date: CivilDate,
  weightKg: number,
  overrides: Partial<Weighing> = {},
): Weighing {
  return {
    id,
    userId: "user-secret-id",
    date,
    weightKg,
    waistCm: null,
    notes: null,
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T12:00:00.000Z`,
    ...overrides,
  };
}

const goal: Goal = {
  id: "goal-secret-id",
  userId: "user-secret-id",
  targetWeightKg: 75,
  displayOrder: 0,
  isActive: true,
  completedOn: null,
  createdAt: "2026-07-01T10:00:00.000Z",
  updatedAt: "2026-07-01T10:00:00.000Z",
};

describe("exportação JSON", () => {
  const generatedAt = new Date("2026-07-27T15:30:00.000Z");

  it("inclui metadados e somente dados funcionais do perfil, pesagens e metas", () => {
    const result = buildFunctionalDataExport(
      profile,
      [weighing("weighing-secret-id", "2026-07-26", 80)],
      [goal],
      generatedAt,
    );

    expect(result.metadados).toMatchObject({
      tipo_conteudo: "dados_funcionais_completos",
      gerado_em: "2026-07-27T15:30:00.000Z",
      idioma: "pt-BR",
      datas_civis: "AAAA-MM-DD, sem conversão de fuso horário",
      unidades: {
        altura: "cm",
        cintura: "cm",
        peso: "kg",
      },
    });
    expect(result.perfil).toMatchObject({
      nome: "Ana",
      email: "ana@example.com",
      preferencia_tema: "sistema_operacional",
    });
    expect(result.pesagens[0]?.data).toBe("2026-07-26");
    expect(result.metas[0]).toMatchObject({
      peso_alvo_kg: 75,
      ativa: true,
    });
  });

  it("não serializa IDs de propriedade nem informações de autenticação", () => {
    const json = serializeFunctionalDataJson(
      profile,
      [weighing("weighing-secret-id", "2026-07-26", 80)],
      [goal],
      generatedAt,
    );

    expect(json).not.toContain("profile-secret-id");
    expect(json).not.toContain("weighing-secret-id");
    expect(json).not.toContain("goal-secret-id");
    expect(json).not.toContain("user-secret-id");
    expect(json).not.toContain("access_token");
    expect(json).not.toContain("refresh_token");
  });

  it("ordena pesagens por data civil sem converter fuso horário", () => {
    const result = buildFunctionalDataExport(
      profile,
      [
        weighing("2", "2026-07-27", 79),
        weighing("1", "2026-01-01", 80),
      ],
      [],
      generatedAt,
    );

    expect(result.pesagens.map(({ data }) => data)).toEqual([
      "2026-01-01",
      "2026-07-27",
    ]);
  });
});

describe("exportação CSV", () => {
  it("exporta somente o histórico tabular com unidades explícitas", () => {
    const csv = serializeWeighingHistoryCsv(profile, [
      weighing("newest", "2026-07-20", 78, {
        waistCm: 82.5,
        notes: 'Observação, com "aspas"',
      }),
      weighing("oldest", "2026-07-01", 80),
      weighing("middle", "2026-07-10", 79),
    ]);
    const lines = csv.trim().split("\r\n");

    expect(lines[0]).toBe(
      "data,peso_kg,cintura_cm,observacao,imc,variacao_kg,total_perdido_kg",
    );
    expect(lines[1]).toBe(
      '2026-07-20,78,82.5,"Observação, com ""aspas""",30.47,-1,12',
    );
    expect(lines[2]).toBe("2026-07-10,79,,,30.86,-1,11");
    expect(lines[3]).toBe("2026-07-01,80,,,31.25,,10");
    expect(csv).not.toContain("Ana");
    expect(csv).not.toContain("75");
    expect(csv).not.toContain("user-secret-id");
  });

  it("mantém a variação contra o registro cronologicamente anterior", () => {
    const csv = serializeWeighingHistoryCsv(profile, [
      weighing("latest", "2026-12-31", 76),
      weighing("previous", "2026-02-01", 79),
      weighing("first", "2026-01-01", 80),
    ]);
    const lines = csv.trim().split("\r\n");

    expect(lines[1]?.split(",")[5]).toBe("-3");
    expect(lines[2]?.split(",")[5]).toBe("-1");
    expect(lines[3]?.split(",")[5]).toBe("");
  });

  it("gera apenas o cabeçalho quando não há pesagens", () => {
    expect(serializeWeighingHistoryCsv(profile, [])).toBe(
      "data,peso_kg,cintura_cm,observacao,imc,variacao_kg,total_perdido_kg\r\n",
    );
  });
});

describe("nomes dos arquivos", () => {
  it("identifica claramente formato, conteúdo e data", () => {
    const generatedAt = new Date("2026-07-27T23:59:00.000Z");

    expect(createExportFilename("json", generatedAt)).toBe(
      "evolucao-fitness-dados-completos-2026-07-27.json",
    );
    expect(createExportFilename("csv", generatedAt)).toBe(
      "evolucao-fitness-historico-pesagens-2026-07-27.csv",
    );
  });
});
