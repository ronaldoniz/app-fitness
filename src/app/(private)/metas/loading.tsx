export default function GoalsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Carregando metas"
      className="flex-1 px-5 py-8 sm:px-8 sm:py-12"
    >
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="h-4 w-24 rounded bg-slate-800" />
        <div className="mt-4 h-10 w-64 rounded bg-slate-800" />
        <div className="mt-10 grid gap-5">
          <div className="h-44 rounded-2xl bg-white/[0.04]" />
          <div className="h-64 rounded-2xl bg-white/[0.04]" />
          <div className="h-44 rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    </main>
  );
}
