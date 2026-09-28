import { LOGO } from "@/lib/logo"

/** The terminal mark in the current theme, with the cursor blinking (paused for reduced motion). */
export function Logo({ className }: { className?: string }) {
  const { window: w, prompt, cursor } = LOGO
  return (
    <svg viewBox={LOGO.viewBox} className={className} aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={w.x} y={w.y} width={w.width} height={w.height} rx={w.rx} stroke="var(--orange)" strokeWidth={w.strokeWidth} />
      <path d={prompt.d} stroke="var(--foreground)" strokeWidth={prompt.strokeWidth} />
      <path d={cursor.d} stroke="var(--sage)" strokeWidth={cursor.strokeWidth} className="logo-cursor" />
    </svg>
  )
}
