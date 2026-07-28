import { describe, expect, it } from "vitest";

import { getSafeAuthDestination, isPublicPath } from "./routing";

describe("auth routing", () => {
  it("accepts only known same-origin destinations", () => {
    expect(getSafeAuthDestination("/dashboard")).toBe("/dashboard");
    expect(getSafeAuthDestination("/redefinir-senha")).toBe(
      "/redefinir-senha",
    );
    expect(getSafeAuthDestination("https://example.com")).toBe(
      "/onboarding",
    );
    expect(getSafeAuthDestination("//example.com")).toBe("/onboarding");
  });

  it("keeps auth endpoints public and private data routes protected", () => {
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/auth/callback")).toBe(true);
    expect(isPublicPath("/icon/192")).toBe(true);
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/onboarding")).toBe(false);
    expect(isPublicPath("/redefinir-senha")).toBe(false);
  });
});
