// One list of every piece of work on the site, whatever table it lives in.
// Home, the Work index and the next/previous navigation on project pages all read from here,
// so anything added in the admin shows up everywhere automatically.

export type WorkType = 'project' | 'film' | 'app' | 'brandcase' | 'brand'

export interface WorkItem {
  key: string // unique across tables
  id: string
  type: WorkType
  title: string
  subtitle?: string
  description?: string
  role?: string
  year?: string
  category?: string
  categoryLabel: string
  image?: string
  video?: string // a file or YouTube/Vimeo link that can be played in place
  href?: string // a case-study page; projects without one open in the player
  tone: 'dark' | 'light'
  order: number
  raw: any
}

export const CATEGORY_LABELS: Record<string, string> = {
  featured: 'Featured',
  documentary: 'Documentary',
  commercial: 'Commercial',
  television: 'Television',
  music: 'Music video',
  brand_design: 'Brand design',
  ai_experiments: 'AI experiments',
  currently_exploring: 'In development',
}

// Order in which disciplines appear in filters
export const CATEGORY_ORDER = [
  'documentary',
  'commercial',
  'television',
  'music',
  'brand_design',
  'ai_experiments',
  'currently_exploring',
  'featured',
]

export const categoryLabel = (c?: string) =>
  (c && CATEGORY_LABELS[c]) || (c ? c.replace(/_/g, ' ').replace(/^\w/, (m) => m.toUpperCase()) : 'Project')

const str = (v: any) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
const orderOf = (v: any) => (typeof v === 'number' ? v : 999)

async function getJson(url: string): Promise<any[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function normalizeWork(lists: {
  projects?: any[]
  films?: any[]
  apps?: any[]
  brandCases?: any[]
  brands?: any[]
}): WorkItem[] {
  const out: WorkItem[] = []

  for (const p of lists.projects || []) {
    if (!p?.id) continue
    out.push({
      key: `project-${p.id}`,
      id: p.id,
      type: 'project',
      title: str(p.title) || 'Untitled',
      description: str(p.description),
      category: p.category,
      categoryLabel: categoryLabel(p.category),
      role: categoryLabel(p.category),
      year: str(p.year),
      image: str(p.image_url) || (Array.isArray(p.images) ? p.images[0] : undefined),
      video: str(p.video_url),
      tone: 'dark',
      order: orderOf(p.display_order),
      raw: p,
    })
  }

  for (const c of lists.films || []) {
    if (!c?.id) continue
    out.push({
      key: `film-${c.id}`,
      id: c.id,
      type: 'film',
      title: str(c.title) || 'Untitled',
      subtitle: str(c.subtitle),
      description: str(c.hero_description),
      category: c.category,
      categoryLabel: str(c.format) || categoryLabel(c.category),
      role: str(c.role) || str(c.format) || categoryLabel(c.category),
      year: str(String(c.year ?? '')),
      image: str(c.hero_image),
      video: str(c.video_file) || str(c.watch_film_link),
      href: `/case-studies/${c.id}`,
      tone: 'dark',
      order: orderOf(c.display_order),
      raw: c,
    })
  }

  for (const c of lists.apps || []) {
    if (!c?.id || (c.category && c.category !== 'brand_design')) continue
    out.push({
      key: `app-${c.id}`,
      id: c.id,
      type: 'app',
      title: str(c.title) || 'Untitled',
      subtitle: str(c.subtitle),
      description: str(c.hero_description),
      category: c.category || 'brand_design',
      categoryLabel: categoryLabel(c.category || 'brand_design'),
      role: str(c.role) || 'Product design',
      year: str(String(c.year ?? '')),
      image: str(c.hero_image),
      href: `/case-studies/${c.id}`,
      tone: 'dark',
      order: orderOf(c.display_order),
      raw: c,
    })
  }

  for (const c of lists.brandCases || []) {
    if (!c?.id) continue
    out.push({
      key: `brandcase-${c.id}`,
      id: c.id,
      type: 'brandcase',
      title: str(c.title) || 'Untitled',
      subtitle: str(c.subtitle),
      description: str(c.hero_description) || str(c.central_description),
      category: c.category || 'brand_design',
      categoryLabel: categoryLabel(c.category || 'brand_design'),
      role: str(c.role) || 'Brand identity',
      year: str(String(c.year ?? '')),
      image: str(c.hero_image),
      href: `/brand-case-studies/${c.id}`,
      tone: 'light',
      order: orderOf(c.display_order),
      raw: c,
    })
  }

  for (const b of lists.brands || []) {
    if (!b?.id) continue
    out.push({
      key: `brand-${b.id}`,
      id: b.id,
      type: 'brand',
      title: str(b.title) || 'Untitled',
      description: str(b.story),
      category: b.category || 'brand_design',
      categoryLabel: categoryLabel(b.category || 'brand_design'),
      role: 'Brand design',
      image:
        str(b.cover_image_url) ||
        (Array.isArray(b.mockups) ? b.mockups[0] : undefined) ||
        (Array.isArray(b.images) ? b.images[0] : undefined) ||
        str(b.logo_url),
      href: `/brand/${b.id}`,
      tone: 'dark',
      order: orderOf(b.display_order),
      raw: b,
    })
  }

  return out.sort((a, b) => a.order - b.order)
}

export async function fetchAllWork(): Promise<WorkItem[]> {
  const [projects, films, apps, brandCases, brands] = await Promise.all([
    getJson('/api/projects'),
    getJson('/api/case-studies'),
    getJson('/api/app-cases'),
    getJson('/api/brand-case-studies'),
    getJson('/api/brand-design'),
  ])
  return normalizeWork({ projects, films, apps, brandCases, brands })
}

/** Items picked by id in the admin (comma separated), in the order they were picked. */
export function pickByIds(items: WorkItem[], ids?: string) {
  const list = (ids || '').split(',').map((s) => s.trim()).filter(Boolean)
  return list
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is WorkItem => !!i)
}

/** Previous and next item around the given one, wrapping at the ends. */
export function neighbours(items: WorkItem[], type: WorkType | WorkType[], id: string) {
  const types = Array.isArray(type) ? type : [type]
  const i = items.findIndex((w) => types.includes(w.type) && w.id === id)
  if (i === -1 || items.length < 2) return { prev: undefined, next: undefined, index: i, total: items.length }
  return {
    prev: items[(i - 1 + items.length) % items.length],
    next: items[(i + 1) % items.length],
    index: i,
    total: items.length,
  }
}
