import { CONTACT } from "@/lib/content";
import { RdvForm } from "@/components/rdv-form";
import { Reveal } from "@/components/motion/reveal";
import { TrackedLink } from "@/components/analytics/tracked-link";

export const ContactSection = () => (
  <section id="contact" className="scroll-mt-21 bg-navy text-[#edf0f7]">
    <div className="mx-auto grid max-w-5xl gap-12 px-7 py-16 md:grid-cols-2 md:gap-18 md:py-23">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-soft">
          Contact
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-balance text-white md:text-4xl">
          Prenons rendez-vous
        </h2>
        <p className="mt-5 max-w-md text-[#c9d2e4]">
          Les consultations ont lieu sur rendez-vous, pris par téléphone ou
          par email.
        </p>
        <div className="mt-10 flex flex-col gap-6">
          <div>
            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Téléphone
            </span>
            <TrackedLink
              href={CONTACT.phoneHref}
              event="appel_clic"
              properties={{ emplacement: "contact" }}
              className="font-serif text-2xl text-white transition-colors hover:text-gold-soft"
            >
              {CONTACT.phone}
            </TrackedLink>
          </div>
          <div>
            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Email
            </span>
            <TrackedLink
              href={`mailto:${CONTACT.email}`}
              event="email_clic"
              properties={{ emplacement: "contact" }}
              className="text-white transition-colors hover:text-gold-soft"
            >
              {CONTACT.email}
            </TrackedLink>
          </div>
          <div>
            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Adresse
            </span>
            {CONTACT.address}
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <RdvForm />
      </Reveal>
    </div>
  </section>
);
