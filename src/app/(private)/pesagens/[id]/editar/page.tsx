import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import { WeighInForm } from "@/components/weigh-ins/weigh-in-form";
import { getWeighIn } from "@/data";
import { formatLocalCivilDate } from "@/domain";
import { isWeighInId } from "@/weigh-ins/validation";

export const metadata: Metadata = {
  title: "Editar pesagem",
};

export default async function EditWeighInPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ retorno?: string | string[] }>;
}) {
  const { client, user } = await requireCompletedProfile();
  const { id } = await params;
  const requestedReturn = (await searchParams).retorno;
  const returnTo =
    requestedReturn === "historico" ? "/historico" : "/dashboard";

  if (!isWeighInId(id)) {
    notFound();
  }

  const weighing = await getWeighIn(client, user.id, id);

  if (!weighing) {
    notFound();
  }

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Evolução
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
          Editar pesagem
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          As mesmas validações do registro são aplicadas. Ao salvar, os
          indicadores e a meta ativa serão reavaliados.
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <WeighInForm
            returnTo={returnTo}
            today={formatLocalCivilDate(new Date())}
            weighing={weighing}
          />
        </section>
      </div>
    </main>
  );
}
