export default function PrivateLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Carregando conteúdo"
      className="flex-1 px-5 py-8 sm:px-8 sm:py-12"
    >
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="h-4 w-28 rounded bg-slate-800" />
        <div className="mt-4 h-10 w-full max-w-80 rounded bg-slate-800" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-800" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-36 rounded-2xl bg-white/[0.04]" />
          <div className="h-36 rounded-2xl bg-white/[0.04]" />
          <div className="h-36 rounded-2xl bg-white/[0.04]" />
          <div className="h-36 rounded-2xl bg-white/[0.04]" />
        </div>
        <p className="sr-only" role="status">
          Carregando. Aguarde.
        </p>
      </div>
    </main>
  );
}
