'use client'

import { useRouter } from 'next/navigation'

type AdminTab = 'projects' | 'videos' | 'brand' | 'content'

interface AdminSidebarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

const menuItems: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'projects', label: 'פרוייקטים', icon: '🎬' },
  { id: 'videos', label: 'סרטי וידאו', icon: '🎥' },
  { id: 'brand', label: 'עיצוב ודיגיטל', icon: '🎨' },
  { id: 'content', label: 'תוכן אתר', icon: '📝' },
]

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.push('/admin')
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold">Sharon Admin</h2>
        <p className="text-xs text-gray-400 mt-1">עריכה קלה ומהירה</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-right px-4 py-3 rounded-lg transition flex items-center gap-3 ${
              activeTab === item.id
                ? 'bg-white text-gray-900 font-semibold'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="ml-2">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-right px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition text-sm"
        >
          👁️ צפייה באתר
        </a>
        <button
          onClick={handleLogout}
          className="w-full text-right px-4 py-2 rounded-lg bg-red-900 text-red-100 hover:bg-red-800 transition text-sm"
        >
          🚪 התנתקות
        </button>
      </div>
    </div>
  )
}
