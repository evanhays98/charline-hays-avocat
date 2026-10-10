export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";

export type ConsultationFormat = "cabinet" | "visio" | "telephone";

export interface Booking {
  id: string;
  created_at: string;
  starts_at: string | null;
  ends_at: string | null;
  status: BookingStatus;
  subject: string;
  format: ConsultationFormat;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  availability: string[];
}

export interface ScheduledBooking extends Booking {
  starts_at: string;
  ends_at: string;
}

export const isScheduled = (booking: Booking): booking is ScheduledBooking =>
  booking.starts_at !== null && booking.ends_at !== null;

export const AVAILABILITY_PATTERN = /^\d{4}-\d{2}-\d{2}\|(matin|apres-midi)$/;

export const SUBJECT_LABELS: Record<string, string> = {
  divorce: "Divorce, séparation",
  enfants: "Enfants",
  pension: "Pension",
  patrimoine: "Patrimoine",
  filiation: "Filiation",
  penal: "Pénal de la famille",
  etranger: "Enfant à l'étranger",
  autre: "Autre",
};

export const FORMAT_LABELS: Record<ConsultationFormat, string> = {
  cabinet: "Au cabinet",
  visio: "En visio",
  telephone: "Par téléphone",
};

export const isConsultationFormat = (
  value: unknown,
): value is ConsultationFormat =>
  value === "cabinet" || value === "visio" || value === "telephone";

export const isSubject = (value: unknown): value is string =>
  typeof value === "string" && value in SUBJECT_LABELS;
