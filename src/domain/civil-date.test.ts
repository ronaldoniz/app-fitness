import { describe, expect, it } from "vitest";
import {
  addCivilDays,
  civilDateToEpochDay,
  compareCivilDates,
  daysBetweenCivilDates,
  epochDayToCivilDate,
  formatCivilDatePtBr,
  formatLocalCivilDate,
  isCivilDate,
  parseCivilDate,
  subtractCivilYears,
} from "./civil-date";

describe("datas civis", () => {
  it("aceita datas existentes e anos bissextos", () => {
    expect(isCivilDate("2024-02-29")).toBe(true);
    expect(parseCivilDate("2024-02-29")).toEqual({
      year: 2024,
      month: 2,
      day: 29,
    });
  });

  it("rejeita datas inexistentes e formatos ambíguos", () => {
    expect(isCivilDate("2026-02-29")).toBe(false);
    expect(isCivilDate("26/07/2026")).toBe(false);
    expect(isCivilDate("2026-13-01")).toBe(false);
  });

  it("compara datas sem depender de conversão de fuso horário", () => {
    expect(compareCivilDates("2026-07-25", "2026-07-26")).toBe(-1);
    expect(daysBetweenCivilDates("2025-12-31", "2026-01-01")).toBe(1);
    expect(civilDateToEpochDay("data-inválida")).toBeNull();
  });

  it("move datas civis por dias sem usar o fuso horário local", () => {
    expect(addCivilDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(addCivilDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(epochDayToCivilDate(civilDateToEpochDay("2026-07-26")!)).toBe(
      "2026-07-26",
    );
  });

  it("subtrai anos civis e ajusta o dia bissexto", () => {
    expect(subtractCivilYears("2026-07-26", 1)).toBe("2025-07-26");
    expect(subtractCivilYears("2024-02-29", 1)).toBe("2023-02-28");
  });

  it("formata uma data local no padrão civil", () => {
    expect(formatLocalCivilDate(new Date(2026, 6, 26, 23, 30))).toBe(
      "2026-07-26",
    );
  });

  it("formata uma data civil para exibição sem conversão de fuso", () => {
    expect(formatCivilDatePtBr("2026-07-05")).toBe("05/07/2026");
    expect(formatCivilDatePtBr("data-inválida")).toBeNull();
  });
});
