'use client'

import { useState, useEffect } from 'react'
import { Project, CATEGORIES } from '@/lib/types'
import Link from 'next/link'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            SHARON MOSHE ATTIAS
            <br />
            CREATIVE & DIRECTOR
          </h1>
          <Link href="/admin" className="text-pink-500 hover:text-pink-400">
            Admin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">I CREATE A VISUAL STORY THAT TELLS THE WORLD WHO YOU ARE</h2>
          <p className="text-gray-400">Documentary film & Creative Direction</p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`mr-4 px-4 py-2 border-b-2 transition ${
              selectedCategory === null ? 'border-pink-500 text-white' : 'border-gray-700 text-gray-400'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`mr-4 px-4 py-2 border-b-2 transition ${
                selectedCategory === cat.value ? 'border-pink-500 text-white' : 'border-gray-700 text-gray-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-900 aspect-video">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No image</div>
                )}
              </div>
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm">{project.description}</p>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center text-gray-400 py-16">No projects in this category yet</div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-6 mt-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-400">
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition">
              Vimeo
            </a>
          </div>
          <p>© 2024 Sharon Moshe Attias</p>
        </div>
      </footer>
    </div>
  )
}
