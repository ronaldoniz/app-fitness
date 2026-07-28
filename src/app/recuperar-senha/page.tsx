import type { Metadata } from "next";
import Link from "next/link";

import { redirectAuthenticatedUser } from "@/auth/guards";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
};

export const dynamic = "force-dynamic";

export default async function PasswordRecoveryPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthShell
      description="Informe seu e-mail para receber as instruções de redefinição."
      title="Recuperar senha"
    >
      <PasswordRecoveryForm />
      <p className="mt-6 text-sm text-slate-400">
        Lembrou a senha?{" "}
        <Link className="text-emerald-300 hover:text-emerald-200" href="/login">
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  );
}
