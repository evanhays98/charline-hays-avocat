import { FAQ_ENTRIES } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";

export const FaqSection = () => (
  <section id="faq" className="scroll-mt-21 border-t border-line py-23">
    <div className="mx-auto max-w-5xl px-7">
      <SectionHeading
        eyebrow="Questions fréquentes"
        title="Vous vous demandez peut-être…"
      />
      <div className="mt-12">
        {FAQ_ENTRIES.map(({ question, answer }) => (
          <details
            key={question}
            className="group border-t border-line last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5.5 font-serif text-xl font-medium text-navy transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
              {question}
              <span className="shrink-0 font-sans text-2xl font-light text-gold transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-[15.5px] text-[#3a4256]">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
