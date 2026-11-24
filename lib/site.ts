// Editable site copy. Every field here can be changed from Admin → Home → "Site texts".
// The values below are only fallbacks used until something is saved.

export interface SiteTexts {
  // Home
  currently: string
  workHeading: string
  // Contact & social
  ctaLine: string
  email: string
  phone: string
  location: string
  instagram: string
  youtube: string
  vimeo: string
  linkedin: string
  // Work page
  workIntro: string
  // About page
  aboutHeadline: string
  // Hero still shown while the video loads (or instead of it)
  heroPoster: string
}

export const DEFAULT_SITE_TEXTS: SiteTexts = {
  currently: 'Currently developing Red Camera, a short film.',
  workHeading: 'Selected work',
  ctaLine: "Let's make something",
  email: 'sharonatias@gmail.com',
  phone: '+972526512503',
  location: 'Tel Aviv, Israel',
  instagram: 'https://www.instagram.com/sharon.attias/',
  youtube: 'https://www.youtube.com/@sharonattias7274',
  vimeo: '',
  linkedin: '',
  workIntro: 'Documentaries, commercials, brands and AI experiments.',
  aboutHeadline: 'I tell stories with a camera, and build brands with the same eye.',
  heroPoster: '',
}

export interface PageContent {
  heroTitle: string
  heroRole: string
  heroSubtitle: string
  heroVideoUrl: string
  featured_project_ids: string
  featured_visible: boolean
  exploring_ids: string
  exploring_visible: boolean
  ai_experiments_ids: string
  ai_experiments_visible: boolean
  site_texts: SiteTexts
}

export const DEFAULT_PAGE_CONTENT: PageContent = {
  heroTitle: 'Creating documentaries, brands and visual experiences.',
  heroRole: 'Director & creative',
  heroSubtitle: 'Blending design and AI-driven creation.',
  heroVideoUrl: '',
  featured_project_ids: '',
  featured_visible: true,
  exploring_ids: '',
  exploring_visible: true,
  ai_experiments_ids: '',
  ai_experiments_visible: true,
  site_texts: DEFAULT_SITE_TEXTS,
}

/** Merge saved texts over the defaults so a missing field never renders empty. */
export function withTextDefaults(saved?: Partial<SiteTexts> | null): SiteTexts {
  const out = { ...DEFAULT_SITE_TEXTS }
  if (saved && typeof saved === 'object') {
    for (const k of Object.keys(out) as (keyof SiteTexts)[]) {
      const v = saved[k]
      if (typeof v === 'string') out[k] = v
    }
  }
  return out
}

/** Role line: "A • B • C" from the admin becomes "A, B, C"; shouty all-caps becomes sentence case. */
export function tidyRole(role?: string) {
  if (!role) return DEFAULT_PAGE_CONTENT.heroRole
  const parts = role.split(/\s*[•·|]\s*/).map((p) => p.trim()).filter(Boolean)
  const joined = parts.join(', ')
  if (joined === joined.toUpperCase()) {
    return joined.charAt(0) + joined.slice(1).toLowerCase()
  }
  return joined
}
