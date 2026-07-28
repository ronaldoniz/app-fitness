import type { Metadata } from "next";

import { requireCompletedProfile } from "@/auth/guards";
import { WeighInForm } from "@/components/weigh-ins/weigh-in-form";
import { formatLocalCivilDate } from "@/domain";

export const metadata: Metadata = {
  title: "Registrar pesagem",
};

export default async function NewWeighInPage() {
  await requireCompletedProfile();

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Evolução
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
          Registrar pesagem
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Informe o peso do dia. A nova referência atualizará os indicadores
          e reavaliará a meta ativa.
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <WeighInForm today={formatLocalCivilDate(new Date())} />
        </section>
      </div>
    </main>
  );
}
