"use client";

import { useEffect, useState } from "react";
import { FAQ_ENTRIES, FAQ_FILTERS, type FaqFilter } from "@/lib/content";

type FilterValue = FaqFilter["value"];

const openFromHash = (setFilter: (value: FilterValue) => void) => {
  const id = window.location.hash.slice(1);
  if (!FAQ_ENTRIES.some((entry) => entry.id === id)) return;
  setFilter("toutes");
  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (!(target instanceof HTMLDetailsElement)) return;
    target.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};

export const FaqList = () => {
  const [filter, setFilter] = useState<FilterValue>("toutes");

  useEffect(() => {
    const handleHashChange = () => openFromHash(setFilter);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <div
        role="group"
        aria-label="Filtrer les questions"
        className="mt-8 flex gap-2"
      >
        {FAQ_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className="min-h-10 cursor-pointer border border-line px-4 text-[13.5px] font-semibold text-ink-soft transition-colors hover:border-navy hover:text-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-paper"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 border-t border-navy">
        {FAQ_ENTRIES.map(({ id, theme, question, answer }) => (
          <details
            key={id}
            id={id}
            hidden={filter !== "toutes" && filter !== theme}
            className="group scroll-mt-24 border-b border-line"
          >
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
    </>
  );
};
