import { CONTACT } from "@/lib/content";
import { Stagger } from "@/components/motion/stagger";
import { StaggerItem } from "@/components/motion/stagger-item";

interface Fact {
  label: string;
  value: string;
}

const FACTS: Fact[] = [
  { label: "Barreau de Paris", value: "Avocate depuis 2021" },
  { label: "Cabinet", value: CONTACT.address },
  { label: "Consultations", value: "Sur rendez-vous — téléphone ou email" },
];

export const FactsBar = () => (
  <div className="border-b border-line">
    <Stagger className="mx-auto grid max-w-5xl gap-4 px-7 py-6 md:grid-cols-3 md:gap-8">
      {FACTS.map(({ label, value }) => (
        <StaggerItem key={label}>
          <p className="text-sm">
            <span className="block text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold">
              {label}
            </span>
            {value}
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  </div>
);
