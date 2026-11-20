'use client'

import { useState } from 'react'
import { WorkItem } from '@/lib/work'
import { WorkPlayer } from './WorkPlayer'

/**
 * Stills from a film laid out as a contact sheet: strips of frames with their
 * edge numbers. The first frame comes marked with a red grease pencil, the way
 * a director circles the chosen take; hovering marks others. Click to view large.
 */
export function FrameSheet({ title, frames }: { title: string; frames: string[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [picked, setPicked] = useState(0)
  if (!frames.length) return null

  const perStrip = 4
  const strips: string[][] = []
  for (let i = 0; i < frames.length; i += perStrip) strips.push(frames.slice(i, i + perStrip))

  const asItems: WorkItem[] = frames.map((src, i) => ({
    key: `frame-${i}`,
    id: `frame-${i}`,
    type: 'project',
    title: `${title}, frame ${i + 1}`,
    categoryLabel: 'Frame',
    image: src,
    images: [src],
    tone: 'dark',
    order: i,
    raw: null,
  }))

  return (
    <section className="wrap py-16 md:py-24 rule-top" aria-label="Frames">
      <div className="flex items-end justify-between gap-6 pb-8">
        <h2 className="t-display text-[clamp(2.25rem,4.4vw,4.5rem)]">Frames</h2>
        <p className="t-meta t-num pb-2">{frames.length} stills</p>
      </div>

      <div className="sheet">
        {strips.map((strip, s) => (
          <div key={s} className="sheet-strip grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {strip.map((src, j) => {
              const i = s * perStrip + j
              return (
                <button
                  key={i}
                  type="button"
                  className={`sheet-cell relative text-left ${picked === i ? 'is-picked' : ''}`}
                  onClick={() => {
                    setPicked(i)
                    setOpen(i)
                  }}
                  aria-label={`Open frame ${i + 1}`}
                >
                  <span className="frame-no absolute -top-[18px] left-0">{String(i + 1).padStart(2, '0')}A</span>
                  <span className="block aspect-[16/10] overflow-hidden bg-black">
                    <img src={src} alt="" className="cover" loading="lazy" />
                  </span>
                  <svg className="pencil absolute -inset-x-[6%] -inset-y-[10%] w-[112%] h-[120%] pointer-events-none overflow-visible" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden>
                    <path
                      pathLength={1}
                      d={i % 2 ? 'M10,30 C12,10 50,3 78,8 C98,13 98,40 92,54 C84,68 40,70 18,62 C2,55 3,36 14,24' : 'M8,38 C6,14 40,4 70,7 C94,9 99,30 95,48 C90,66 50,70 22,64 C6,60 2,44 12,30'}
                    />
                  </svg>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {open !== null && <WorkPlayer items={asItems} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </section>
  )
}
