import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import { GoalForm } from "@/components/goals/goal-form";
import { getProfile, listWeighIns } from "@/data";
import { getCurrentWeighing } from "@/domain";
import { getGoalReferenceWeightKg } from "@/goals/goals";

export const metadata: Metadata = {
  title: "Criar meta",
};

export default async function NewGoalPage() {
  const { client, user } = await requireCompletedProfile();
  const [profile, weighings] = await Promise.all([
    getProfile(client, user.id),
    listWeighIns(client, user.id),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  const currentWeighing = getCurrentWeighing(weighings);

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Planejamento
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
          Criar meta
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          A versão atual aceita apenas metas de perda de peso.
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <GoalForm
            referenceLabel={
              currentWeighing
                ? "o peso atual"
                : "o peso inicial informado"
            }
            referenceWeightKg={getGoalReferenceWeightKg(
              profile,
              weighings,
            )}
          />
        </section>
      </div>
    </main>
  );
}
