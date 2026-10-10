import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { RdvForm } from "@/components/rdv-form";
import { Reveal } from "@/components/motion/reveal";
import { TrackedLink } from "@/components/analytics/tracked-link";

const iconBoxClass =
  "grid size-10.5 shrink-0 place-items-center border border-white/14 text-gold-soft";

const channelLabelClass =
  "block text-[11px] font-bold uppercase tracking-[0.18em] text-mist";

const channelClass =
  "flex items-center gap-3.5 border-b border-white/14 py-4.5 transition-[padding] duration-300";

export const ContactSection = () => (
  <section id="contact" className="scroll-mt-16 bg-navy text-[#edf0f7]">
    <div className="mx-auto grid max-w-5xl gap-10 px-7 pt-18 md:grid-cols-[0.75fr_1.25fr] md:gap-14 md:pt-23 md:pb-23">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">
          Contact
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-balance text-white md:text-4xl">
          Prenons rendez-vous
        </h2>
        <div className="mt-7 border-t border-white/14">
          <TrackedLink
            href={CONTACT.phoneHref}
            event="appel_clic"
            properties={{ emplacement: "contact" }}
            className={`${channelClass} hover:pl-1.5`}
          >
            <span className={iconBoxClass}>
              <Phone className="size-4.5" aria-hidden="true" />
            </span>
            <span>
              <span className={channelLabelClass}>Téléphone</span>
              <span className="font-serif text-2xl text-white">
                {CONTACT.phone}
              </span>
            </span>
          </TrackedLink>
          <TrackedLink
            href={`mailto:${CONTACT.email}`}
            event="email_clic"
            properties={{ emplacement: "contact" }}
            className={`${channelClass} hover:pl-1.5`}
          >
            <span className={iconBoxClass}>
              <Mail className="size-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={channelLabelClass}>Email</span>
              <span className="break-all text-white">{CONTACT.email}</span>
            </span>
          </TrackedLink>
          <div className={channelClass}>
            <span className={iconBoxClass}>
              <MapPin className="size-4.5" aria-hidden="true" />
            </span>
            <span>
              <span className={channelLabelClass}>Rendez-vous</span>
              <span className="text-white">{CONTACT.address}</span>
            </span>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <RdvForm />
      </Reveal>
    </div>
  </section>
);
