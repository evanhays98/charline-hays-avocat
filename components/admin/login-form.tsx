"use client";

import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthCard } from "@/components/admin/auth-card";
import { AdminField } from "@/components/admin/admin-field";
import { AdminButton } from "@/components/admin/admin-button";

type LoginState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "error"; message: string }
  | { status: "reset-sent" };

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>({ status: "idle" });

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setState({ status: "sending" });
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setState({ status: "error", message: "Email ou mot de passe incorrect" });
      return;
    }
    setState({ status: "idle" });
  };

  const sendReset = async () => {
    if (!supabase) return;
    if (!email.trim()) {
      setState({ status: "error", message: "Indiquez votre email" });
      return;
    }
    setState({ status: "sending" });
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin`,
    });
    setState({ status: "reset-sent" });
  };

  if (state.status === "reset-sent") {
    return (
      <AuthCard title="Vérifiez vos emails">
        <p className="flex items-start gap-3 text-[15px] text-ink-soft">
          <MailCheck
            className="mt-0.5 size-5 shrink-0 text-gold"
            aria-hidden="true"
          />
          Lien de réinitialisation envoyé à {email.trim()}
        </p>
        <AdminButton
          variant="secondary"
          className="mt-6 w-full"
          onClick={() => setState({ status: "idle" })}
        >
          Retour
        </AdminButton>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Espace rendez-vous">
      <form onSubmit={signIn} className="grid gap-4">
        <AdminField
          id="admin-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AdminField
          id="admin-password"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {state.status === "error" ? (
          <p role="alert" className="text-sm text-[#b4533c]">
            {state.message}
          </p>
        ) : null}
        <AdminButton
          type="submit"
          busy={state.status === "sending"}
          className="mt-1 w-full"
        >
          Se connecter
        </AdminButton>
        <button
          type="button"
          onClick={sendReset}
          className="cursor-pointer justify-self-center text-sm text-ink-soft underline-offset-4 hover:text-navy hover:underline"
        >
          Mot de passe oublié
        </button>
      </form>
    </AuthCard>
  );
};
