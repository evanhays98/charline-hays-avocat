interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
}

export const SectionHeading = ({
  eyebrow,
  title,
  intro,
}: SectionHeadingProps) => (
  <div className="max-w-xl">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
      {eyebrow}
    </p>
    <h2 className="mt-3 font-serif text-3xl font-medium text-balance text-navy md:text-4xl">
      {title}
    </h2>
    {intro ? <p className="mt-5 text-ink-soft">{intro}</p> : null}
  </div>
);
