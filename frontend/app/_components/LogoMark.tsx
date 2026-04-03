// Brand logomark — 4-square grid symbol used in nav bars and the drawer header.
// Rendered inside a branded rounded-square container (bg-brand) by the caller.
// gak tau sih ini penting atau ngga, untuk sementar aku pake ini aja
interface LogoMarkProps {
  size?: number;
}

export default function LogoMark({ size = 17 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3"  y="3"  width="10" height="10" rx="2" fill="white" fillOpacity="0.95" />
      <rect x="15" y="3"  width="10" height="10" rx="2" fill="white" fillOpacity="0.55" />
      <rect x="3"  y="15" width="10" height="10" rx="2" fill="white" fillOpacity="0.55" />
      <rect x="15" y="15" width="10" height="10" rx="2" fill="white" fillOpacity="0.20" />
    </svg>
  );
}
