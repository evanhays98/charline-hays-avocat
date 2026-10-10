"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import {
  CONSULTATION_FORMATS,
  SUBJECTS,
  type ConsultationFormatValue,
  type SubjectId,
} from "@/lib/content";
import { sendContactRequest, type ContactError } from "@/lib/booking-api";
import { formatAvailability } from "@/lib/dates";
import { selectSubject, useSelectedSubject } from "@/lib/subject-store";
import { trackEvent } from "@/lib/track";
import { SubjectPicker } from "@/components/rdv/subject-picker";
import { FormatPicker } from "@/components/rdv/format-picker";
import { AvailabilityPicker } from "@/components/rdv/availability-picker";
import { FloatingField } from "@/components/rdv/floating-field";
import { RdvRecap } from "@/components/rdv/rdv-recap";
import { RdvSuccess } from "@/components/rdv/rdv-success";
import { RdvAlert } from "@/components/rdv/rdv-alert";

type TextFieldName = "nom" | "email" | "tel" | "message";

type TextFields = Record<TextFieldName, string>;

type RequiredName = "objet" | "nom" | "email";

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent"; email: string; rows: RecapRow[] }
  | { status: "failed"; error: ContactError };

interface RecapRow {
  label: string;
  value: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY_FIELDS: TextFields = { nom: "", email: "", tel: "", message: "" };

const REQUIRED_ORDER: RequiredName[] = ["objet", "nom", "email"];

const SCROLL_TARGETS: Record<RequiredName, string> = {
  objet: "rdv-objet",
  nom: "nom",
  email: "email",
};

const FIELD_ERRORS = {
  nom: "Indiquez votre nom",
  email: "Email invalide — ex. prenom@exemple.fr",
};

const FAILURE_MESSAGES: Record<ContactError, string> = {
  too_many_requests: "Vous avez déjà des demandes en attente",
  invalid_request: "Certaines informations sont invalides",
  server_error: "L'envoi a échoué",
  not_configured: "L'envoi en ligne est momentanément indisponible",
};

const validate = (
  subject: SubjectId | null,
  fields: TextFields,
): Record<RequiredName, boolean> => ({
  objet: subject !== null,
  nom: fields.nom.trim().length > 1,
  email: EMAIL_PATTERN.test(fields.email.trim()),
});

const isSubjectId = (value: string | null): value is SubjectId =>
  SUBJECTS.some(({ id }) => id === value);

const labelOf = <T extends { label: string }>(
  items: T[],
  match: (item: T) => boolean,
) => items.find(match)?.label ?? null;

export const RdvForm = () => {
  const subject = useSelectedSubject();
  const [format, setFormat] = useState<ConsultationFormatValue>(
    CONSULTATION_FORMATS[0].value,
  );
  const [availability, setAvailability] = useState<string[]>([]);
  const [fields, setFields] = useState<TextFields>(EMPTY_FIELDS);
  const [touched, setTouched] = useState<RequiredName[]>([]);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("objet");
    if (isSubjectId(requested)) selectSubject(requested);
  }, []);
  const started = useRef(false);

  const validity = validate(subject, fields);
  const missing = REQUIRED_ORDER.filter((name) => !validity[name]);
  const showError = (name: RequiredName) =>
    touched.includes(name) && !validity[name];

  const subjectLabel = labelOf(SUBJECTS, ({ id }) => id === subject);
  const formatLabel =
    labelOf(CONSULTATION_FORMATS, ({ value }) => value === format) ?? format;
  const recapRows: RecapRow[] = [
    {
      label: "Objet",
      value: subjectLabel
        ? `${subjectLabel}${fields.nom.trim() ? ` · ${fields.nom.trim()}` : ""}`
        : null,
    },
    { label: "Format", value: formatLabel },
    {
      label: "Disponibilités",
      value:
        availability.length > 0
          ? formatAvailability(availability).join(" · ")
          : "Indifférent",
    },
  ];

  const handleFirstFocus = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("formulaire_demarre");
  };

  const touch = (name: RequiredName) => {
    if (touched.includes(name)) return;
    setTouched([...touched, name]);
  };

  const updateField = (name: TextFieldName) => (value: string) =>
    setFields({ ...fields, [name]: value });

  const blurField = (name: "nom" | "email") => () => {
    if (fields[name].trim()) touch(name);
  };

  const reset = () => {
    setAvailability([]);
    setFields(EMPTY_FIELDS);
    setTouched([]);
    selectSubject(null);
    setSubmit({ status: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submit.status === "sending") return;
    const [firstMissing] = missing;
    if (firstMissing || !subject) {
      setTouched(REQUIRED_ORDER);
      const target = document.getElementById(
        SCROLL_TARGETS[firstMissing ?? "objet"],
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target instanceof HTMLInputElement) target.focus();
      return;
    }

    setSubmit({ status: "sending" });
    const result = await sendContactRequest({
      subject,
      format,
      fullName: fields.nom.trim(),
      email: fields.email.trim(),
      phone: fields.tel.trim(),
      message: fields.message.trim(),
      availability,
      website: honeypot.current?.value ?? "",
    });

    if (result.ok) {
      trackEvent("formulaire_envoye", {
        objet: subject,
        format,
        telephone_renseigne: fields.tel.trim().length > 0,
        disponibilites: availability.length,
      });
      setSubmit({
        status: "sent",
        email: fields.email.trim(),
        rows: recapRows,
      });
      return;
    }

    trackEvent("formulaire_erreur", { erreur: result.error });
    setSubmit({ status: "failed", error: result.error });
  };

  const sending = submit.status === "sending";

  return (
    <div className="-mx-7 self-start bg-navy-deep px-7 py-8 md:mx-0 md:border md:border-white/14 md:p-9">
      {submit.status === "sent" ? (
        <RdvSuccess email={submit.email} rows={submit.rows} onReset={reset} />
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          onFocusCapture={handleFirstFocus}
          aria-busy={sending}
        >
          <h3 className="font-serif text-2xl font-medium text-white">
            Demande de rendez-vous
          </h3>

          <div className="mt-6.5 grid gap-6.5">
            <SubjectPicker
              value={subject}
              onChange={selectSubject}
              showError={showError("objet")}
            />
            <FormatPicker value={format} onChange={setFormat} />
            <AvailabilityPicker
              value={availability}
              onChange={setAvailability}
            />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <FloatingField
                id="nom"
                label="Nom et prénom"
                autoComplete="name"
                maxLength={120}
                value={fields.nom}
                onChange={updateField("nom")}
                onBlur={blurField("nom")}
                required={{
                  valid: validity.nom,
                  error: showError("nom") ? FIELD_ERRORS.nom : undefined,
                }}
              />
              <FloatingField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={fields.email}
                onChange={updateField("email")}
                onBlur={blurField("email")}
                required={{
                  valid: validity.email,
                  error: showError("email") ? FIELD_ERRORS.email : undefined,
                }}
              />
              <FloatingField
                id="tel"
                label="Téléphone"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                value={fields.tel}
                onChange={updateField("tel")}
                className="sm:col-span-2"
              />
              <FloatingField
                id="message"
                label="Précisions"
                multiline
                maxLength={1000}
                value={fields.message}
                onChange={updateField("message")}
                className="sm:col-span-2"
              />
            </div>
            <input
              ref={honeypot}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] size-px opacity-0"
            />
          </div>

          <RdvRecap rows={recapRows} />

          {submit.status === "failed" ? (
            <RdvAlert message={FAILURE_MESSAGES[submit.error]} />
          ) : null}

          <button
            type="submit"
            aria-disabled={missing.length > 0 || sending}
            className="mt-5 flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 bg-white px-6 text-[13px] font-bold uppercase tracking-[0.14em] text-navy transition-[background-color,opacity] hover:bg-gold-soft aria-disabled:cursor-not-allowed aria-disabled:opacity-55 aria-disabled:hover:bg-white"
          >
            {sending ? (
              <>
                <LoaderCircle
                  className="size-4.5 animate-spin"
                  aria-hidden="true"
                />
                Envoi…
              </>
            ) : (
              <>
                Envoyer ma demande
                {missing.length > 0 ? (
                  <span aria-hidden="true" className="flex gap-1">
                    {REQUIRED_ORDER.map((name) => (
                      <span
                        key={name}
                        className={`size-1.5 rounded-full bg-navy transition-opacity duration-300 ${
                          validity[name] ? "opacity-100" : "opacity-25"
                        }`}
                      />
                    ))}
                  </span>
                ) : (
                  <ArrowRight className="size-4.5" aria-hidden="true" />
                )}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
