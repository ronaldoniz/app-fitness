export interface SupabasePublicEnvironment {
  url: string;
  anonKey: string;
}

type PublicEnvironment = {
  [key: string]: string | undefined;
};

export function readSupabasePublicEnvironment(
  environment: PublicEnvironment = process.env,
): SupabasePublicEnvironment {
  const url = environment.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  const missingVariables = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ].filter(Boolean);

  if (missingVariables.length > 0) {
    throw new Error(
      `Variáveis de ambiente do Supabase ausentes: ${missingVariables.join(", ")}.`,
    );
  }

  return {
    url: url as string,
    anonKey: anonKey as string,
  };
}
