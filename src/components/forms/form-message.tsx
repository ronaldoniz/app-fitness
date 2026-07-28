import type { FormActionState } from "@/auth/form-state";

export function FormMessage({ state }: { state: FormActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const isError = state.status === "error";

  return (
    <p
      aria-live="polite"
      className={
        isError
          ? "rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-100"
          : "rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-100"
      }
      role={isError ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}
