"use client";

import { useState } from "react";
import { CalendarOff, Trash2 } from "lucide-react";
import {
  addTimeOff,
  deleteTimeOff,
  fetchTimeOff,
  type TimeOff,
} from "@/lib/admin-api";
import { formatShortDate, formatTime } from "@/lib/dates";
import { useQuery } from "@/lib/use-query";
import { useTodayIso } from "@/lib/use-today";
import { AdminButton } from "@/components/admin/admin-button";
import { AdminSegmented } from "@/components/admin/admin-segmented";
import { TimeSelect } from "@/components/admin/time-select";
import {
  RangeCalendar,
  type DateRange,
} from "@/components/admin/range-calendar";
import type { Toast } from "@/components/admin/admin-toast";

type Span = "journee" | "plage";

const SPANS: { value: Span; label: string }[] = [
  { value: "journee", label: "Journée entière" },
  { value: "plage", label: "Plage horaire" },
];

interface TimeOffEditorProps {
  notify: (tone: Toast["tone"], message: string) => void;
}

const describe = ({ startsAt, endsAt }: TimeOff) => {
  const allDay =
    formatTime(startsAt) === "00:00" && formatTime(endsAt) === "00:00";
  const lastDay = new Date(new Date(endsAt).getTime() - (allDay ? 1 : 0));
  const sameDay =
    formatShortDate(startsAt) === formatShortDate(lastDay.toISOString());
  if (allDay && sameDay) return formatShortDate(startsAt);
  if (allDay)
    return `${formatShortDate(startsAt)} → ${formatShortDate(lastDay.toISOString())}`;
  if (sameDay)
    return `${formatShortDate(startsAt)} · ${formatTime(startsAt)} – ${formatTime(endsAt)}`;
  return `${formatShortDate(startsAt)} ${formatTime(startsAt)} → ${formatShortDate(endsAt)} ${formatTime(endsAt)}`;
};

export const TimeOffEditor = ({ notify }: TimeOffEditorProps) => {
  const todayIso = useTodayIso();
  const query = useQuery("time-off", fetchTimeOff);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [span, setSpan] = useState<Span>("journee");
  const [fromTime, setFromTime] = useState("14:00");
  const [toTime, setToTime] = useState("16:00");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const singleDay =
    range.start !== null && (range.end === null || range.end === range.start);
  const partial = singleDay && span === "plage";
  const invalidHours = partial && toTime <= fromTime;
  const items = query.data ?? query.previous ?? [];

  const add = async () => {
    if (!range.start || invalidHours) return;
    setSaving(true);
    try {
      await addTimeOff({
        firstDay: range.start,
        lastDay: range.end ?? range.start,
        fromTime: partial ? fromTime : null,
        toTime: partial ? toTime : null,
        label: label.trim(),
      });
      setRange({ start: null, end: null });
      setLabel("");
      query.reload();
      notify("success", "Absence ajoutée");
    } catch {
      notify("error", "Ajout impossible");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTimeOff(id);
      query.reload();
      notify("success", "Absence supprimée");
    } catch {
      notify("error", "Suppression impossible");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <h2 className="border-b border-navy pb-2.5 font-serif text-xl text-navy">
        Absences
      </h2>

      {items.length === 0 && !query.loading ? (
        <p className="flex items-center gap-3 border-b border-line py-5 text-[15px] text-ink-soft">
          <CalendarOff className="size-5 text-gold" aria-hidden="true" />
          Aucune absence prévue
        </p>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 border-b border-line py-3"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-navy first-letter:uppercase">
                  {describe(item)}
                </span>
                {item.label ? (
                  <span className="block truncate text-sm text-ink-soft">
                    {item.label}
                  </span>
                ) : null}
              </span>
              <AdminButton
                variant="ghost"
                busy={deletingId === item.id}
                aria-label={`Supprimer l'absence ${describe(item)}`}
                onClick={() => remove(item.id)}
                icon={<Trash2 className="size-4" aria-hidden="true" />}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 grid gap-4">
        {todayIso ? (
          <RangeCalendar value={range} onChange={setRange} minDate={todayIso} />
        ) : null}
        {singleDay ? (
          <AdminSegmented
            label="Durée"
            value={span}
            options={SPANS}
            onChange={setSpan}
          />
        ) : null}
        {partial ? (
          <div className="flex items-center gap-2">
            <TimeSelect
              label="Début"
              value={fromTime}
              onChange={setFromTime}
              invalid={invalidHours}
            />
            <span className="text-ink-soft">–</span>
            <TimeSelect
              label="Fin"
              value={toTime}
              onChange={setToTime}
              invalid={invalidHours}
            />
          </div>
        ) : null}
        <input
          type="text"
          value={label}
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Congés, audience…"
          aria-label="Motif"
          className="min-h-11 w-full border border-line bg-white px-3.5 text-[15px] text-ink focus:border-navy focus:outline-none"
        />
        <AdminButton
          busy={saving}
          disabled={!range.start || invalidHours}
          onClick={add}
          className="w-full sm:w-auto sm:justify-self-start"
        >
          Ajouter l&apos;absence
        </AdminButton>
      </div>
    </section>
  );
};
