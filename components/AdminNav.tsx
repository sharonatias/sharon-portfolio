'use client'

import { useRouter } from 'next/navigation'

type AdminPage = 'home' | 'projects' | 'videos' | 'settings'

interface AdminNavProps {
  currentPage: AdminPage
  onPageChange: (page: AdminPage) => void
}

export default function AdminNav({ currentPage, onPageChange }: AdminNavProps) {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.push('/admin')
  }

  return (
    <div className="w-48 bg-gray-950 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-sm font-light tracking-wider">SHARON ADMIN</h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {[
          { id: 'home' as AdminPage, label: 'עמוד הבית' },
          { id: 'projects' as AdminPage, label: 'פרוייקטים' },
          { id: 'videos' as AdminPage, label: 'סרטי וידאו' },
          { id: 'settings' as AdminPage, label: 'הגדרות' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full text-right px-4 py-2 text-sm tracking-wider transition ${
              currentPage === item.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 text-xs border border-gray-700 text-gray-400 hover:text-gray-300 hover:border-gray-600 transition"
        >
          צפייה באתר
        </a>
        <button
          onClick={handleLogout}
          className="w-full text-center px-4 py-2 text-xs border border-red-900 text-red-400 hover:text-red-300 hover:border-red-800 transition"
        >
          התנתקות
        </button>
      </div>
    </div>
  )
}
