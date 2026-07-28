"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  href: string;
  label: string;
  mobileLabel: string;
  matches: (pathname: string) => boolean;
}

const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    mobileLabel: "Início",
    matches: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/pesagens/nova",
    label: "Registrar peso",
    mobileLabel: "Registrar",
    matches: (pathname) => pathname.startsWith("/pesagens/"),
  },
  {
    href: "/historico",
    label: "Histórico",
    mobileLabel: "Histórico",
    matches: (pathname) => pathname === "/historico",
  },
  {
    href: "/metas",
    label: "Metas",
    mobileLabel: "Metas",
    matches: (pathname) => pathname.startsWith("/metas"),
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    mobileLabel: "Ajustes",
    matches: (pathname) => pathname.startsWith("/configuracoes"),
  },
];

function navigationClassName(active: boolean, mobile: boolean): string {
  const base = mobile
    ? "inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl px-1 py-2 text-center text-[0.68rem] font-semibold transition"
    : "inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition";

  return active
    ? `${base} bg-emerald-300/10 text-emerald-200`
    : `${base} text-slate-300 hover:bg-white/[0.05] hover:text-white`;
}

export function PrivateNavigation({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className={
        mobile
          ? "mt-4 grid grid-cols-5 gap-1 lg:hidden"
          : "hidden items-center gap-1 lg:flex"
      }
    >
      {NAVIGATION_ITEMS.map((item) => {
        const active = item.matches(pathname);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            aria-label={mobile ? item.label : undefined}
            className={navigationClassName(active, mobile)}
            href={item.href}
            key={item.href}
          >
            {mobile ? item.mobileLabel : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
