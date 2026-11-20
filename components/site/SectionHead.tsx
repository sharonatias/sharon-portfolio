import Link from 'next/link'

/** Section title in the condensed display voice, with an optional count and a link. */
export function SectionHead({
  id,
  title,
  count,
  href,
  linkLabel,
}: {
  id?: string
  title: string
  count?: number
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="wrap flex items-end justify-between gap-6 pb-6 md:pb-8">
      <h2 id={id} className="t-display text-[clamp(1.75rem,2.4vw,2.5rem)] flex items-start gap-3">
        {title}
        {typeof count === 'number' && count > 0 && (
          <span className="t-num text-[clamp(0.875rem,1vw,1rem)] font-normal tracking-normal text-[var(--mute)] mt-[0.4em]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {count}
          </span>
        )}
      </h2>
      {href && (
        <Link href={href} className="link-draw text-[1rem] whitespace-nowrap pb-2">
          {linkLabel || 'See all'}
        </Link>
      )}
    </div>
  )
}
