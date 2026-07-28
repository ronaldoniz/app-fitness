"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";
import { readSupabasePublicEnvironment } from "./env";

export function createBrowserSupabaseClient() {
  const { url, anonKey } = readSupabasePublicEnvironment();

  return createBrowserClient<Database>(url, anonKey);
}
