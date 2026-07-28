import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260726000000_initial_schema.sql",
  ),
  "utf8",
);

describe("initial Supabase migration", () => {
  it.each(["profiles", "weigh_ins", "goals"])(
    "enables RLS and defines ownership policies for %s",
    (table) => {
      expect(migration).toContain(
        `alter table public.${table} enable row level security;`,
      );
      expect(migration).toContain(`on public.${table}`);
      expect(migration).toContain("to authenticated");
      expect(migration).toContain("((select auth.uid()) = user_id)");
    },
  );

  it("enforces one civil-date weigh-in and one active goal per user", () => {
    expect(migration).toContain(
      "constraint weigh_ins_user_date_key unique (user_id, weighed_on)",
    );
    expect(migration).toContain("goals_one_active_per_user_idx");
    expect(migration).toContain("where is_active = true");
  });

  it("reevaluates the active goal after every relevant weighing change", () => {
    expect(migration).toContain(
      "create trigger weigh_ins_reevaluate_active_goal",
    );
    expect(migration).toContain(
      "after insert or update or delete on public.weigh_ins",
    );
    expect(migration).toContain("order by wi.weighed_on desc");
    expect(migration).toContain("limit 1");
    expect(migration).toContain(
      "current_weigh_in.weight_kg <= goals.target_weight_kg",
    );
  });

  it("reevaluates after creating, editing or activating goals", () => {
    expect(migration).toContain(
      "create trigger goals_reevaluate_active_goal",
    );
    expect(migration).toContain("after insert or update on public.goals");
    expect(migration).toContain("when (new.completed_on is null)");
    expect(migration).toContain(
      "completed_on = current_weigh_in.weighed_on",
    );
  });

  it("validates target changes but allows an old goal to be activated", () => {
    expect(migration).toContain(
      "new.target_weight_kg is distinct from old.target_weight_kg",
    );
    expect(migration).not.toContain(
      "new.is_active = true and old.is_active = false",
    );
    expect(migration).toContain(
      "select *\n  into activated_goal\n  from public.goals",
    );
  });
});
