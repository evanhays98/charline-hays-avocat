import { supabase } from "@/lib/supabase";
import { readFunctionError } from "@/lib/booking-api";
import type { Database } from "@/lib/database.types";
import type { ConsultationFormatValue } from "@/lib/content";

type Tables = Database["public"]["Tables"];

type BookingRow = Tables["bookings"]["Row"];

export type BookingStatus = Database["public"]["Enums"]["booking_status"];

export type AdminCommand =
  | { action: "schedule"; startsAt: string }
  | { action: "decline" }
  | { action: "cancel" };

export type AdminAction = AdminCommand["action"];

export interface AdminBooking {
  id: string;
  createdAt: string;
  startsAt: string | null;
  endsAt: string | null;
  status: BookingStatus;
  subject: string;
  format: ConsultationFormatValue;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  availability: string[];
}

export interface ScheduledBooking extends AdminBooking {
  startsAt: string;
  endsAt: string;
}

export interface FreeSlot {
  startsAt: string;
  endsAt: string;
}

export interface WeeklyHour {
  weekday: number;
  startsAt: string;
  endsAt: string;
}

export interface BookingSettings {
  slotMinutes: number;
  minNoticeHours: number;
  horizonDays: number;
}

export interface TimeOff {
  id: string;
  startsAt: string;
  endsAt: string;
  label: string | null;
}

export interface NewTimeOff {
  firstDay: string;
  lastDay: string;
  fromTime: string | null;
  toTime: string | null;
  label: string;
}

const client = () => {
  if (!supabase) throw new Error("not_configured");
  return supabase;
};

const toAdminBooking = (row: BookingRow): AdminBooking => ({
  id: row.id,
  createdAt: row.created_at,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
  status: row.status,
  subject: row.subject,
  format: row.format,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  message: row.message,
  availability: row.availability,
});

export const isScheduledBooking = (
  booking: AdminBooking,
): booking is ScheduledBooking =>
  booking.status === "confirmed" &&
  booking.startsAt !== null &&
  booking.endsAt !== null;

const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed"];

const shortTime = (time: string) => time.slice(0, 5);

export const fetchIsAdmin = async () => {
  const { data, error } = await client().rpc("is_admin");
  if (error) throw error;
  return data;
};

export const fetchUpcomingBookings = async () => {
  const since = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client()
    .from("bookings")
    .select("*")
    .in("status", ACTIVE_STATUSES)
    .or(`starts_at.is.null,starts_at.gte.${since}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toAdminBooking);
};

export const fetchBookingsBetween = async (fromIso: string, toIso: string) => {
  const { data, error } = await client()
    .from("bookings")
    .select("*")
    .in("status", ACTIVE_STATUSES)
    .gte("starts_at", fromIso)
    .lt("starts_at", toIso)
    .order("starts_at");
  if (error) throw error;
  return data.map(toAdminBooking);
};

export type ActionResult =
  { ok: true; emailSent: boolean } | { ok: false; error: string };

export const fetchFreeSlots = async (
  rangeStart: string,
  rangeEnd: string,
): Promise<FreeSlot[]> => {
  const { data, error } = await client().rpc("free_slots", {
    range_start: rangeStart,
    range_end: rangeEnd,
  });
  if (error) throw error;
  return data.map(({ starts_at, ends_at }) => ({
    startsAt: starts_at,
    endsAt: ends_at,
  }));
};

export const applyBookingAction = async (
  bookingId: string,
  command: AdminCommand,
  notify: boolean,
): Promise<ActionResult> => {
  const { data, error } = await client().functions.invoke<{
    emailSent: boolean;
  }>("admin-booking", { body: { bookingId, notify, ...command } });
  if (error) {
    const code = await readFunctionError(error);
    return {
      ok: false,
      error: typeof code === "string" ? code : "server_error",
    };
  }
  return { ok: true, emailSent: data?.emailSent ?? false };
};

export const fetchWeeklyHours = async (): Promise<WeeklyHour[]> => {
  const { data, error } = await client()
    .from("weekly_hours")
    .select("weekday, starts_at, ends_at")
    .order("weekday")
    .order("starts_at");
  if (error) throw error;
  return data.map(({ weekday, starts_at, ends_at }) => ({
    weekday,
    startsAt: shortTime(starts_at),
    endsAt: shortTime(ends_at),
  }));
};

export const saveWeeklyHours = async (hours: WeeklyHour[]) => {
  const { error } = await client().rpc("replace_weekly_hours", {
    hours: hours.map(({ weekday, startsAt, endsAt }) => ({
      weekday,
      starts_at: startsAt,
      ends_at: endsAt,
    })),
  });
  if (error) throw error;
};

export const fetchSettings = async (): Promise<BookingSettings> => {
  const { data, error } = await client()
    .from("settings")
    .select("slot_minutes, min_notice_hours, horizon_days")
    .single();
  if (error) throw error;
  return {
    slotMinutes: data.slot_minutes,
    minNoticeHours: data.min_notice_hours,
    horizonDays: data.horizon_days,
  };
};

export const saveSettings = async (settings: BookingSettings) => {
  const { error } = await client()
    .from("settings")
    .update({
      slot_minutes: settings.slotMinutes,
      min_notice_hours: settings.minNoticeHours,
      horizon_days: settings.horizonDays,
    })
    .eq("id", true);
  if (error) throw error;
};

export const fetchTimeOff = async (): Promise<TimeOff[]> => {
  const { data, error } = await client()
    .from("time_off")
    .select("id, starts_at, ends_at, label")
    .gte("ends_at", new Date().toISOString())
    .order("starts_at");
  if (error) throw error;
  return data.map(({ id, starts_at, ends_at, label }) => ({
    id,
    startsAt: starts_at,
    endsAt: ends_at,
    label,
  }));
};

export const fetchTimeOffBetween = async (fromIso: string, toIso: string) => {
  const { data, error } = await client()
    .from("time_off")
    .select("id, starts_at, ends_at, label")
    .lt("starts_at", toIso)
    .gt("ends_at", fromIso);
  if (error) throw error;
  return data.map(({ id, starts_at, ends_at, label }) => ({
    id,
    startsAt: starts_at,
    endsAt: ends_at,
    label,
  }));
};

export const addTimeOff = async ({
  firstDay,
  lastDay,
  fromTime,
  toTime,
  label,
}: NewTimeOff) => {
  const { error } = await client().rpc("add_time_off", {
    first_day: firstDay,
    last_day: lastDay,
    from_time: fromTime ?? undefined,
    to_time: toTime ?? undefined,
    label: label || undefined,
  });
  if (error) throw error;
};

export const deleteTimeOff = async (id: string) => {
  const { error } = await client().from("time_off").delete().eq("id", id);
  if (error) throw error;
};

const calendarFeedUrl = (token: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/functions/v1/calendar-feed?token=${token}`;

export const fetchCalendarFeedUrl = async () => {
  const { data, error } = await client()
    .from("settings")
    .select("calendar_token")
    .single();
  if (error) throw error;
  return calendarFeedUrl(data.calendar_token);
};

export const regenerateCalendarFeedUrl = async () => {
  const { data, error } = await client().rpc("regenerate_calendar_token");
  if (error) throw error;
  return calendarFeedUrl(data);
};
