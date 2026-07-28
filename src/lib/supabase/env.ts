export interface SupabasePublicEnvironment {
  url: string;
  publishableKey: string;
}

type PublicEnvironment = {
  [key: string]: string | undefined;
};

export function readSupabasePublicEnvironment(
  environment: PublicEnvironment = process.env,
): SupabasePublicEnvironment {
  const url = environment.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  const missingVariables = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !publishableKey && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean);

  if (missingVariables.length > 0) {
    throw new Error(
      `Variáveis de ambiente do Supabase ausentes: ${missingVariables.join(", ")}.`,
    );
  }

  return {
    url: url as string,
    publishableKey: publishableKey as string,
  };
}
