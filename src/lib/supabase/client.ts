"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";
import { readSupabasePublicEnvironment } from "./env";

export function createBrowserSupabaseClient() {
  const { url, publishableKey } = readSupabasePublicEnvironment();

  return createBrowserClient<Database>(url, publishableKey);
}
