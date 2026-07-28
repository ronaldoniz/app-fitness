import { describe, expect, it } from "vitest";

import { normalizeApplicationOrigin } from "./urls";

describe("application URL", () => {
  it("keeps only the origin of HTTP application URLs", () => {
    expect(
      normalizeApplicationOrigin("http://localhost:3000/auth/callback"),
    ).toBe("http://localhost:3000");
    expect(normalizeApplicationOrigin("https://app.example.com/path")).toBe(
      "https://app.example.com",
    );
  });

  it("rejects invalid and non-HTTP URLs", () => {
    expect(normalizeApplicationOrigin("javascript:alert(1)")).toBeNull();
    expect(normalizeApplicationOrigin("not-a-url")).toBeNull();
  });
});
