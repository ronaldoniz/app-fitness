import { describe, expect, it } from "vitest";

import { getAuthErrorMessage } from "./errors";

describe("auth error messages", () => {
  it("translates known provider errors without exposing technical text", () => {
    expect(
      getAuthErrorMessage("invalid_credentials", "Falha desconhecida."),
    ).toBe("E-mail ou senha inválidos.");
    expect(getAuthErrorMessage("unknown_code", "Falha desconhecida.")).toBe(
      "Falha desconhecida.",
    );
  });
});
