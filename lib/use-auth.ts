import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "recovery"; session: Session }
  | { status: "signed-in"; session: Session };

const nextState = (
  current: AuthState,
  event: string,
  session: Session | null,
): AuthState => {
  if (!session) return { status: "signed-out" };
  if (event === "PASSWORD_RECOVERY") return { status: "recovery", session };
  if (current.status === "recovery" && event !== "USER_UPDATED") return current;
  return { status: "signed-in", session };
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(
    supabase ? { status: "loading" } : { status: "signed-out" },
  );

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event, session) =>
      setState((current) => nextState(current, event, session)),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  return state;
};
