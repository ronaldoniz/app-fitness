import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getSafeAuthDestination } from "@/auth/routing";
import {
  getAuthenticatedDestination,
  getVerifiedUser,
} from "@/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
]);

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && EMAIL_OTP_TYPES.has(value as EmailOtpType);
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const defaultDestination =
    type === "recovery" ? "/redefinir-senha" : "/onboarding";
  const requestedDestination = getSafeAuthDestination(
    request.nextUrl.searchParams.get("next"),
    defaultDestination,
  );

  if (!tokenHash || !isEmailOtpType(type)) {
    return NextResponse.redirect(
      new URL("/login?erro=link-invalido", request.url),
    );
  }

  const client = await createServerSupabaseClient();
  const { error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

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
