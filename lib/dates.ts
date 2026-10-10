export const TIMEZONE = "Europe/Paris";

const WEEKDAY_SHORT = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const pad = (value: number) => String(value).padStart(2, "0");

export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromIsoDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export const mondayOf = (date: Date) =>
  addDays(date, -((date.getDay() + 6) % 7));

export const weekOf = (today: Date, weekIndex: number) => {
  const monday = addDays(mondayOf(today), 7 * weekIndex);
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(monday, offset));
};

export const weekdayShort = (date: Date) => WEEKDAY_SHORT[date.getDay()];

export const monthName = (date: Date) => MONTHS[date.getMonth()];

export const formatWeekRange = (days: Date[]) => {
  const first = days[0];
  const last = days[days.length - 1];
  const firstMonth =
    first.getMonth() === last.getMonth() ? "" : ` ${monthName(first)}`;
  return `${first.getDate()}${firstMonth} – ${last.getDate()} ${monthName(last)}`;
};

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: TIMEZONE,
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIMEZONE,
});

const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: TIMEZONE,
});

export const instantDayKey = (iso: string) =>
  dayKeyFormatter.format(new Date(iso));

export const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

export const formatSlotLong = (iso: string) => {
  const day = longDateFormatter.format(new Date(iso));
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${formatTime(iso).replace(":", " h ")}`;
};

export const minutesOfDay = (iso: string) => {
  const [hours, minutes] = formatTime(iso).split(":").map(Number);
  return hours * 60 + minutes;
};

const dayPartsFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TIMEZONE,
});

export const formatDayParts = (iso: string) => {
  const parts = dayPartsFormatter.formatToParts(new Date(iso));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value.replace(".", "") ?? "";
  return { weekday: pick("weekday"), day: pick("day"), month: pick("month") };
};

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TIMEZONE,
});

export const formatShortDate = (iso: string) =>
  shortDateFormatter.format(new Date(iso));

export type DayPeriod = "matin" | "apres-midi";

export const DAY_PERIODS: DayPeriod[] = ["matin", "apres-midi"];

const PERIOD_LABELS: Record<DayPeriod, string> = {
  matin: "matin",
  "apres-midi": "après-midi",
};

const isDayPeriod = (value: string): value is DayPeriod =>
  value === "matin" || value === "apres-midi";

export const availabilityKey = (day: Date, period: DayPeriod) =>
  `${toIsoDate(day)}|${period}`;

const byDayThenPeriod = (left: string, right: string) => {
  const [leftDay, leftPeriod] = left.split("|");
  const [rightDay, rightPeriod] = right.split("|");
  if (leftDay !== rightDay) return leftDay.localeCompare(rightDay);
  return leftPeriod === "matin" ? -1 : rightPeriod === "matin" ? 1 : 0;
};

const shortMonthFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
});

export const formatAvailability = (keys: string[]) => {
  const byDay = [...keys]
    .sort(byDayThenPeriod)
    .reduce<Record<string, string[]>>((groups, key) => {
      const [day, period] = key.split("|");
      const label = isDayPeriod(period) ? PERIOD_LABELS[period] : period;
      return { ...groups, [day]: [...(groups[day] ?? []), label] };
    }, {});
  return Object.entries(byDay).map(([day, periods]) => {
    const date = fromIsoDate(day);
    return `${weekdayShort(date)}. ${date.getDate()} ${shortMonthFormatter.format(date)} ${periods.join(" et ")}`;
  });
};

export const nextBusinessDay = (from: Date) =>
  addDays(from, [1, 1, 1, 1, 1, 3, 2][from.getDay()]);

export const atLocalTime = (day: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hours,
    minutes,
  );
};
