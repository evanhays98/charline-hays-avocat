import type { QuestionAnswer } from "@/lib/content";

interface FaqAccordionProps {
  entries: QuestionAnswer[];
}

export const FaqAccordion = ({ entries }: FaqAccordionProps) => (
  <div className="border-t border-navy">
    {entries.map(({ question, answer }) => (
      <details key={question} className="group border-b border-line">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-serif text-lg font-medium text-navy md:text-xl [&::-webkit-details-marker]:hidden">
          {question}
          <span
            aria-hidden="true"
            className="relative size-7 shrink-0 border border-line transition-colors duration-300 group-open:border-navy group-open:bg-navy"
          >
            <span className="absolute top-1/2 left-1/2 h-[1.5px] w-2.5 -translate-1/2 bg-navy group-open:bg-paper" />
            <span className="absolute top-1/2 left-1/2 h-[1.5px] w-2.5 -translate-1/2 rotate-90 bg-navy transition-transform duration-300 group-open:rotate-0 group-open:bg-paper" />
          </span>
        </summary>
        <p className="max-w-2xl pr-12 pb-5.5 text-[15.5px] text-[#3a4256]">
          {answer}
        </p>
      </details>
    ))}
  </div>
);
