"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { AuthCard } from "@/components/admin/auth-card";
import { AdminField } from "@/components/admin/admin-field";
import { AdminButton } from "@/components/admin/admin-button";

const MIN_LENGTH = 10;

export const PasswordForm = () => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tooShort = password.length > 0 && password.length < MIN_LENGTH;

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || password.length < MIN_LENGTH) return;
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setBusy(false);
    if (updateError) setError("Le mot de passe n'a pas pu être enregistré");
  };

  return (
    <AuthCard title="Nouveau mot de passe">
      <form onSubmit={save} className="grid gap-4">
        <AdminField
          id="admin-new-password"
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder={`${MIN_LENGTH} caractères minimum`}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {tooShort || error ? (
          <p role="alert" className="text-sm text-[#b4533c]">
            {error ?? `${MIN_LENGTH} caractères minimum`}
          </p>
        ) : null}
        <AdminButton
          type="submit"
          busy={busy}
          disabled={password.length < MIN_LENGTH}
          className="w-full"
        >
          Enregistrer
        </AdminButton>
      </form>
    </AuthCard>
  );
};
