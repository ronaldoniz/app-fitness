"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="flex min-h-screen items-center px-5 py-12 sm:px-8"
      id="conteudo-principal"
      tabIndex={-1}
    >
      <section className="mx-auto w-full max-w-xl rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-200">
          Serviço indisponível
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Não foi possível carregar esta página.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Verifique sua conexão e tente novamente.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            onClick={() => unstable_retry()}
            type="button"
          >
            Tentar novamente
          </button>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
            href="/login"
          >
            Ir para o login
          </Link>
        </div>
      </section>
    </main>
  );
}
