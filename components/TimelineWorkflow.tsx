'use client'

import { useState } from 'react'

interface Stage {
  name: string
  capabilities: { name: string; nameBilingual: string }[]
}

const WORKFLOW_STAGES: Stage[] = [
  {
    name: 'Pre-Production',
    capabilities: [
      { name: 'Concept Development', nameBilingual: 'פיתוח קונספט' },
      { name: 'Art Direction', nameBilingual: 'ארט דיירקשן' },
      { name: 'Planning & Strategy', nameBilingual: 'תכנון ואסטרטגיה' },
    ],
  },
  {
    name: 'Production',
    capabilities: [
      { name: 'Video Cinematography', nameBilingual: 'צילום וידאו' },
      { name: 'Directing', nameBilingual: 'בימוי' },
      { name: 'Still Photography', nameBilingual: 'סטילס' },
      { name: 'Studio Management', nameBilingual: 'ניהול אולפן סטודיו' },
    ],
  },
  {
    name: 'Post-Production',
    capabilities: [
      { name: 'Digital Design', nameBilingual: 'עיצוב דיגיטלי' },
      { name: 'Graphic Branding', nameBilingual: 'מיתוג גרפי' },
      { name: 'Editing & Color', nameBilingual: 'עריכה וצבע' },
    ],
  },
]

export default function TimelineWorkflow() {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null)

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          FROM CONCEPT TO CREATION
        </h2>
        <p className="text-gray-400 text-lg">
          A comprehensive approach to visual storytelling across every production stage
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="absolute top-20 left-0 right-0 hidden md:block h-0.5 bg-gradient-to-r from-pink-500 via-pink-500 to-gray-700" />

          {/* Stage Cards */}
          {WORKFLOW_STAGES.map((stage, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredStage(index)}
              onMouseLeave={() => setHoveredStage(null)}
              className="relative"
            >
              {/* Circle Marker */}
              <div className="flex justify-center mb-8">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                    hoveredStage === index
                      ? 'bg-pink-500 scale-125 shadow-lg shadow-pink-500/50'
                      : 'bg-gray-700 scale-100'
                  }`}
                >
                  {index + 1}
                </div>
              </div>

              {/* Stage Card */}
              <div
                className={`rounded-lg p-8 transition-all duration-300 ${
                  hoveredStage === index
                    ? 'bg-gray-900 border border-pink-500 shadow-lg shadow-pink-500/20'
                    : 'bg-gray-950 border border-gray-800'
                }`}
              >
                <h3 className="text-xl font-bold mb-6 text-white">{stage.name}</h3>

                {/* Capabilities List */}
                <ul className="space-y-3">
                  {stage.capabilities.map((cap, capIndex) => (
                    <li
                      key={capIndex}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        hoveredStage === index ? 'translate-x-1' : ''
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-colors duration-300 ${
                          hoveredStage === index ? 'bg-pink-500' : 'bg-gray-600'
                        }`}
                      />
                      <div>
                        <p className="text-white font-medium">{cap.name}</p>
                        <p className="text-gray-500 text-sm">{cap.nameBilingual}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow (Desktop only) */}
              {index < WORKFLOW_STAGES.length - 1 && (
                <div className="hidden md:flex justify-end absolute -right-6 top-32">
                  <div
                    className={`text-3xl transition-all duration-300 ${
                      hoveredStage === index ? 'text-pink-500 translate-x-1' : 'text-gray-600'
                    }`}
                  >
                    →
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Timeline Indicator */}
        <div className="md:hidden flex justify-center gap-2 mt-12">
          {WORKFLOW_STAGES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                hoveredStage === index ? 'bg-pink-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="text-center mt-16 pt-12 border-t border-gray-800">
        <p className="text-gray-400 text-lg">
          Every project, every detail—crafted with precision and creative vision
        </p>
      </div>
    </section>
  )
}
