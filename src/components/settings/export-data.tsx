"use client";

import { useState } from "react";

type ExportFormat = "csv" | "json";

type ExportState =
  | { status: "idle"; message: "" }
  | {
      status: "loading" | "success" | "error";
      format: ExportFormat;
      message: string;
    };

const INITIAL_STATE: ExportState = {
  status: "idle",
  message: "",
};

function getDownloadFilename(
  response: Response,
  format: ExportFormat,
): string {
  const contentDisposition = response.headers.get("content-disposition");
  const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/);

  return (
    filenameMatch?.[1] ??
    (format === "json"
      ? "evolucao-fitness-dados-completos.json"
      : "evolucao-fitness-historico-pesagens.csv")
  );
}

async function getErrorMessage(response: Response): Promise<string> {
  if (response.redirected) {
    return "Sua sessão expirou. Entre novamente para exportar os dados.";
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    const payload: unknown = await response.json();

    if (
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
    ) {
      return payload.message;
    }
  }

  return "Não foi possível preparar a exportação. Tente novamente.";
}

export function ExportData() {
  const [state, setState] = useState<ExportState>(INITIAL_STATE);
  const isLoading = state.status === "loading";

  async function download(format: ExportFormat): Promise<void> {
    setState({
      status: "loading",
      format,
      message: `Preparando arquivo ${format.toUpperCase()}…`,
    });

    try {
      const response = await fetch(
        `/configuracoes/exportar/${format}`,
        {
          cache: "no-store",
          credentials: "same-origin",
        },
      );

      if (!response.ok || response.redirected) {
        throw new Error(await getErrorMessage(response));
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = getDownloadFilename(response, format);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

      setState({
        status: "success",
        format,
        message: `Arquivo ${format.toUpperCase()} preparado para download.`,
      });
    } catch (error) {
      setState({
        status: "error",
        format,
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível preparar a exportação. Tente novamente.",
      });
    }
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Dados completos
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">JSON</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Perfil funcional, pesagens e metas, com metadados de data, unidades
            e formato. Não inclui credenciais nem tokens.
          </p>
          <button
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            onClick={() => void download("json")}
            type="button"
          >
            {isLoading && state.format === "json"
              ? "Preparando JSON…"
              : "Baixar JSON completo"}
          </button>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">
            Histórico tabular
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">CSV</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Somente pesagens, com data civil, medidas, observação, IMC,
            variação e total perdido. Cabeçalhos indicam as unidades.
          </p>
          <button
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            onClick={() => void download("csv")}
            type="button"
          >
            {isLoading && state.format === "csv"
              ? "Preparando CSV…"
              : "Baixar histórico CSV"}
          </button>
        </article>
      </div>

      {state.status !== "idle" ? (
        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-100"
              : state.status === "success"
                ? "rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-100"
                : "rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-slate-300"
          }
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
