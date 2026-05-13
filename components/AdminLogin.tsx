'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    if (email === 'sharonatias@gmail.com' && password === 'sma369369') {
      sessionStorage.setItem('isAdmin', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="sharonatias@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
