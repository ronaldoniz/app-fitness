export default function SettingsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Carregando configurações"
      className="flex-1 px-5 py-8 sm:px-8 sm:py-12"
    >
      <div className="mx-auto w-full max-w-4xl animate-pulse">
        <div className="h-4 w-36 rounded bg-slate-800" />
        <div className="mt-4 h-10 w-64 rounded bg-slate-800" />
        <div className="mt-10 h-96 rounded-2xl bg-white/[0.04]" />
        <div className="mt-8 h-80 rounded-2xl bg-white/[0.04]" />
      </div>
    </main>
  );
}
