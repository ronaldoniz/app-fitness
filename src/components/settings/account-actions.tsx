"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { logoutAction } from "@/auth/actions";
import { initialFormActionState } from "@/auth/form-state";
import { FormMessage } from "@/components/forms/form-message";
import { deleteAccountAction } from "@/settings/actions";

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white disabled:cursor-wait disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saindo…" : "Sair da conta"}
    </button>
  );
}

export function AccountActions() {
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteAccountAction,
    initialFormActionState,
  );

  return (
    <div className="grid gap-8">
      <section aria-labelledby="logout-title">
        <h2 className="text-xl font-semibold text-white" id="logout-title">
          Sessão
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Encerre o acesso neste dispositivo. Seus dados permanecem salvos.
        </p>
        <form action={logoutAction} className="mt-4">
          <LogoutButton />
        </form>
      </section>

      <section
        aria-labelledby="delete-account-title"
        className="rounded-2xl border border-red-400/20 bg-red-400/[0.055] p-5 sm:p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-200">
          Ação definitiva
        </p>
        <h2
          className="mt-2 text-xl font-semibold text-white"
          id="delete-account-title"
        >
          Excluir conta
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          A exclusão removerá permanentemente seu perfil, todas as pesagens e
          todas as metas. A sessão será encerrada e essa ação não poderá ser
          desfeita.
        </p>

        <form
          action={deleteAction}
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            if (
              !window.confirm(
                "Excluir definitivamente a conta e todos os dados associados?",
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <FormMessage state={deleteState} />
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Digite EXCLUIR para confirmar
            <input
              autoComplete="off"
              className="form-input"
              name="accountDeletionConfirmation"
              pattern="EXCLUIR"
              required
              type="text"
            />
          </label>
          <button
            className="theme-keep-white inline-flex min-h-11 items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-wait disabled:opacity-60 sm:w-fit"
            disabled={deletePending}
            type="submit"
          >
            {deletePending ? "Excluindo conta…" : "Excluir minha conta"}
          </button>
        </form>
      </section>
    </div>
  );
}
