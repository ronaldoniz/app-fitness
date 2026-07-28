import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL(
    "./20260728000000_harden_table_privileges.sql",
    import.meta.url,
  ),
  "utf8",
).toLowerCase();

describe("table privilege hardening migration", () => {
  it("removes inherited table-wide privileges from API roles", () => {
    for (const table of ["profiles", "weigh_ins", "goals"]) {
      expect(migration).toContain(
        `revoke all on table public.${table} from anon, authenticated`,
      );
    }
  });

  it("keeps goal lifecycle fields unavailable to direct writes", () => {
    expect(migration).toContain(
      "grant insert (\n  user_id,\n  target_weight_kg,\n  display_order,\n  is_active\n) on public.goals to authenticated",
    );
    expect(migration).toContain(
      "grant update (\n  target_weight_kg,\n  display_order,\n  is_active\n) on public.goals to authenticated",
    );
    expect(migration).not.toMatch(
      /grant\s+(?:all|insert|update)(?:\s*,[^;]*)?\s+on\s+(?:table\s+)?public\.goals\s+to\s+authenticated/,
    );
  });
});
