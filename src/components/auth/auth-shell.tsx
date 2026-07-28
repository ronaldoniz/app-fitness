import Link from "next/link";

export function AuthShell({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main
      className="min-h-screen min-w-0 px-5 py-8 sm:px-8 lg:grid lg:place-items-center lg:py-12"
      id="conteudo-principal"
      tabIndex={-1}
    >
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/55 shadow-2xl shadow-black/20 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="flex flex-col justify-between border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_55%)] p-7 lg:min-h-[650px] lg:border-r lg:border-b-0 lg:p-10">
          <Link className="flex w-fit items-center gap-3" href="/">
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950"
            >
              EF
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">
                Evolução Fitness
              </span>
              <span className="block text-xs text-slate-400">
                Acompanhamento privado
              </span>
            </span>
          </Link>

          <div className="mt-12 max-w-sm lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Seus dados, sua evolução
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">
              Registre fatos. Acompanhe mudanças.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Histórico, indicadores e metas reunidos em uma experiência
              objetiva, privada e voltada à perda de peso.
            </p>
          </div>

          <p className="mt-12 text-xs leading-5 text-slate-400">
            Indicadores são referências gerais e não substituem avaliação
            profissional.
          </p>
        </aside>

        <section className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full">
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {description}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
