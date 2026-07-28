import { describe, expect, it } from "vitest";

import { readSupabasePublicEnvironment } from "./env";

describe("readSupabasePublicEnvironment", () => {
  it("returns trimmed public settings", () => {
    expect(
      readSupabasePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: " https://example.supabase.co ",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: " anon-key ",
      }),
    ).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });
  });

  it("reports every missing setting without exposing values", () => {
    expect(() => readSupabasePublicEnvironment({})).toThrow(
      "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  });
});
