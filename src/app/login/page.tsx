import type { Metadata } from "next";
import Link from "next/link";

import { redirectAuthenticatedUser } from "@/auth/guards";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  "link-expirado":
    "O link expirou ou já foi utilizado. Solicite uma nova mensagem.",
  "link-invalido": "O link de autenticação é inválido.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    conta?: string;
    erro?: string;
    senha?: string;
  }>;
}) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const errorFeedback = params.erro && ERROR_MESSAGES[params.erro];
  const successFeedback =
    params.conta === "excluida"
      ? "Conta e dados associados excluídos."
      : params.senha === "atualizada"
      ? "Senha atualizada. Entre com a nova credencial."
      : null;

  return (
    <AuthShell
      description="Use o e-mail e a senha da sua conta."
      title="Entrar"
    >
      {errorFeedback || successFeedback ? (
        <p
          className={
            errorFeedback
              ? "mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-100"
              : "mb-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-100"
          }
          role={errorFeedback ? "alert" : "status"}
        >
          {errorFeedback || successFeedback}
        </p>
      ) : null}
      <LoginForm />
      <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-emerald-300 hover:text-emerald-200" href="/cadastro">
          Criar uma conta
        </Link>
        <Link
          className="text-slate-300 hover:text-white"
          href="/recuperar-senha"
        >
          Esqueci minha senha
        </Link>
      </div>
    </AuthShell>
  );
}
