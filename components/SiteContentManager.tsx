'use client'

import { useState } from 'react'

interface SiteContentManagerProps {
  onUpdate: () => void
}

export default function SiteContentManager({ onUpdate }: SiteContentManagerProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'categories'>('hero')

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 font-semibold transition border-b-2 ${
            activeTab === 'hero'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          וידאו הבית
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 font-semibold transition border-b-2 ${
            activeTab === 'about'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          אודות
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-semibold transition border-b-2 ${
            activeTab === 'categories'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          הדפים של הקטגוריות
        </button>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {activeTab === 'hero' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">וידאו הבית</h2>
            <p className="text-gray-600 mb-6">
              ערוך את הוידאו ותמונות שמופיעות בעמוד הבית
            </p>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-900 mb-2">לינק לווידאו</label>
                <input
                  type="text"
                  placeholder="YouTube URL או קישור מקומי"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">כותרת</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                שמור שינויים
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">עמוד אודות</h2>
            <p className="text-gray-600 mb-6">
              ערוך את המידע בעמוד האודות
            </p>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-900 mb-2">ביוגרפיה</label>
                <textarea
                  rows={6}
                  placeholder="כתוב קצת עליך..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                שמור שינויים
              </button>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">הדפים של הקטגוריות</h2>
            <p className="text-gray-600 mb-6">
              ערוך את התמונות והכותרות של דפי הקטגוריות
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['featured', 'brand_design', 'ai_creative_technology'].map((category) => (
                <div key={category} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {category === 'featured' && '🎬 סרטים ווידאו'}
                    {category === 'brand_design' && '🎨 עיצוב ודיגיטל'}
                    {category === 'ai_creative_technology' && '🤖 AI ויצירה'}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="כותרת"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="URL של תמונה"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <button className="w-full px-3 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800">
                      שמור
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
