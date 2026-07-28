import { headers } from "next/headers";

export function normalizeApplicationOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

export async function getApplicationOrigin(): Promise<string> {
  const configuredOrigin = normalizeApplicationOrigin(
    process.env.APP_URL?.trim() ?? "",
  );

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const requestOrigin = normalizeApplicationOrigin(
    (await headers()).get("origin") ?? "",
  );

  return requestOrigin ?? "http://localhost:3000";
}
