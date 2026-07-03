import Link from "next/link";

export interface LegalBlock {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  blocks: LegalBlock[];
}

export const LegalPage = ({ title, blocks }: LegalPageProps) => (
  <>
    <nav className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-7">
        <Link href="/" className="font-serif text-xl tracking-wide text-navy">
          Charline Hays
        </Link>
        <Link
          href="/"
          className="text-sm text-ink transition-colors hover:text-gold"
        >
          ← Retour au site
        </Link>
      </div>
    </nav>
    <main className="mx-auto max-w-3xl px-7 py-16">
      <h1 className="font-serif text-4xl font-medium text-balance text-navy">
        {title}
      </h1>
      <div className="mt-10 flex flex-col gap-8">
        {blocks.map(({ heading, paragraphs }) => (
          <section key={heading}>
            <h2 className="font-serif text-2xl font-medium text-navy">
              {heading}
            </h2>
            <div className="mt-3 flex flex-col gap-3 text-[15.5px] text-ink-soft">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  </>
);
