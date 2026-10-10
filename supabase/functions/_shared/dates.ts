import { CONFIG } from "./config.ts";

const partsFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: CONFIG.timezone,
});

const isoDayFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: CONFIG.timezone,
});

const shortDayFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const capitalize = (text: string) =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const dateParts = (iso: string) => {
  const parts = partsFormatter.formatToParts(new Date(iso));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const minute = pick("minute");
  return {
    weekday: pick("weekday"),
    day: pick("day"),
    month: pick("month"),
    year: pick("year"),
    time: minute === "00" ? `${pick("hour")} h` : `${pick("hour")} h ${minute}`,
  };
};

export const formatDateTime = (iso: string) => {
  const { weekday, day, month, year, time } = dateParts(iso);
  const currentYear = String(new Date().getFullYear());
  const yearPart = year === currentYear ? "" : ` ${year}`;
  return `${capitalize(weekday)} ${day} ${month}${yearPart} à ${time}`;
};

export const localIsoDay = (iso: string) =>
  isoDayFormatter.format(new Date(iso));

const PERIOD_LABELS: Record<string, string> = {
  matin: "matin",
  "apres-midi": "après-midi",
};

const PERIOD_ORDER = ["matin", "apres-midi"];

const byDayThenPeriod = (left: string, right: string) => {
  const [leftDay, leftPeriod] = left.split("|");
  const [rightDay, rightPeriod] = right.split("|");
  if (leftDay !== rightDay) return leftDay.localeCompare(rightDay);
  return PERIOD_ORDER.indexOf(leftPeriod) - PERIOD_ORDER.indexOf(rightPeriod);
};

export const formatAvailability = (keys: string[]) => {
  const byDay = [...keys].sort(byDayThenPeriod).reduce<
    Record<string, string[]>
  >(
    (groups, key) => {
      const [day, period] = key.split("|");
      return {
        ...groups,
        [day]: [...(groups[day] ?? []), PERIOD_LABELS[period] ?? period],
      };
    },
    {},
  );
  return Object.entries(byDay).map(([day, periods]) =>
    `${
      capitalize(
        shortDayFormatter.format(new Date(`${day}T12:00:00Z`)).replace(
          /\./g,
          "",
        ),
      )
    } · ${periods.join(" et ")}`
  );
};
