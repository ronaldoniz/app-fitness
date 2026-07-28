import Link from "next/link";

import { logoutAction } from "@/auth/actions";
import { requireAuthenticatedUser } from "@/auth/guards";
import { PrivateNavigation } from "@/components/navigation/private-navigation";
import { getProfile } from "@/data";

export const dynamic = "force-dynamic";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { client, user } = await requireAuthenticatedUser();
  const profile = await getProfile(client, user.id);
  const themePreference = profile?.themePreference ?? "dark";

  return (
    <div
      className="private-theme flex min-h-screen min-w-0 flex-col transition-colors"
      data-theme={themePreference}
    >
      <header className="private-header border-b border-white/10 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              aria-label="Evolução Fitness — ir para o Dashboard"
              className="flex min-w-0 items-center gap-3"
              href="/dashboard"
            >
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-400 text-sm font-black text-slate-950"
              >
                EF
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block text-sm font-semibold text-white">
                  Evolução Fitness
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {user.email}
                </span>
              </span>
            </Link>

            <PrivateNavigation />

            <form action={logoutAction}>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                type="submit"
              >
                Sair
              </button>
            </form>
          </div>

          <PrivateNavigation mobile />
        </div>
      </header>
      <div
        className="flex min-w-0 flex-1 flex-col"
        id="conteudo-principal"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
