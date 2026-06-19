'use client'

import { useRouter } from 'next/navigation'

type AdminPage = 'home' | 'cases' | 'brand_cases' | 'about' | 'projects' | 'settings'

interface AdminNavProps {
  currentPage: AdminPage
  onPageChange: (page: AdminPage) => void
}

const menuItems = [
  { id: 'home' as AdminPage, label: 'Home', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
  { id: 'cases' as AdminPage, label: 'Film Case Studies', icon: '🎬', color: 'from-purple-500 to-pink-500' },
  { id: 'brand_cases' as AdminPage, label: 'Brand Case Studies', icon: '🎨', color: 'from-orange-500 to-amber-500' },
  { id: 'about' as AdminPage, label: 'About Page', icon: '📖', color: 'from-indigo-500 to-purple-500' },
  { id: 'projects' as AdminPage, label: 'Projects', icon: '📊', color: 'from-green-500 to-emerald-500' },
  { id: 'settings' as AdminPage, label: 'Settings', icon: '⚙️', color: 'from-red-500 to-pink-500' },
]

export default function AdminNavV3({ currentPage, onPageChange }: AdminNavProps) {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.push('/admin')
  }

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-blue-500/20 flex flex-col backdrop-blur">
      {/* Logo */}
      <div className="p-8 border-b border-blue-500/20">
        <div className="text-2xl font-light tracking-wider bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ADMIN
        </div>
        <p className="text-xs text-gray-500 mt-2 tracking-widest">Panel Editor</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 group ${
              currentPage === item.id
                ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/20`
                : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3 justify-start">
              <span className={`text-lg transition-transform ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-light">{item.label}</span>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-500/20 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 text-xs rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300"
        >
          👁️ View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full text-center px-4 py-2 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
