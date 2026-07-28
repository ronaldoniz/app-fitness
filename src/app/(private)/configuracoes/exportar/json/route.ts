import { createExportDownloadResponse } from "@/exporting/download";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return createExportDownloadResponse("json");
}
