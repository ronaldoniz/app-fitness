import Link from "next/link";

export default function PrivateNotFound() {
  return (
    <main className="flex flex-1 items-center px-5 py-12 sm:px-8">
      <section className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
          Conteúdo não encontrado
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Este registro não está disponível.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Ele pode ter sido removido ou o endereço pode estar incorreto.
        </p>
        <Link
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          href="/dashboard"
        >
          Voltar ao Dashboard
        </Link>
      </section>
    </main>
  );
}
