export type Category = 'videos_for_companies' | 'documentary_films' | 'brand_identity' | 'digital' | 'djs'

export interface Project {
  id?: string
  title: string
  description: string
  category: Category
  image_url: string
  video_url?: string
  created_at?: string
  updated_at?: string
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'videos_for_companies', label: 'Videos for companies' },
  { value: 'documentary_films', label: 'Documentary films' },
  { value: 'brand_identity', label: 'Brand identity' },
  { value: 'digital', label: 'Digital' },
  { value: 'djs', label: "DJ's" },
]
