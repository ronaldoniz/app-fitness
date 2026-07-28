"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import type { Profile, ThemePreference } from "@/domain";
import { updateProfileSettingsAction } from "@/settings/actions";

export function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<ThemePreference>(
    profile.themePreference,
  );
  const submittedTheme = useRef(profile.themePreference);
  const [state, action] = useActionState(
    updateProfileSettingsAction,
    initialFormActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      document
        .querySelector<HTMLElement>(".private-theme")
        ?.setAttribute("data-theme", submittedTheme.current);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form
      action={action}
      className="grid gap-6"
      onSubmit={() => {
        submittedTheme.current = selectedTheme;
      }}
    >
      <FormMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-200 sm:col-span-2">
          Nome
          <input
            autoComplete="name"
            className="form-input"
            defaultValue={profile.name}
            name="name"
            required
            type="text"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Altura em centímetros
          <input
            className="form-input"
            defaultValue={profile.heightCm}
            inputMode="decimal"
            min="0.1"
            name="heightCm"
            required
            step="0.1"
            type="number"
          />
          <span className="text-xs font-normal leading-5 text-slate-500">
            Os IMCs exibidos serão recalculados usando essa altura.
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Peso inicial informado em quilogramas
          <input
            className="form-input"
            defaultValue={profile.initialWeightKg}
            inputMode="decimal"
            min="0.1"
            name="initialWeightKg"
            required
            step="0.1"
            type="number"
          />
          <span className="text-xs font-normal leading-5 text-slate-500">
            A alteração atualiza indicadores de comparação, mas não modifica
            nenhuma pesagem registrada.
          </span>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Preferência de tema
        <select
          className="form-input"
          name="themePreference"
          onChange={(event) => {
            setSelectedTheme(event.currentTarget.value as ThemePreference);
          }}
          required
          value={selectedTheme}
        >
          <option value="dark">Escuro</option>
          <option value="light">Claro</option>
          <option value="system">Seguir sistema operacional</option>
        </select>
        <span className="text-xs font-normal leading-5 text-slate-500">
          O tema escuro permanece como padrão para novos perfis.
        </span>
      </label>

      <div className="sm:max-w-64">
        <SubmitButton pendingLabel="Salvando…">
          Salvar configurações
        </SubmitButton>
      </div>
    </form>
  );
}
