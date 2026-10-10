import { Clock, MapPin, Scale, type LucideIcon } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { Stagger } from "@/components/motion/stagger";
import { StaggerItem } from "@/components/motion/stagger-item";

interface Fact {
  label: string;
  value: string;
  icon: LucideIcon;
}

const FACTS: Fact[] = [
  { label: "Barreau de Paris", value: "Avocate depuis 2021", icon: Scale },
  { label: "Rendez-vous", value: CONTACT.address, icon: MapPin },
  {
    label: "Consultations",
    value: "Cabinet, visio ou téléphone",
    icon: Clock,
  },
];

export const FactsBar = () => (
  <div className="border-b border-line">
    <Stagger className="mx-auto grid max-w-5xl px-7 md:grid-cols-3">
      {FACTS.map(({ label, value, icon: Icon }) => (
        <StaggerItem
          key={label}
          className="flex items-start gap-3.5 border-t border-line py-4.5 first:border-t-0 md:border-t-0 md:border-l md:py-6 md:pr-6 md:pl-6 md:first:border-l-0 md:first:pl-0"
        >
          <Icon
            className="mt-0.5 size-4.5 shrink-0 text-gold"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <p className="text-[14.5px]">
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              {label}
            </span>
            {value}
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  </div>
);
