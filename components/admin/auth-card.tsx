import type { ReactNode } from "react";
import { LogoMark } from "@/components/logo-mark";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export const AuthCard = ({ title, children }: AuthCardProps) => (
  <main className="grid min-h-svh place-items-center bg-[#f3f1ea] px-4 py-10">
    <div className="w-full max-w-sm border-t-[3px] border-navy bg-paper px-6 py-8 shadow-[0_24px_60px_-36px_rgba(19,38,75,0.45)] md:px-8">
      <div className="flex items-center gap-3 font-serif text-lg text-navy">
        <LogoMark className="size-8" />
        Charline HAYS
      </div>
      <h1 className="mt-6 font-serif text-2xl font-medium text-navy">
        {title}
      </h1>
      <div className="mt-1.5 h-0.5 w-10 bg-gold" />
      <div className="mt-6">{children}</div>
    </div>
  </main>
);
