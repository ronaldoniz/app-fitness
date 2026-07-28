import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { requireCompletedProfile } from "@/auth/guards";
import { GoalForm } from "@/components/goals/goal-form";
import { getGoal, getProfile, listWeighIns } from "@/data";
import { getCurrentWeighing } from "@/domain";
import { getGoalReferenceWeightKg } from "@/goals/goals";
import { isGoalId } from "@/goals/validation";

export const metadata: Metadata = {
  title: "Editar meta",
};

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { client, user } = await requireCompletedProfile();
  const { id } = await params;

  if (!isGoalId(id)) {
    notFound();
  }

  const [goal, profile, weighings] = await Promise.all([
    getGoal(client, user.id, id),
    getProfile(client, user.id),
    listWeighIns(client, user.id),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  if (!goal || goal.completedOn !== null) {
    notFound();
  }

  const currentWeighing = getCurrentWeighing(weighings);

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Planejamento
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
          Editar meta
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Alterar o alvo aplica novamente a regra de perda de peso.
        </p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <GoalForm
            goal={goal}
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
