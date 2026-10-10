import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { ConsultationFormatValue, SubjectId } from "@/lib/content";

export interface ContactDraft {
  subject: SubjectId;
  format: ConsultationFormatValue;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  availability: string[];
  website: string;
}

const CONTACT_ERRORS = [
  "too_many_requests",
  "invalid_request",
  "server_error",
  "not_configured",
] as const;

export type ContactError = (typeof CONTACT_ERRORS)[number];

export type ContactResult = { ok: true } | { ok: false; error: ContactError };

const isContactError = (value: unknown): value is ContactError =>
  CONTACT_ERRORS.some((code) => code === value);

export const readFunctionError = async (error: unknown) => {
  if (!(error instanceof FunctionsHttpError)) return null;
  const body: unknown = await error.context.json().catch(() => null);
  return body && typeof body === "object" && "error" in body
    ? body.error
    : null;
};

export const sendContactRequest = async (
  draft: ContactDraft,
): Promise<ContactResult> => {
  if (!supabase) return { ok: false, error: "not_configured" };
  const { error } = await supabase.functions.invoke("contact-request", {
    body: draft,
  });
  if (!error) return { ok: true };
  const code = await readFunctionError(error);
  return { ok: false, error: isContactError(code) ? code : "server_error" };
};
