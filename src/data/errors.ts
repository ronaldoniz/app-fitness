import type { PostgrestError } from "@supabase/supabase-js";

export class DataAccessError extends Error {
  readonly code: string;
  readonly details: string;
  readonly hint: string;

  constructor(operation: string, error: PostgrestError) {
    super(`Falha ao ${operation}: ${error.message}`);
    this.name = "DataAccessError";
    this.code = error.code;
    this.details = error.details;
    this.hint = error.hint;
    this.cause = error;
  }
}

export function throwDataAccessError(
  operation: string,
  error: PostgrestError | null,
): asserts error is null {
  if (error) {
    throw new DataAccessError(operation, error);
  }
}
