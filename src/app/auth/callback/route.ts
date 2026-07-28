import { NextResponse, type NextRequest } from "next/server";

import { getSafeAuthDestination } from "@/auth/routing";
import {
  getAuthenticatedDestination,
  getVerifiedUser,
} from "@/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedDestination = getSafeAuthDestination(
    request.nextUrl.searchParams.get("next"),
  );

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?erro=link-invalido", request.url),
    );
  }

  const client = await createServerSupabaseClient();
  const { error } = await client.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?erro=link-expirado", request.url),
    );
  }

  if (requestedDestination === "/redefinir-senha") {
    return NextResponse.redirect(
      new URL(requestedDestination, request.url),
    );
  }

  const user = await getVerifiedUser(client);
  const destination = user
    ? await getAuthenticatedDestination(client, user.id)
    : "/login";

  return NextResponse.redirect(new URL(destination, request.url));
}
