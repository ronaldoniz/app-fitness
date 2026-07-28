import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
};

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthShell
      description="A conta foi iniciada, mas ainda precisa ser confirmada."
      title="Verifique seu e-mail"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <p className="text-sm leading-6 text-slate-300">
          Enviamos uma mensagem de confirmação
          {email ? (
            <>
              {" "}
              para{" "}
              <strong className="break-anywhere font-semibold text-white">
                {email}
              </strong>
            </>
          ) : null}
          . Abra o link no mesmo navegador para continuar.
        </p>
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Já confirmou?{" "}
        <Link className="text-emerald-300 hover:text-emerald-200" href="/login">
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  );
}
