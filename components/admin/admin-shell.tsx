"use client";

import { useCallback, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  Inbox,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import {
  runAdminCommand,
  fetchUpcomingBookings,
  type AdminAction,
  type AdminCommand,
  type CommandOptions,
} from "@/lib/admin-api";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@/lib/use-query";
import { LogoMark } from "@/components/logo-mark";
import { AdminToast, type Toast } from "@/components/admin/admin-toast";
import {
  RequestsPanel,
  type BusyAction,
} from "@/components/admin/requests-panel";
import { AgendaPanel } from "@/components/admin/agenda-panel";
import { NotificationsToggle } from "@/components/admin/notifications-toggle";
import { InstallAppButton } from "@/components/admin/install-app-button";
import { AvailabilityPanel } from "@/components/admin/availability-panel";
import {
  AppointmentSheet,
  type SheetMode,
} from "@/components/admin/appointment-sheet";
import { AdminButton } from "@/components/admin/admin-button";

type AdminTab = "demandes" | "agenda" | "disponibilites";

const TABS: { id: AdminTab; label: string; icon: LucideIcon }[] = [
  { id: "demandes", label: "Demandes", icon: Inbox },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "disponibilites", label: "Disponibilités", icon: Clock },
];

const ACTION_DONE: Record<AdminAction, string> = {
  schedule: "Rendez-vous fixé",
  create: "Rendez-vous créé",
  decline: "Demande refusée",
  cancel: "Rendez-vous annulé",
};

const ACTION_ERRORS: Record<string, string> = {
  invalid_transition: "Cette demande a déjà été traitée",
  slot_taken: "Ce créneau est déjà pris par un autre rendez-vous",
};

interface AdminShellProps {
  email: string;
}

export const AdminShell = ({ email }: AdminShellProps) => {
  const [tab, setTab] = useState<AdminTab>("demandes");
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState<BusyAction | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [sheet, setSheet] = useState<SheetMode | null>(null);
  const upcoming = useQuery(`upcoming:${version}`, fetchUpcomingBookings);
  const bookings = upcoming.data ?? upcoming.previous;
  const pendingCount =
    bookings?.filter(({ status }) => status === "pending").length ?? 0;

  const notify = useCallback(
    (tone: Toast["tone"], message: string) =>
      setToast({ id: Date.now(), tone, message }),
    [],
  );
  const dismiss = useCallback(() => setToast(null), []);

  const closeSheet = useCallback(() => setSheet(null), []);

  const handleAction = async (
    command: AdminCommand,
    options: CommandOptions,
  ) => {
    const id = command.action === "create" ? "new" : command.bookingId;
    setBusy({ id, action: command.action });
    const result = await runAdminCommand(command, options);
    setBusy(null);
    if (!result.ok) {
      notify(
        "error",
        ACTION_ERRORS[result.error] ?? "Action impossible, réessayez",
      );
      setVersion(version + 1);
      return;
    }
    const emailPart = result.emailSent ? "email envoyé" : "sans email";
    notify(
      result.emailSent || !options.notify ? "success" : "warning",
      `${ACTION_DONE[command.action]} · ${options.notify && !result.emailSent ? "email non envoyé" : emailPart}`,
    );
    setSheet(null);
    setVersion(version + 1);
  };

  return (
    <div className="min-h-svh bg-[#f3f1ea]">
      <header className="bg-navy text-paper">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <LogoMark
              className="size-8 text-paper"
              ringClassName="stroke-gold-soft"
            />
            <span className="font-serif text-lg">Hays</span>
          </div>
          <div className="flex items-center gap-1">
            <InstallAppButton compact />
            <span className="ml-2 hidden text-sm text-mist md:inline">
              {email}
            </span>
            <NotificationsToggle notify={notify} />
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              aria-label="Se déconnecter"
              className="grid size-10 cursor-pointer place-items-center text-mist transition-colors hover:text-white"
            >
              <LogOut className="size-4.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl px-4 md:px-8">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => setTab(id)}
                className={`relative flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-3 text-xs font-semibold transition-colors sm:flex-none sm:flex-row sm:gap-2 sm:px-4 sm:text-sm ${
                  active ? "text-navy" : "text-ink-soft hover:text-navy"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="size-4.5" aria-hidden="true" />
                  {id === "demandes" && pendingCount > 0 ? (
                    <span className="grid min-w-5 place-items-center bg-gold px-1.5 text-[11px] font-bold text-white">
                      {pendingCount}
                    </span>
                  ) : null}
                </span>
                {label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-0 h-0.5 bg-gold transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`}
                />
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        {tab !== "disponibilites" ? (
          <div className="mb-6 flex justify-end">
            <AdminButton
              onClick={() => setSheet({ kind: "create" })}
              icon={<CalendarPlus className="size-4" aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              Nouveau rendez-vous
            </AdminButton>
          </div>
        ) : null}
        {tab === "demandes" ? (
          <RequestsPanel
            bookings={bookings}
            failed={upcoming.failed}
            onRetry={upcoming.reload}
            busy={busy}
            onAction={handleAction}
            onPlan={(booking) => setSheet({ kind: "plan", booking })}
          />
        ) : null}
        {tab === "agenda" ? (
          <AgendaPanel
            version={version}
            busy={busy}
            onAction={handleAction}
            onPlan={(booking) => setSheet({ kind: "plan", booking })}
          />
        ) : null}
        {tab === "disponibilites" ? (
          <AvailabilityPanel notify={notify} />
        ) : null}
      </main>

      <AdminToast toast={toast} onDismiss={dismiss} />
      {sheet ? (
        <AppointmentSheet
          mode={sheet}
          busy={
            busy !== null &&
            (busy.action === "create" || busy.action === "schedule")
          }
          onClose={closeSheet}
          onSubmit={handleAction}
        />
      ) : null}
    </div>
  );
};
