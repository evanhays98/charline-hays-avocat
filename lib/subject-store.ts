import { useSyncExternalStore } from "react";
import type { SubjectId } from "@/lib/content";

type Listener = () => void;

const listeners = new Set<Listener>();
let selected: SubjectId | null = null;

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => selected;

const getServerSnapshot = () => null;

export const selectSubject = (subject: SubjectId | null) => {
  selected = subject;
  listeners.forEach((listener) => listener());
};

export const useSelectedSubject = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
