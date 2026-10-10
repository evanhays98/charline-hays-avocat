import { CalendarDays, Phone } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { TrackedLink } from "@/components/analytics/tracked-link";

interface ContactActionsProps {
  subject?: string;
  placement: string;
}

const buttonBase =
  "inline-flex min-h-13 items-center justify-center gap-2.5 px-5.5 text-[12.5px] font-bold uppercase tracking-[0.14em] transition-colors";

export const ContactActions = ({ subject, placement }: ContactActionsProps) => (
  <div className="mt-8 flex flex-wrap gap-3">
    <TrackedLink
      href={subject ? `/?objet=${subject}#contact` : "/#contact"}
      event="rdv_cta_clic"
      properties={{ emplacement: placement }}
      className={`${buttonBase} bg-white text-navy hover:bg-gold-soft`}
    >
      <CalendarDays className="size-4.5" aria-hidden="true" />
      Demander un rendez-vous
    </TrackedLink>
    <TrackedLink
      href={CONTACT.phoneHref}
      event="appel_clic"
      properties={{ emplacement: placement }}
      className={`${buttonBase} border border-white/40 text-white hover:border-gold-soft hover:text-gold-soft`}
    >
      <Phone className="size-4.5" aria-hidden="true" />
      {CONTACT.phone}
    </TrackedLink>
  </div>
);
