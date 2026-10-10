"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  fetchWeeklyHours,
  saveWeeklyHours,
  type WeeklyHour,
} from "@/lib/admin-api";
import { useQuery } from "@/lib/use-query";
import { AdminButton } from "@/components/admin/admin-button";
import { TimeSelect } from "@/components/admin/time-select";
import type { Toast } from "@/components/admin/admin-toast";

const WEEKDAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 7, label: "Dimanche" },
];

const DEFAULT_RANGES = [
  { startsAt: "09:00", endsAt: "12:00" },
  { startsAt: "14:00", endsAt: "18:00" },
];

interface IndexedHour extends WeeklyHour {
  index: number;
}

interface WeeklyHoursEditorProps {
  notify: (tone: Toast["tone"], message: string) => void;
}

const hasInvalidRange = (ranges: WeeklyHour[]) =>
  ranges.some(
    (range, position) =>
      range.endsAt <= range.startsAt ||
      ranges.some(
        (other, otherPosition) =>
          otherPosition !== position &&
          range.startsAt < other.endsAt &&
          other.startsAt < range.endsAt,
      ),
  );

export const WeeklyHoursEditor = ({ notify }: WeeklyHoursEditorProps) => {
  const query = useQuery("weekly-hours", fetchWeeklyHours);
  const [draft, setDraft] = useState<WeeklyHour[] | null>(null);
  const [saving, setSaving] = useState(false);
  const hours = draft ?? query.data ?? [];
  const indexed: IndexedHour[] = hours.map((hour, index) => ({
    ...hour,
    index,
  }));
  const invalidDays = WEEKDAYS.filter(({ value }) =>
    hasInvalidRange(hours.filter(({ weekday }) => weekday === value)),
  ).map(({ value }) => value);

  const update = (index: number, patch: Partial<WeeklyHour>) =>
    setDraft(
      hours.map((hour, position) =>
        position === index ? { ...hour, ...patch } : hour,
      ),
    );

  const remove = (index: number) =>
    setDraft(hours.filter((_, position) => position !== index));

  const addRange = (weekday: number, ranges: WeeklyHour[]) => {
    const last = ranges[ranges.length - 1];
    const startsAt = last ? last.endsAt : "09:00";
    const endHour = Math.min(Number(startsAt.slice(0, 2)) + 2, 21);
    setDraft([
      ...hours,
      {
        weekday,
        startsAt,
        endsAt: `${String(endHour).padStart(2, "0")}:${startsAt.slice(3)}`,
      },
    ]);
  };

  const toggleDay = (weekday: number, open: boolean) =>
    setDraft(
      open
        ? [...hours, ...DEFAULT_RANGES.map((range) => ({ ...range, weekday }))]
        : hours.filter((hour) => hour.weekday !== weekday),
    );

  const save = async () => {
    setSaving(true);
    try {
      await saveWeeklyHours(hours);
      setDraft(null);
      query.reload();
      notify("success", "Horaires enregistrés");
    } catch {
      notify("error", "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  if (query.loading && !query.previous) {
    return <div className="h-80 animate-pulse bg-navy/5" />;
  }

  return (
    <section>
      <h2 className="border-b border-navy pb-2.5 font-serif text-xl text-navy">
        Horaires de la semaine
      </h2>
      <div>
        {WEEKDAYS.map(({ value, label }) => {
          const ranges = indexed
            .filter(({ weekday }) => weekday === value)
            .sort((left, right) => left.startsAt.localeCompare(right.startsAt));
          const open = ranges.length > 0;
          const invalid = invalidDays.includes(value);
          return (
            <div
              key={value}
              className="grid gap-3 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:items-start"
            >
              <label className="flex min-h-10 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={open}
                  onChange={(event) => toggleDay(value, event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="relative h-6 w-10 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-navy peer-focus-visible:outline-2 peer-focus-visible:outline-gold after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4"
                />
                <span
                  className={`font-semibold ${open ? "text-navy" : "text-ink-soft"}`}
                >
                  {label}
                </span>
              </label>
              {open ? (
                <div className="grid gap-2">
                  {ranges.map((range) => (
                    <div key={range.index} className="flex items-center gap-2">
                      <TimeSelect
                        label={`${label}, début`}
                        value={range.startsAt}
                        invalid={invalid}
                        onChange={(startsAt) =>
                          update(range.index, { startsAt })
                        }
                      />
                      <span className="text-ink-soft">–</span>
                      <TimeSelect
                        label={`${label}, fin`}
                        value={range.endsAt}
                        invalid={invalid}
                        onChange={(endsAt) => update(range.index, { endsAt })}
                      />
                      <button
                        type="button"
                        aria-label={`Supprimer la plage ${range.startsAt} – ${range.endsAt}`}
                        onClick={() => remove(range.index)}
                        className="grid size-10 cursor-pointer place-items-center text-ink-soft transition-colors hover:text-[#b4533c]"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {invalid ? (
                    <p className="text-[13px] text-[#b4533c]">
                      Plages incohérentes ou qui se chevauchent
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => addRange(value, ranges)}
                    className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 justify-self-start text-sm font-semibold text-navy hover:text-gold"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Ajouter une plage
                  </button>
                </div>
              ) : (
                <p className="flex min-h-10 items-center text-sm text-ink-soft/70">
                  Fermé
                </p>
              )}
            </div>
          );
        })}
      </div>
      {draft ? (
        <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-2 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:mx-0 md:px-0">
          <AdminButton variant="ghost" onClick={() => setDraft(null)}>
            Annuler
          </AdminButton>
          <AdminButton
            busy={saving}
            disabled={invalidDays.length > 0}
            onClick={save}
          >
            Enregistrer les horaires
          </AdminButton>
        </div>
      ) : null}
    </section>
  );
};
