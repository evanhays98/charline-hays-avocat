import { CONSULTATION_FORMATS, SUBJECTS } from "@/lib/content";

export const subjectLabel = (subject: string) =>
  SUBJECTS.find(({ id }) => id === subject)?.label ?? subject;

export const formatLabel = (format: string) =>
  CONSULTATION_FORMATS.find(({ value }) => value === format)?.label ?? format;
