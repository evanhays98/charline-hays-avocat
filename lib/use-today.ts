import { useSyncExternalStore } from "react";
import { toIsoDate } from "@/lib/dates";

const subscribeToNothing = () => () => {};
const getTodayIso = () => toIsoDate(new Date());
const getServerToday = () => null;

export const useTodayIso = () =>
  useSyncExternalStore(subscribeToNothing, getTodayIso, getServerToday);
