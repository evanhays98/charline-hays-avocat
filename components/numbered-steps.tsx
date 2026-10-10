import type { ProcessStep } from "@/lib/content";

interface NumberedStepsProps {
  steps: ProcessStep[];
}

export const NumberedSteps = ({ steps }: NumberedStepsProps) => (
  <ol className="grid lg:grid-cols-4 lg:gap-10">
    {steps.map(({ title, description }, index) => (
      <li
        key={title}
        className="group relative pb-7 pl-10 last:pb-0 lg:border-t-2 lg:border-gold lg:pt-3.5 lg:pb-0 lg:pl-0"
      >
        <span className="absolute top-8 bottom-1 left-2.5 w-px bg-line group-last:hidden lg:hidden" />
        <span className="absolute top-0 left-0 font-serif text-lg leading-none text-gold lg:static lg:block lg:text-2xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-navy lg:mt-2.5">
          {title}
        </h3>
        <p className="mt-1.5 text-[14.5px] text-ink-soft">{description}</p>
      </li>
    ))}
  </ol>
);
