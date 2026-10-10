import { Check } from "lucide-react";

interface CheckListProps {
  items: string[];
}

export const CheckList = ({ items }: CheckListProps) => (
  <ul className="border-t border-line">
    {items.map((item) => (
      <li
        key={item}
        className="flex items-start gap-3.5 border-b border-line py-4 text-[16px] text-ink"
      >
        <Check
          className="mt-1 size-4.5 shrink-0 text-gold"
          strokeWidth={2}
          aria-hidden="true"
        />
        {item}
      </li>
    ))}
  </ul>
);
