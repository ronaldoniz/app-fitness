import { describe, expect, it } from "vitest";

import type { Tables } from "@/lib/supabase/database.types";

import {
  mapGoalRow,
  mapProfileRow,
  mapWeighInRow,
  toGoalInsert,
  toWeighInInsert,
} from "./mappers";

describe("Supabase data mappers", () => {
  it("maps a profile between domain and database naming", () => {
    const row: Tables<"profiles"> = {
      id: "profile-id",
      user_id: "user-id",
      name: "Ana",
      email: "ana@example.com",
      height_cm: 165,
      initial_weight_kg: 80,
      theme_preference: "dark",
      created_at: "2026-07-26T10:00:00Z",
      updated_at: "2026-07-26T10:00:00Z",
    };

    expect(mapProfileRow(row)).toMatchObject({
      userId: "user-id",
      heightCm: 165,
      initialWeightKg: 80,
      themePreference: "dark",
    });

  });

  it("preserves civil dates and optional weigh-in values", () => {
    const row: Tables<"weigh_ins"> = {
      id: "weigh-in-id",
      user_id: "user-id",
      weighed_on: "2026-07-25",
      weight_kg: 77.4,
      waist_cm: null,
      notes: null,
      created_at: "2026-07-26T10:00:00Z",
      updated_at: "2026-07-26T10:00:00Z",
    };

    expect(mapWeighInRow(row)).toMatchObject({
      date: "2026-07-25",
      weightKg: 77.4,
      waistCm: null,
      notes: null,
    });

    expect(
      toWeighInInsert("user-id", {
        date: "2026-07-25",
        weightKg: 77.4,
      }),
    ).toMatchObject({
      user_id: "user-id",
      weighed_on: "2026-07-25",
      waist_cm: null,
      notes: null,
    });
  });

  it("does not expose completion fields when creating a goal", () => {
    const row: Tables<"goals"> = {
      id: "goal-id",
      user_id: "user-id",
      target_weight_kg: 70,
      display_order: 0,
      is_active: false,
      completed_on: "2026-07-25",
      created_at: "2026-07-20T10:00:00Z",
      updated_at: "2026-07-25T10:00:00Z",
    };

    expect(mapGoalRow(row)).toMatchObject({
      targetWeightKg: 70,
      completedOn: "2026-07-25",
    });

    expect(
      toGoalInsert("user-id", {
        targetWeightKg: 70,
        displayOrder: 0,
        isActive: true,
      }),
    ).toEqual({
      user_id: "user-id",
      target_weight_kg: 70,
      display_order: 0,
      is_active: true,
    });
  });
});
