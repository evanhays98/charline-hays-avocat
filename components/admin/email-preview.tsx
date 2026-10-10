"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, MailX } from "lucide-react";
import { previewAdminCommand, type AdminCommand } from "@/lib/admin-api";
import { useQuery } from "@/lib/use-query";

interface EmailPreviewProps {
  command: AdminCommand;
  message: string;
}

const DEBOUNCE_MS = 500;

export const EmailPreview = ({ command, message }: EmailPreviewProps) => {
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState({ command, message });

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebounced({ command, message }),
      DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [command, message]);

  const query = useQuery(`preview:${JSON.stringify(debounced)}:${open}`, () =>
    open
      ? previewAdminCommand(debounced.command, debounced.message)
      : Promise.resolve(null),
  );
  const preview = query.data ?? query.previous;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-navy hover:text-gold"
      >
        {open ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
        {open ? "Masquer l'aperçu" : "Voir l'email"}
      </button>
      {open ? (
        <div className="mt-2 border-y border-line bg-[#f4f2ec] md:border">
          {preview?.email ? (
            <>
              <div className="grid gap-0.5 border-b border-line bg-white px-3.5 py-2.5 text-[13px]">
                <span className="text-ink-soft">
                  À :{" "}
                  <span className="font-semibold text-ink">
                    {preview.email.to}
                  </span>
                </span>
                <span className="font-semibold text-navy">
                  {preview.email.subject}
                </span>
              </div>
              <iframe
                title="Aperçu de l'email"
                srcDoc={preview.email.html}
                className={`block h-[34rem] w-full bg-[#f4f2ec] transition-opacity ${query.loading ? "opacity-60" : ""}`}
              />
            </>
          ) : query.loading ? (
            <div className="h-40 animate-pulse bg-navy/5" />
          ) : (
            <p className="flex items-center gap-2.5 px-4 py-5 text-sm text-ink-soft">
              <MailX className="size-4.5 text-gold" aria-hidden="true" />
              Aucun email : pas d&apos;adresse pour ce client
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};
