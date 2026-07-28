import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import { AccountActions } from "@/components/settings/account-actions";
import { ExportData } from "@/components/settings/export-data";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { getProfile } from "@/data";

export const metadata: Metadata = {
  title: "Configurações",
};

export default async function SettingsPage() {
  const { client, user } = await requireCompletedProfile();
  const profile = await getProfile(client, user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <main className="min-w-0 flex-1 overflow-x-clip px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Preferências e conta
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
          Configurações
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          Atualize os dados usados nos cálculos e escolha como a interface deve
          ser exibida.
        </p>

        <section
          aria-labelledby="profile-settings-title"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7"
        >
          <div className="mb-6 border-b border-white/10 pb-5">
            <h2
              className="text-xl font-semibold text-white"
              id="profile-settings-title"
            >
              Perfil e aparência
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              O e-mail da conta não é alterado por este formulário.
            </p>
          </div>
          <ProfileSettingsForm profile={profile} />
        </section>

        <section
          aria-labelledby="export-settings-title"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7"
        >
          <div className="mb-6 border-b border-white/10 pb-5">
            <h2
              className="text-xl font-semibold text-white"
              id="export-settings-title"
            >
              Exportar dados
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Gere uma cópia dos seus dados funcionais nos formatos definidos
              para a versão 1.0.
            </p>
          </div>
          <ExportData />
        </section>

        <section
          aria-labelledby="account-settings-title"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7"
        >
          <h2
            className="sr-only"
            id="account-settings-title"
          >
            Ações da conta
          </h2>
          <AccountActions />
        </section>
      </div>
    </main>
  );
}
