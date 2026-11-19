'use client'

import Link from 'next/link'
import { useAllWork } from '@/lib/useSiteContent'
import { neighbours, WorkItem, WorkType } from '@/lib/work'
import { WorkImage } from './Media'

const hrefOf = (w: WorkItem) => w.href || `/projects?play=${encodeURIComponent(w.key)}`

/** Previous / next project at the end of every case study, across all the work. */
export function ProjectPager({ type, id }: { type: WorkType | WorkType[]; id: string }) {
  const { items } = useAllWork()
  const { prev, next, index, total } = neighbours(items, type, id)
  if (!prev || !next) return null

  const Card = ({ item, dir }: { item: WorkItem; dir: 'Previous' | 'Next' }) => (
    <Link href={hrefOf(item)} className={`group lift block ${dir === 'Next' ? 'md:text-right' : ''}`}>
      <p className="t-meta mb-3">{dir} project</p>
      <div className="scope overflow-hidden bg-[#111]">
        <WorkImage src={item.image} srcs={item.images} video={item.video} alt={item.title} />
      </div>
      <h3 className="t-title mt-4 text-[clamp(1.5rem,2.6vw,2.25rem)]">{item.title}</h3>
      <p className="t-meta mt-1">{[item.role, item.year].filter(Boolean).join(', ')}</p>
    </Link>
  )

  return (
    <nav aria-label="More projects" className="rule-top">
      <div className="wrap py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-10 gap-4">
          <p className="t-meta t-num">
            Project {index + 1} of {total}
          </p>
          <Link href="/projects" className="link-draw text-[0.9375rem]">
            All work
          </Link>
        </div>
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          <Card item={prev} dir="Previous" />
          <Card item={next} dir="Next" />
        </div>
      </div>
    </nav>
  )
}
