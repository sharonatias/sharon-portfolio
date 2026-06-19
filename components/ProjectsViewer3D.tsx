'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Project {
  id: string
  title: string
  image_url: string
  description: string
}

export default function ProjectsViewer3D({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cardsRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return

    try {
      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      )
      camera.position.z = 6
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      // Lighting - create a cosmic environment
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)

      const pointLight1 = new THREE.PointLight(0x00ffff, 1)
      pointLight1.position.set(10, 10, 10)
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0xff00ff, 0.8)
      pointLight2.position.set(-10, -10, 10)
      scene.add(pointLight2)

      const pointLight3 = new THREE.PointLight(0x00ff88, 0.6)
      pointLight3.position.set(0, 0, 20)
      scene.add(pointLight3)

      // Create card meshes
      cardsRef.current = []
      const cardGroup = new THREE.Group()
      scene.add(cardGroup)

      projects.forEach((project, index) => {
        const geometry = new THREE.PlaneGeometry(4, 3)

        // Create texture from image URL if available
        const textureLoader = new THREE.TextureLoader()
        let texture: THREE.Texture | null = null

        if (project.image_url) {
          try {
            texture = textureLoader.load(project.image_url)
          } catch {
            texture = null
          }
        }

        // Create canvas texture for title/description overlay
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 600

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'rgba(20, 20, 30, 0.8)'
          ctx.fillRect(0, 0, 800, 600)

          ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)'
          ctx.lineWidth = 2
          ctx.strokeRect(15, 15, 770, 570)

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 52px Arial'
          ctx.textAlign = 'left'
          const title = project.title.substring(0, 30)
          ctx.fillText(title, 50, 120)

          ctx.fillStyle = 'rgba(170, 170, 170, 0.9)'
          ctx.font = '24px Arial'
          const description = (project.description || '').substring(0, 40)
          ctx.fillText(description, 50, 170)

          // Add index number
          ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'
          ctx.font = 'bold 100px Arial'
          ctx.textAlign = 'right'
          ctx.fillText(`${index + 1}`, 750, 550)
        }

        const canvasTexture = new THREE.CanvasTexture(canvas)

        const material = new THREE.MeshStandardMaterial({
          map: texture || canvasTexture,
          emissive: new THREE.Color(0x00ffff),
          emissiveIntensity: 0.2,
          metalness: 0.3,
          roughness: 0.4
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = -index * 10
        mesh.position.y = Math.sin(index * 0.8) * 3
        mesh.position.x = Math.cos(index * 0.6) * 2
        mesh.castShadow = true
        mesh.receiveShadow = true

        // Add userData for interaction
        ;(mesh as any).userData = { index, project }

        cardGroup.add(mesh)
        cardsRef.current.push(mesh)
      })

      // Handle scroll
      const handleScroll = () => {
        if (!cameraRef.current || !cardsRef.current.length) return

        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
        const depth = scrollProgress * 100

        cameraRef.current.position.z = 6 - depth * 0.8

        cardsRef.current.forEach((card, index) => {
          card.rotation.x = scrollProgress * Math.PI * 0.5
          card.rotation.y = scrollProgress * Math.PI * 0.3 + index * 0.2
          card.rotation.z = Math.sin(scrollProgress * Math.PI + index) * 0.3

          const scale = 1 + Math.sin(scrollProgress + index * 0.5) * 0.15
          card.scale.set(scale, scale, 1)

          const wobble = Math.sin(Date.now() * 0.001 + index * 0.5) * 0.05
          card.position.y += wobble
        })
      }

      window.addEventListener('scroll', handleScroll, { passive: true })

      // Animation loop
      let animationFrameId: number
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate)

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          // Subtle auto-rotation when not scrolling
          cardsRef.current.forEach((card, index) => {
            card.rotation.z += 0.0002
          })

          // Pulsing lights
          if (pointLight1) {
            pointLight1.intensity = 1 + Math.sin(Date.now() * 0.001) * 0.3
          }
          if (pointLight2) {
            pointLight2.intensity = 0.8 + Math.cos(Date.now() * 0.0012) * 0.2
          }
          if (pointLight3) {
            pointLight3.intensity = 0.6 + Math.sin(Date.now() * 0.0015) * 0.25
          }

          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }

      animate()

      // Handle resize
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return
        const width = window.innerWidth
        const height = window.innerHeight
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationFrameId)

        if (rendererRef.current && containerRef.current) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement)
          } catch {
            // Already removed
          }
        }

        rendererRef.current?.dispose()
      }
    } catch (error) {
      console.error('Error initializing 3D scene:', error)
    }
  }, [projects])

  return (
    <div>
      <div ref={containerRef} className="w-full h-screen sticky top-0" />
      <div className="relative bg-black text-white px-12 lg:px-24 py-24">
        <div style={{ minHeight: `${Math.max(projects.length * 600, 3000)}px` }} className="space-y-96">
          {projects.map((project, index) => (
            <div key={project.id} className="opacity-40 hover:opacity-100 transition-opacity duration-500 py-24">
              <h3 className="text-5xl lg:text-6xl mb-6 leading-tight" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 600 }}>
                {index + 1}. {project.title}
              </h3>
              <p className="text-lg lg:text-xl text-gray-400 max-w-2xl">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
