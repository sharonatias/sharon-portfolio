import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Sharon Moshe Attias</h3>
            <p className="text-gray-400">Creative Director & Producer</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">יצירות</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white transition">
                  כל הפרוייקטים
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  אודות
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">יצירת קשר</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:sharonatias@gmail.com" className="text-gray-400 hover:text-white transition">
                  Email
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition">
              📋 מדיניות פרטיות
            </Link>
            <a href="#" className="text-gray-400 hover:text-white transition">
              ⚖️ תנאי שימוש
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              ♿ הנגשה
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} Sharon Moshe Attias. All rights reserved.
            <br />
            ✓ עומד בתקן WCAG 2.0 Level AA
          </p>
        </div>
      </div>
    </footer>
  )
}
