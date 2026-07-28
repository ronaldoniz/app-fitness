const SAFE_AUTH_DESTINATIONS = new Set([
  "/dashboard",
  "/onboarding",
  "/redefinir-senha",
]);

const PUBLIC_PATHS = new Set([
  "/apple-icon",
  "/cadastro",
  "/confirmar-email",
  "/icon",
  "/login",
  "/manifest.webmanifest",
  "/recuperar-senha",
  "/sw.js",
]);

export function getSafeAuthDestination(
  value: string | null,
  fallback = "/onboarding",
): string {
  return value && SAFE_AUTH_DESTINATIONS.has(value) ? value : fallback;
}

export function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/icon/")
  );
}
