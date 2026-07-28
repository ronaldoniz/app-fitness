"use client";

import { useActionState } from "react";

import { initialFormActionState } from "@/auth/form-state";
import {
  deleteWeighInAction,
  type WeighInReturnPath,
} from "@/weigh-ins/actions";

export function DeleteWeighInForm({
  returnTo = "/dashboard",
  weighInId,
}: {
  returnTo?: WeighInReturnPath;
  weighInId: string;
}) {
  const deleteAction = deleteWeighInAction.bind(
    null,
    weighInId,
    returnTo,
  );
  const [state, action, pending] = useActionState(
    deleteAction,
    initialFormActionState,
  );

  return (
    <form
      action={action}
      className="grid justify-items-end gap-2"
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Excluir esta pesagem? Os indicadores serão recalculados.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        className="inline-flex min-h-11 items-center rounded-lg px-2 text-xs font-semibold text-red-300 transition hover:bg-red-300/10 hover:text-red-200 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Excluindo…" : "Excluir"}
      </button>
      {state.status === "error" ? (
        <span
          aria-live="polite"
          className="max-w-56 text-right text-xs leading-5 text-red-200"
          role="alert"
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
