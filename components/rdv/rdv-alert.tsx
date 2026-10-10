import { AlertCircle, Phone } from "lucide-react";
import { CONTACT } from "@/lib/content";

interface RdvAlertProps {
  message: string;
}

export const RdvAlert = ({ message }: RdvAlertProps) => (
  <div
    role="alert"
    className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-l-2 border-[#e0745b] bg-[#e0745b]/10 px-4 py-3 text-sm text-[#f3c3b6]"
  >
    <span className="flex items-center gap-2">
      <AlertCircle className="size-4.5 shrink-0" aria-hidden="true" />
      {message}
    </span>
    <a
      href={CONTACT.phoneHref}
      className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-gold-soft"
    >
      <Phone className="size-4" aria-hidden="true" />
      {CONTACT.phone}
    </a>
  </div>
);
