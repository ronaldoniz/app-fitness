import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260726020000_goal_reordering.sql",
  ),
  "utf8",
);

describe("goal reordering migration", () => {
  it("moves only an authenticated user's pending goals", () => {
    expect(migration).toContain(
      "create function public.move_pending_goal",
    );
    expect(migration).toContain("g.user_id = (select auth.uid())");
    expect(migration).toContain("g.completed_on is null");
    expect(migration).toContain("g.is_active = false");
  });

  it("accepts only the two supported directions", () => {
    expect(migration).toContain(
      "p_direction not in ('up', 'down')",
    );
    expect(migration).toContain("direction must be up or down");
  });

  it("keeps the function unavailable to anonymous callers", () => {
    expect(migration).toContain(
      "revoke all on function public.move_pending_goal(uuid, text) from anon",
    );
    expect(migration).toContain(
      "grant execute on function public.move_pending_goal(uuid, text)",
    );
  });
});
