interface RequiredDotProps {
  done: boolean;
}

export const RequiredDot = ({ done }: RequiredDotProps) => (
  <span
    aria-hidden="true"
    className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 ${
      done ? "bg-[#7cc4a0]" : "bg-gold-soft"
    }`}
  />
);
