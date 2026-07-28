import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260726010000_auth_onboarding.sql",
  ),
  "utf8",
);

describe("auth onboarding migration", () => {
  it("creates the profile and first active goal atomically", () => {
    expect(migration).toContain(
      "create function public.complete_onboarding",
    );
    expect(migration).toContain("security definer");
    expect(migration).toContain("theme_preference");
    expect(migration).toContain("'dark'");
    expect(migration).toContain("insert into public.goals");
    expect(migration).toContain("true");
  });

  it("derives ownership and email from the authenticated user", () => {
    expect(migration).toContain(
      "authenticated_user_id uuid := (select auth.uid())",
    );
    expect(migration).toContain("from auth.users as u");
    expect(migration).toContain("where u.id = authenticated_user_id");
  });

  it("does not expose onboarding to anonymous callers", () => {
    expect(migration).toContain("from anon");
    expect(migration).toContain("to authenticated");
  });

  it("allows profile creation only through the onboarding operation", () => {
    expect(migration).toContain(
      "revoke insert on table public.profiles from authenticated",
    );
    expect(migration).toContain(
      "drop policy profiles_insert_own on public.profiles",
    );
  });
});
