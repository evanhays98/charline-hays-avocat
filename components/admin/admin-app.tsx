"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { fetchIsAdmin } from "@/lib/admin-api";
import { useAuth } from "@/lib/use-auth";
import { registerAdminWorker } from "@/lib/push-client";
import "@/lib/install-prompt";
import { useQuery } from "@/lib/use-query";
import { AuthCard } from "@/components/admin/auth-card";
import { AdminButton } from "@/components/admin/admin-button";
import { LoginForm } from "@/components/admin/login-form";
import { PasswordForm } from "@/components/admin/password-form";
import { AdminShell } from "@/components/admin/admin-shell";

const FullScreenLoader = () => (
  <div className="grid min-h-svh place-items-center bg-[#f3f1ea]">
    <LoaderCircle
      className="size-6 animate-spin text-navy"
      aria-label="Chargement"
    />
  </div>
);

interface AdminGateProps {
  session: Session;
}

const AdminGate = ({ session }: AdminGateProps) => {
  const access = useQuery(`admin:${session.user.id}`, fetchIsAdmin);
  if (access.loading) return <FullScreenLoader />;
  if (access.data === true)
    return <AdminShell email={session.user.email ?? ""} />;
  return (
    <AuthCard title="Accès refusé">
      <p className="text-[15px] text-ink-soft">
        {`${session.user.email ?? "Ce compte"} n'a pas accès à cet espace.`}
      </p>
      <AdminButton
        variant="secondary"
        className="mt-6 w-full"
        onClick={() => supabase?.auth.signOut()}
      >
        Changer de compte
      </AdminButton>
    </AuthCard>
  );
};

export const AdminApp = () => {
  const auth = useAuth();

  useEffect(() => {
    registerAdminWorker().catch(() => null);
  }, []);

  if (!supabase) {
    return (
      <AuthCard title="Configuration manquante">
        <p className="text-[15px] text-ink-soft">
          Les variables NEXT_PUBLIC_SUPABASE_URL et
          NEXT_PUBLIC_SUPABASE_ANON_KEY ne sont pas définies.
        </p>
      </AuthCard>
    );
  }
  if (auth.status === "loading") return <FullScreenLoader />;
  if (auth.status === "signed-out") return <LoginForm />;
  if (auth.status === "recovery") return <PasswordForm />;
  return <AdminGate session={auth.session} />;
};
