'use client'

import { useState } from 'react'
import AdminMediaManagerV3 from './AdminMediaManagerV3'

export default function SettingsAdminV3() {
  const [activeTab, setActiveTab] = useState<'media' | 'general'>('media')

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-orange-500/20 px-8 pt-8 flex gap-1">
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-3 text-sm transition-all duration-300 ${
            activeTab === 'media'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          📁 Media Library
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-3 text-sm transition-all duration-300 ${
            activeTab === 'general'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          ⚙️ General
        </button>
      </div>

      {/* Content */}
      {activeTab === 'media' && <AdminMediaManagerV3 />}

      {activeTab === 'general' && (
        <div className="p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-light tracking-wider text-orange-400 mb-6">General Settings</h2>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-xl p-8 backdrop-blur">
              <p className="text-gray-400 font-light">More settings coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
