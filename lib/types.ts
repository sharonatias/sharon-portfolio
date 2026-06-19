export type Category = 'featured' | 'documentary' | 'commercial' | 'television' | 'music' | 'brand_design' | 'ai_experiments' | 'currently_exploring'

export interface HeroVideo {
  id?: string
  video_url: string
  title_en?: string
  title_he?: string
  description?: string
  order?: number
  created_at?: string
  updated_at?: string
}

export interface Project {
  id?: string
  title: string
  description: string
  category: Category
  image_url: string
  video_url?: string
  images?: string[] // array of image URLs for gallery
  files?: string[] // array of file URLs (PDFs, documents, etc)
  display_order?: number
  textStyles?: {
    description?: TextStyle
  }
  created_at?: string
  updated_at?: string
}

export interface TextStyle {
  fontSize: number // in pixels
  fontFamily: 'mono' | 'serif' | 'sans' // monospace, serif, or sans-serif
  alignment: 'left' | 'center' | 'right'
  bold: boolean
  lineHeight: number // in em (e.g., 1.5, 1.8, 2)
}

export interface BrandDesign {
  id?: string
  title: string
  story: string
  category: Category
  logo_url: string
  logo_size?: number // scale percentage (50-200, default 100)
  cover_image_url?: string // cover image for the page
  color_palette: {
    colors: string[] // hex colors like #FF0000
    description?: string
  }
  images: string[] // array of image URLs
  mockups: string[] // array of mockup URLs
  process_description: string
  process_images: string[] // step by step process images
  video_url?: string
  background_url?: string
  skills?: string[] // selected skills for visualization
  textStyles?: {
    story?: TextStyle
    process?: TextStyle
    colorDescription?: TextStyle
  }
  display_order?: number
  created_at?: string
  updated_at?: string
}

export const SKILLS = [
  'brand design',
  'logo',
  'photography',
  'creative',
  'digital',
  'video',
  'marketing strategy',
]

export interface About {
  id?: string
  text: string
  image1_url: string
  image2_url: string
  textStyles?: {
    main?: TextStyle
  }
  created_at?: string
  updated_at?: string
}

export interface CaseStudySection {
  title: string
  description: string
  images: string[]
  accentColor?: string
  label?: string
  isDeleted?: boolean
  order?: number
}

export interface DynamicSection extends CaseStudySection {
  id: string
  label: string
  order: number
}

export interface ProcessBlock {
  number: number
  title: string
  description: string
  images?: string[]
}

export interface AppCase {
  id?: string
  title: string
  subtitle?: string
  year?: string
  role?: string
  client?: string
  duration?: string
  format?: string
  hero_image: string
  hero_description: string
  watch_film_link?: string
  video_file?: string

  problem?: CaseStudySection
  insight?: CaseStudySection
  approach?: CaseStudySection
  flow?: CaseStudySection
  interaction?: CaseStudySection
  outcome?: CaseStudySection

  gallery_images?: string[]
  process_blocks?: ProcessBlock[]
  my_role_title?: string
  my_role_description?: string
  custom_sections?: DynamicSection[]

  brand_color?: string
  brand_design_id?: string
  category?: Category
  display_order?: number
  created_at?: string
  updated_at?: string
}

export interface BrandCaseStudyImage {
  url: string
  size: 'thumbnail' | 'medium' | 'large' // responsive image sizes
  caption?: string
}

export interface BrandCaseStudySection {
  title: string
  description: string
  images: BrandCaseStudyImage[]
  isDeleted?: boolean
}

export interface BrandCaseStudy {
  id?: string
  title: string
  subtitle?: string
  year?: string
  client?: string
  role?: string

  hero_image: string
  hero_description: string
  hero_video?: string
  central_description: string // Main text describing the project

  // 7 Design System Sections
  idea?: BrandCaseStudySection
  system?: BrandCaseStudySection
  shape?: BrandCaseStudySection
  motion?: BrandCaseStudySection
  applications?: BrandCaseStudySection
  color?: BrandCaseStudySection
  type?: BrandCaseStudySection

  // Color Palette
  color_palette: string[] // Array of hex colors like #FF0000

  // Videos (can be placed freely)
  videos?: Array<{
    url: string
    title?: string
    section?: string // which section it belongs to (optional)
  }>

  // CTO/Leader Section
  cto?: {
    name: string
    title: string
    image: string
    description: string
  }

  sections_order?: string[]

  category?: Category
  display_order?: number
  created_at?: string
  updated_at?: string
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'featured', label: 'FEATURED' },
  { value: 'documentary', label: 'DOCUMENTARY' },
  { value: 'commercial', label: 'COMMERCIAL' },
  { value: 'television', label: 'TELEVISION' },
  { value: 'music', label: 'MUSIC' },
  { value: 'brand_design', label: 'BRAND DESIGN' },
  { value: 'ai_experiments', label: 'AI EXPERIMENTS' },
  { value: 'currently_exploring', label: 'CURRENTLY EXPLORING' },
]
