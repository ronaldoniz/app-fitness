import type { Metadata } from "next";

import { requirePendingOnboarding } from "@/auth/guards";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const metadata: Metadata = {
  title: "Configurar perfil",
};

export default async function OnboardingPage() {
  const { user } = await requirePendingOnboarding();
  const metadataName =
    typeof user.user_metadata.name === "string"
      ? user.user_metadata.name
      : "";

  return (
    <main className="flex flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="self-start lg:sticky lg:top-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Primeiro acesso
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
            Configure sua referência inicial.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
            Confirme seu nome, informe altura e peso inicial e defina a primeira
            meta. O perfil só será criado quando você concluir esta etapa.
          </p>
          <div className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-5 text-sm leading-6 text-slate-300">
            O tema escuro será aplicado como padrão. Você poderá alterar essa
            preferência posteriormente nas configurações.
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/55 p-6 shadow-xl shadow-black/15 sm:p-8">
          <OnboardingForm defaultName={metadataName} />
        </section>
      </div>
    </main>
  );
}
