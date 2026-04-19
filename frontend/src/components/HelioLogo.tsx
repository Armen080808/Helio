interface HelioLogoProps {
  size?: number;
  className?: string;
}

/** Inline SVG matching the favicon — dark indigo background, 4 ascending bars, gold trend line. */
export function HelioLogo({ size = 28, className }: HelioLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#1e1b4b" />
      <rect x="4"    y="21" width="4.5" height="7"  rx="1" fill="#4338ca" />
      <rect x="10"   y="16" width="4.5" height="12" rx="1" fill="#4f46e5" />
      <rect x="16.5" y="11" width="4.5" height="17" rx="1" fill="#6366f1" />
      <rect x="23"   y="5"  width="4.5" height="23" rx="1" fill="#818cf8" />
      <polyline
        points="6.25,21 12.25,16 18.75,11 25.25,5"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25.25" cy="5" r="2" fill="#fbbf24" />
    </svg>
  );
}
