import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260727000000_account_deletion.sql",
  ),
  "utf8",
);

describe("account deletion migration", () => {
  it("derives the account exclusively from the authenticated user", () => {
    expect(migration).toContain(
      "create function public.delete_own_account()",
    );
    expect(migration).toContain(
      "authenticated_user_id uuid := (select auth.uid())",
    );
    expect(migration).not.toContain("p_user_id");
  });

  it("removes functional data and the Auth user in one transaction", () => {
    expect(migration).toContain("delete from public.goals");
    expect(migration).toContain("delete from public.weigh_ins");
    expect(migration).toContain("delete from public.profiles");
    expect(migration).toContain("delete from auth.users");
    expect(migration).toContain("where id = authenticated_user_id");
  });

  it("uses a protected security-definer operation unavailable to anon", () => {
    expect(migration).toContain("security definer");
    expect(migration).toContain("set search_path = ''");
    expect(migration).toContain(
      "revoke all on function public.delete_own_account() from anon",
    );
    expect(migration).toContain(
      "grant execute on function public.delete_own_account() to authenticated",
    );
  });
});
