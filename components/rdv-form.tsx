"use client";

import { useRef, type FormEvent } from "react";
import { CONTACT } from "@/lib/content";
import { trackEvent } from "@/lib/track";

interface RdvFormValues {
  nom: string;
  email: string;
  tel: string;
  message: string;
}

const buildMailtoHref = ({ nom, email, tel, message }: RdvFormValues) => {
  const subject = encodeURIComponent(`Demande de rendez-vous — ${nom}`);
  const telLine = tel ? `\nTéléphone : ${tel}` : "";
  const body = encodeURIComponent(
    `Nom : ${nom}\nEmail : ${email}${telLine}\n\n${message}`,
  );
  return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
};

const readFormValues = (form: HTMLFormElement): RdvFormValues => {
  const data = new FormData(form);
  return {
    nom: String(data.get("nom") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    tel: String(data.get("tel") ?? "").trim(),
    message: String(data.get("message") ?? "").trim(),
  };
};

const fieldClass =
  "w-full border border-white/15 bg-white/5 px-3.5 py-3 text-[15px] text-white transition-colors focus:border-gold-soft focus:outline-none";

const labelClass =
  "mt-4.5 mb-1.5 block text-[11.5px] uppercase tracking-[0.16em] text-mist first:mt-0";

export const RdvForm = () => {
  const started = useRef(false);

  const handleStart = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("formulaire_demarre");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = readFormValues(event.currentTarget);
    trackEvent("formulaire_envoye", {
      telephone_renseigne: values.tel.length > 0,
    });
    window.location.href = buildMailtoHref(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onInput={handleStart}
      className="self-start border border-white/15 p-9"
    >
      <h3 className="mb-6 font-serif text-2xl font-medium text-white">
        Demande de rendez-vous
      </h3>
      <label htmlFor="rdv-nom" className={labelClass}>
        Nom
      </label>
      <input
        id="rdv-nom"
        name="nom"
        type="text"
        autoComplete="name"
        required
        className={fieldClass}
      />
      <label htmlFor="rdv-email" className={labelClass}>
        Email
      </label>
      <input
        id="rdv-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className={fieldClass}
      />
      <label htmlFor="rdv-tel" className={labelClass}>
        Téléphone
      </label>
      <input
        id="rdv-tel"
        name="tel"
        type="tel"
        autoComplete="tel"
        className={fieldClass}
      />
      <label htmlFor="rdv-message" className={labelClass}>
        Votre situation, en quelques mots
      </label>
      <textarea
        id="rdv-message"
        name="message"
        required
        className={`${fieldClass} min-h-28 resize-y`}
      />
      <button
        type="submit"
        className="mt-6.5 w-full cursor-pointer bg-white px-6 py-4 text-[13.5px] font-semibold uppercase tracking-widest text-navy transition-colors hover:bg-gold-soft"
      >
        Envoyer ma demande
      </button>
      <p className="mt-3.5 text-[12.5px] text-mist">
        Ce formulaire ouvre simplement votre messagerie — aucune donnée n'est
        stockée sur ce site.
      </p>
    </form>
  );
};
