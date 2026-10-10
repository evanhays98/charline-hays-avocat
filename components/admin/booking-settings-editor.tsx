"use client";

import { useState } from "react";
import {
  fetchSettings,
  saveSettings,
  type BookingSettings,
} from "@/lib/admin-api";
import { useQuery } from "@/lib/use-query";
import { AdminSegmented } from "@/components/admin/admin-segmented";
import type { Toast } from "@/components/admin/admin-toast";

const DURATIONS = [30, 45, 60, 90].map((value) => ({
  value,
  label: `${value} min`,
}));

interface BookingSettingsEditorProps {
  notify: (tone: Toast["tone"], message: string) => void;
}

export const BookingSettingsEditor = ({
  notify,
}: BookingSettingsEditorProps) => {
  const query = useQuery("settings", fetchSettings);
  const [local, setLocal] = useState<BookingSettings | null>(null);
  const settings = local ?? query.data;

  const change = async (patch: Partial<BookingSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setLocal(next);
    try {
      await saveSettings(next);
      notify("success", "Réglages enregistrés");
    } catch {
      setLocal(null);
      notify("error", "Enregistrement impossible");
    }
  };

  return (
    <section>
      <h2 className="border-b border-navy pb-2.5 font-serif text-xl text-navy">
        Réglages
      </h2>
      {settings ? (
        <div className="grid gap-5 pt-5">
          <AdminSegmented
            label="Durée d'un rendez-vous"
            value={settings.slotMinutes}
            options={DURATIONS}
            onChange={(slotMinutes) => change({ slotMinutes })}
          />
        </div>
      ) : (
        <div className="mt-5 h-20 animate-pulse bg-navy/5" />
      )}
    </section>
  );
};
