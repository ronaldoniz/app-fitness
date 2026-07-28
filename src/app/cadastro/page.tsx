import type { Metadata } from "next";
import Link from "next/link";

import { redirectAuthenticatedUser } from "@/auth/guards";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegistrationForm } from "@/components/auth/registration-form";

export const metadata: Metadata = {
  title: "Criar conta",
};

export const dynamic = "force-dynamic";

export default async function RegistrationPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthShell
      description="Informe seus dados. O perfil funcional será criado somente depois do onboarding."
      title="Criar conta"
    >
      <RegistrationForm />
      <p className="mt-6 text-sm text-slate-400">
        Já possui uma conta?{" "}
        <Link className="text-emerald-300 hover:text-emerald-200" href="/login">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
