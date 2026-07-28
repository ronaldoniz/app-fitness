import { getVerifiedUser } from "@/auth/session";
import { getProfile, listGoals, listWeighIns } from "@/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  createExportFilename,
  serializeFunctionalDataJson,
  serializeWeighingHistoryCsv,
} from "./serialization";

type ExportFormat = "csv" | "json";

function noStoreHeaders(): Record<string, string> {
  return {
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Language": "pt-BR",
    "X-Content-Type-Options": "nosniff",
  };
}

function exportErrorResponse(message: string, status: number): Response {
  return Response.json(
    { message },
    {
      status,
      headers: noStoreHeaders(),
    },
  );
}

export async function createExportDownloadResponse(
  format: ExportFormat,
): Promise<Response> {
  try {
    const client = await createServerSupabaseClient();
    const user = await getVerifiedUser(client);

    if (!user) {
      return exportErrorResponse(
        "Sua sessão expirou. Entre novamente para exportar os dados.",
        401,
      );
    }

    const [profile, weighings, goals] = await Promise.all([
      getProfile(client, user.id),
      listWeighIns(client, user.id),
      listGoals(client, user.id),
    ]);

    if (!profile) {
      return exportErrorResponse(
        "Conclua a configuração do perfil antes de exportar os dados.",
        409,
      );
    }

    const generatedAt = new Date();
    const filename = createExportFilename(format, generatedAt);
    const content =
      format === "json"
        ? serializeFunctionalDataJson(
            profile,
            weighings,
            goals,
            generatedAt,
          )
        : `\uFEFF${serializeWeighingHistoryCsv(profile, weighings)}`;

    return new Response(content, {
      status: 200,
      headers: {
        ...noStoreHeaders(),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type":
          format === "json"
            ? "application/json; charset=utf-8"
            : "text/csv; charset=utf-8",
      },
    });
  } catch {
    return exportErrorResponse(
      "Não foi possível preparar a exportação. Tente novamente.",
      500,
    );
  }
}
