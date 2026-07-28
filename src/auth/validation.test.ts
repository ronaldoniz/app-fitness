import { describe, expect, it } from "vitest";

import {
  validateEmail,
  validateLoginCredentials,
  validateNewPassword,
  validateRegistrationCredentials,
} from "./validation";

describe("auth validation", () => {
  it("normalizes valid registration data and preserves the password", () => {
    const result = validateRegistrationCredentials({
      name: "  Ana Silva  ",
      email: " ANA@EXAMPLE.COM ",
      password: "segredo",
      passwordConfirmation: "segredo",
    });

    expect(result).toEqual({
      valid: true,
      value: {
        name: "Ana Silva",
        email: "ana@example.com",
        password: "segredo",
      },
    });
  });

  it("rejects mismatched registration passwords", () => {
    const result = validateRegistrationCredentials({
      name: "Ana",
      email: "ana@example.com",
      password: "uma",
      passwordConfirmation: "outra",
    });

    expect(result).toEqual({
      valid: false,
      message: "As senhas informadas não coincidem.",
    });
  });

  it("requires valid login and recovery credentials", () => {
    expect(
      validateLoginCredentials({
        email: "invalido",
        password: "segredo",
      }).valid,
    ).toBe(false);
    expect(validateEmail(" PESSOA@EXAMPLE.COM ")).toEqual({
      valid: true,
      value: "pessoa@example.com",
    });
  });

  it("validates the new password confirmation", () => {
    expect(
      validateNewPassword({
        password: "nova-senha",
        passwordConfirmation: "nova-senha",
      }),
    ).toEqual({ valid: true, value: "nova-senha" });
    expect(
      validateNewPassword({
        password: "nova-senha",
        passwordConfirmation: "",
      }).valid,
    ).toBe(false);
  });
});
