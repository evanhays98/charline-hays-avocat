import {
  Baby,
  Euro,
  Gavel,
  House,
  Network,
  Plane,
  Split,
  type LucideProps,
} from "lucide-react";
import type { SituationId } from "@/lib/content";

const ICONS = {
  divorce: Split,
  enfants: Baby,
  pension: Euro,
  patrimoine: House,
  filiation: Network,
  penal: Gavel,
  etranger: Plane,
} satisfies Record<SituationId, React.ComponentType<LucideProps>>;

interface SituationIconProps extends LucideProps {
  situation: SituationId;
}

export const SituationIcon = ({ situation, ...props }: SituationIconProps) => {
  const Icon = ICONS[situation];
  return <Icon aria-hidden="true" {...props} />;
};
