'use client'

import { useState, useRef, useEffect } from 'react'
import { DEFAULT_SITE_TEXTS, SiteTexts, withTextDefaults } from '@/lib/site'

// Fields shown in the "Site texts" panel. Hebrew hints help find each one on the site.
const TEXT_FIELDS: { key: keyof SiteTexts; label: string; hint: string; long?: boolean }[] = [
  { key: 'currently', label: 'Currently line (home)', hint: 'שורה קטנה מתחת לכותרת בדף הבית — על מה את/ה עובד/ת עכשיו' },
  { key: 'workHeading', label: 'Selected work heading (home)', hint: 'הכותרת מעל רשימת העבודות בדף הבית' },
  { key: 'workIntro', label: 'Work page intro', hint: 'המשפט ליד הכותרת WORK בעמוד העבודות', long: true },
  { key: 'aboutHeadline', label: 'About headline', hint: 'המשפט הגדול בעמוד About (הטקסט המלא נערך בלשונית About Page)', long: true },
  { key: 'ctaLine', label: 'Footer call to action', hint: 'הכותרת הגדולה בתחתית כל עמוד' },
  { key: 'email', label: 'Email', hint: 'אימייל ליצירת קשר' },
  { key: 'phone', label: 'Phone / WhatsApp', hint: 'מספר בפורמט בינלאומי, למשל +972526512503' },
  { key: 'location', label: 'Location', hint: 'עיר / מדינה' },
  { key: 'instagram', label: 'Instagram link', hint: 'השאירו ריק כדי להסתיר' },
  { key: 'youtube', label: 'YouTube link', hint: 'השאירו ריק כדי להסתיר' },
  { key: 'vimeo', label: 'Vimeo link', hint: 'השאירו ריק כדי להסתיר' },
  { key: 'linkedin', label: 'LinkedIn link', hint: 'השאירו ריק כדי להסתיר' },
  { key: 'heroPoster', label: 'Hero still image URL', hint: 'תמונה שמוצגת עד שהווידאו נטען (אופציונלי)' },
]

export default function PageEditorV3() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [brandCaseStudies, setBrandCaseStudies] = useState<any[]>([])
  const [films, setFilms] = useState<any[]>([])
  const [content, setContent] = useState({
    heroTitle: 'Creating documentaries, brands and visual experiences.',
    heroSubtitle: 'Blending design and AI-driven creation.',
    heroRole: 'FILMMAKER • CREATIVE DIRECTOR',
    heroVideoUrl: '',
    featured_project_ids: '',
    featured_visible: true,
    exploring_ids: '',
    exploring_visible: true,
    ai_experiments_ids: '',
    ai_experiments_visible: true,
    site_texts: DEFAULT_SITE_TEXTS as SiteTexts,
    site_texts_supported: true as boolean | undefined,
  })
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load page content and projects
    const loadContent = async () => {
      try {
        const res = await fetch(`/api/page-content?t=${Date.now()}`)
        const data = await res.json()
        console.log('📖 Loaded page content:', data)
        setContent({ ...data, site_texts: withTextDefaults(data?.site_texts) })
      } catch (error) {
        console.error('❌ Error loading page content:', error)
      }
    }

    const loadProjects = async () => {
      try {
        const [projectsRes, casesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/brand-case-studies')
        ])
        const projectsData = await projectsRes.json()
        const casesData = await casesRes.json()
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setBrandCaseStudies(Array.isArray(casesData) ? casesData : [])
        const filmsData = await fetch('/api/case-studies').then((r) => r.json()).catch(() => [])
        setFilms(Array.isArray(filmsData) ? filmsData : [])
      } catch (error) {
        console.error('❌ Error loading projects:', error)
      }
    }

    loadContent()
    loadProjects()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 Saving page content:', content)
    try {
      const res = await fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)

      if (!res.ok) {
        throw new Error('Failed to save')
      }

      if (data.textsSaved === false) {
        setMessage({ type: 'error', text: '⚠️ Saved, except the site texts: run SQL_MIGRATION_SITE_TEXTS.sql once in Supabase → SQL Editor, then save again.' })
        setTimeout(() => setMessage(null), 9000)
      } else {
        setMessage({ type: 'success', text: '✅ Saved successfully!' })
        setTimeout(() => setMessage(null), 2000)
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      setMessage({ type: 'error', text: '❌ Error saving' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setContent({ ...content, heroVideoUrl: data.url })
      setMessage({ type: 'success', text: `✅ Video "${data.filename}" uploaded successfully!` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error instanceof Error ? error.message : 'Upload error'}` })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="p-8">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-600/20 border border-green-500/30 text-green-400'
            : 'bg-red-600/20 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-xl p-8 backdrop-blur">
          <h2 className="text-xl font-light tracking-wider text-cyan-400 mb-6">Hero Section</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Main Title <span className="text-gray-500">— the big headline under the video</span></label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:bg-slate-950 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Role/Position <span className="text-gray-500">— shown next to your name in the top bar</span></label>
              <input
                type="text"
                value={content.heroRole}
                onChange={(e) => {
                  console.log('Role input changed:', e.target.value);
                  setContent({ ...content, heroRole: e.target.value });
                }}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:bg-slate-950 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Subtitle <span className="text-gray-500">— the paragraph beside the headline</span></label>
              <input
                type="text"
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:bg-slate-950 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Hero Section Video <span className="text-gray-500">— plays silently in the widescreen frame; an mp4 file, YouTube or Vimeo link</span></label>
              <div className="space-y-3">
                {content.heroVideoUrl && (
                  <div className="bg-slate-950/30 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Video Preview:</p>
                    <video
                      src={content.heroVideoUrl}
                      controls
                      className="w-full max-h-48 rounded-lg mb-3"
                    />
                    <div className="flex gap-2">
                      <a
                        href={content.heroVideoUrl}
                        download
                        className="flex-1 px-3 py-2 text-sm bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all text-center"
                      >
                        📥 Download Video
                      </a>
                      <button
                        onClick={() => setContent({ ...content, heroVideoUrl: '' })}
                        className="flex-1 px-3 py-2 text-sm bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="flex-1 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all"
                  >
                    🎬 {content.heroVideoUrl ? 'Replace Video' : 'Upload Video'}
                  </button>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />

                <input
                  type="text"
                  placeholder="Or paste video link (YouTube, Vimeo, etc.)"
                  value={content.heroVideoUrl}
                  onChange={(e) => setContent({ ...content, heroVideoUrl: e.target.value })}
                  className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-light rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* Site texts */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-xl p-8 backdrop-blur">
          <h2 className="text-xl font-light tracking-wider text-emerald-400 mb-2">Site texts</h2>
          <p className="text-sm text-gray-400 mb-6" dir="rtl">כל הטקסטים באתר שאינם חלק מפרויקט. שינוי כאן מתעדכן בכל העמודים אחרי שמירה.</p>
          {content.site_texts_supported === false && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
              One-time setup: run <code>SQL_MIGRATION_SITE_TEXTS.sql</code> in Supabase → SQL Editor so these texts can be saved.
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            {TEXT_FIELDS.map((f) => (
              <div key={f.key} className={f.long ? 'md:col-span-2' : ''}>
                <label className="block text-sm text-gray-300 mb-1 font-light">{f.label}</label>
                <p className="text-xs text-gray-500 mb-2" dir="rtl">{f.hint}</p>
                {f.long ? (
                  <textarea
                    rows={2}
                    value={content.site_texts[f.key]}
                    onChange={(e) => setContent({ ...content, site_texts: { ...content.site_texts, [f.key]: e.target.value } })}
                    className="w-full bg-slate-950/50 border border-emerald-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={content.site_texts[f.key]}
                    onChange={(e) => setContent({ ...content, site_texts: { ...content.site_texts, [f.key]: e.target.value } })}
                    className="w-full bg-slate-950/50 border border-emerald-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-light rounded-lg disabled:opacity-50"
          >
            {saving ? '💾 Saving...' : '💾 Save texts'}
          </button>
        </div>

        {/* Featured Work Selection */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-xl p-8 backdrop-blur">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light tracking-wider text-purple-400">Featured Work Selection</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={content.featured_visible}
                onChange={(e) => setContent({ ...content, featured_visible: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-400">Show Section</span>
            </label>
          </div>
          <p className="text-sm text-gray-400 mb-6">Select up to 10 items for the "Selected work" list on the home page, in the order you tick them. Leave empty to show your first projects automatically.</p>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">📊 Projects</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <label key={project.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.featured_project_ids?.includes(project.id)}
                      onChange={(e) => {
                        const ids = content.featured_project_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(project.id)
                        } else {
                          ids.splice(ids.indexOf(project.id), 1)
                        }
                        setContent({ ...content, featured_project_ids: ids.slice(0, 10).join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{project.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">🎬 Film Case Studies</h3>
              <div className="space-y-2">
                {films.map((film) => (
                  <label key={film.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.featured_project_ids?.includes(film.id)}
                      onChange={(e) => {
                        const ids = content.featured_project_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(film.id)
                        } else {
                          ids.splice(ids.indexOf(film.id), 1)
                        }
                        setContent({ ...content, featured_project_ids: ids.slice(0, 10).join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{film.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">🎨 Brand Case Studies</h3>
              <div className="space-y-2">
                {brandCaseStudies.map((cs) => (
                  <label key={cs.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.featured_project_ids?.includes(cs.id)}
                      onChange={(e) => {
                        const ids = content.featured_project_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(cs.id)
                        } else {
                          ids.splice(ids.indexOf(cs.id), 1)
                        }
                        setContent({ ...content, featured_project_ids: ids.slice(0, 10).join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{cs.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/50 rounded text-sm text-gray-400">
            <strong>Selected:</strong> {content.featured_project_ids?.split(',').filter(Boolean).length || 0}/10
          </div>
        </div>

        {/* Currently Exploring Selection */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-xl p-8 backdrop-blur">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light tracking-wider text-orange-400">Currently Exploring Selection</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={content.exploring_visible}
                onChange={(e) => setContent({ ...content, exploring_visible: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-400">Show Section</span>
            </label>
          </div>
          <p className="text-sm text-gray-400 mb-6">Select items to display in CURRENTLY EXPLORING section</p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">🎬 Film Case Studies</h3>
              <div className="space-y-2">
                {films.map((film) => (
                  <label key={film.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.exploring_ids?.includes(film.id)}
                      onChange={(e) => {
                        const ids = content.exploring_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(film.id)
                        } else {
                          ids.splice(ids.indexOf(film.id), 1)
                        }
                        setContent({ ...content, exploring_ids: ids.join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{film.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">🎨 Brand Case Studies</h3>
              <div className="space-y-2">
                {brandCaseStudies.map((cs) => (
                  <label key={cs.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.exploring_ids?.includes(cs.id)}
                      onChange={(e) => {
                        const ids = content.exploring_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(cs.id)
                        } else {
                          ids.splice(ids.indexOf(cs.id), 1)
                        }
                        setContent({ ...content, exploring_ids: ids.join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{cs.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/50 rounded text-sm text-gray-400">
            <strong>Selected:</strong> {content.exploring_ids?.split(',').filter(Boolean).length || 0}
          </div>
        </div>

        {/* AI Experiments Selection */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-xl p-8 backdrop-blur">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light tracking-wider text-purple-400">AI Experiments Selection</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={content.ai_experiments_visible}
                onChange={(e) => setContent({ ...content, ai_experiments_visible: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-400">Show Section</span>
            </label>
          </div>
          <p className="text-sm text-gray-400 mb-6">Select items to display in AI EXPERIMENTS section</p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">📊 Projects</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <label key={project.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.ai_experiments_ids?.includes(project.id)}
                      onChange={(e) => {
                        const ids = content.ai_experiments_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(project.id)
                        } else {
                          ids.splice(ids.indexOf(project.id), 1)
                        }
                        setContent({ ...content, ai_experiments_ids: ids.join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{project.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-light text-gray-300 mb-3">🎨 Brand Case Studies</h3>
              <div className="space-y-2">
                {brandCaseStudies.map((cs) => (
                  <label key={cs.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.ai_experiments_ids?.includes(cs.id)}
                      onChange={(e) => {
                        const ids = content.ai_experiments_ids?.split(',').filter(Boolean) || []
                        if (e.target.checked) {
                          ids.push(cs.id)
                        } else {
                          ids.splice(ids.indexOf(cs.id), 1)
                        }
                        setContent({ ...content, ai_experiments_ids: ids.join(',') })
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-300">{cs.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/50 rounded text-sm text-gray-400">
            <strong>Selected:</strong> {content.ai_experiments_ids?.split(',').filter(Boolean).length || 0}
          </div>
        </div>
      </div>
    </div>
  )
}
