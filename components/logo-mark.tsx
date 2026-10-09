interface LogoMarkProps {
  className?: string;
  ringClassName?: string;
}

export const LogoMark = ({
  className = "",
  ringClassName = "stroke-gold",
}: LogoMarkProps) => (
  <svg
    viewBox="16 16 68 68"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <g className="fill-current">
      <rect x="28" y="22" width="9" height="56" />
      <rect x="22" y="22" width="21" height="2.6" />
      <rect x="22" y="75.4" width="21" height="2.6" />
      <rect x="63" y="22" width="9" height="56" />
      <rect x="57" y="22" width="21" height="2.6" />
      <rect x="57" y="75.4" width="21" height="2.6" />
    </g>
    <g fill="none" strokeWidth="3.4" className={ringClassName}>
      <path d="M37 50H42M58 50H63" />
      <circle cx="50" cy="50" r="7.5" />
    </g>
  </svg>
);
